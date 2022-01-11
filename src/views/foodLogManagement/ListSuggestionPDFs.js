import React, { useState, useEffect, useRef } from "react";
import { Route, useHistory, Link, useParams } from "react-router-dom";
import {
  CInputGroupText,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CButton,
  CDataTable,
  CBadge,
  CTooltip,
  CSwitch,
  CInputFile,
  CInputGroup,
  CInputGroupPrepend,
  CInput,
  CPagination,
  CSelect,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { upload } from "../../data/upload";

import {
  listSuggestionPdf,
  toggleSuggestionPdfStatus,
  updateSuggestionPdf,
} from "../../data/foodLogManagement";

import { StatusModal } from "../../utils/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

const ListSuggestionPDFs = () => {
  let [modal, setModal] = useState(false);
  let [toggleData, setToggleData] = useState(null);
  let [status, setStatus] = useState(true);
  let [data, setData] = useState([]);
  let [isLoading, setLoading] = useState(false);
  let [phaseId, setPhaseId] = useState();
  let [pdfUrl, setPdfUrl] = useState(null);

  let [mediaInput, setMediaInput] = useState({
    type: "image",
    source: null,
    isError: false,
    errorMessage: "PDF link is required",
  });

  let [errorResponse, setErrorResponse] = useState({
    message: null,
    code: null,
    isFound: false,
  });

  const fileInputRef = useRef();

  const fields = [
    { key: "id", label: "S.No.", _style: { width: "10%" } },
    { key: "phase_name", label: "Phase", _style: { width: "30%" } },
    { key: "status", label: "Status", _style: { width: "20%" } },
    { key: "action", label: "Action", _style: { width: "40%" } },
  ];

  let toggleModal = (item) => {
    setModal(!modal);
    setToggleData(item);
  };

  let toggleStatus = async (item) => {
    setModal(!modal);
    try {
      let req = {
        pathParams: {
          id: item.id,
        },
        data: {},
      };
      let response = await toggleSuggestionPdfStatus(req);
      setStatus(!status);
      setErrorResponse({ message: null, code: null, isFound: false });
    } catch (error) {
      setErrorResponse({
        message: error.message || null,
        code: error.status || null,
        isFound: true,
      });
    }
  };

  let formatData = (rows) => {
    let s_no = 0;
    return rows.map((row) => {
      return {
        s_no: ++s_no,
        ...row,
      };
    });
  };

  useEffect(() => {
    let req = {
      data: {
        phase_id: phaseId,
        pdf_url: pdfUrl,
      },
    };
    if (pdfUrl !== null) {
      updateSuggestionPdf(req)
        .then((response) => {
          setLoading(false);
          setErrorResponse({ message: null, code: null, isFound: false });
        })
        .catch((error) => {
          setLoading(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    }
    setPdfUrl(null);
  }, [pdfUrl]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await listSuggestionPdf();
        let updatedData = formatData(response.suggestionPdfList);
        setData([...updatedData]);
        setLoading(false);
        setErrorResponse({ message: null, code: null, isFound: false });
      } catch (error) {
        setData([]);
        if (error.message) {
          setLoading(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        }
      }
    };
    getData();
  }, [status, pdfUrl]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      let formData = new FormData();
      formData.append("folderName", "suggestion_pdf");
      formData.append("image", e.target.files[0]);
      let req = {
        data: formData,
      };
      setLoading(true);
      upload(req)
        .then((response) => {
          setErrorResponse({ message: null, code: null, isFound: false });
          setPdfUrl(response.image_url);
          setMediaInput({
            ...mediaInput,
            isError: false,
            source: response.image_url,
          });
        })
        .catch((error) => {
          setLoading(false);
          setMediaInput({ ...mediaInput, isError: true });
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    } else {
      setMediaInput({
        ...mediaInput,
        type: null,
        source: null,
        isError: true,
        errorMessage: "PDF link is required",
      });
    }
  };

  return (
    <CContainer>
      <StatusModal
        toggleModal={toggleModal}
        modal={modal}
        toggleData={toggleData}
        toggleStatus={toggleStatus}
        setStatus={setStatus}
        status={status}
        info={"Food Log Suggestion PDF"}
      />
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardBody>
              <CDataTable
                items={data}
                fields={fields}
                striped
                border
                addTableClasses="table-class"
                loading={isLoading}
                noItemsViewSlot={
                  !isLoading ? "" : <div style={{ height: "14rem" }}></div>
                }
                scopedSlots={{
                  action: (item, index) => {
                    return (
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <input
                            id="suggestion_pdf"
                            name="suggestion_pdf"
                            type="file"
                            style={{ cursor: "pointer", display: "none" }}
                            ref={fileInputRef}
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                          <label
                            onClick={() => {
                              fileInputRef.current.click();
                              setPhaseId(item.id);
                            }}
                          >
                            <CTooltip
                              content={"Upload Suggestion PDF"}
                              placement={"top-start"}
                            >
                              <FontAwesomeIcon
                                icon={faUpload}
                                style={{ color: "#008080", cursor: "pointer" }}
                                size="lg"
                              />
                            </CTooltip>
                          </label>
                          <CTooltip
                            content={`Download Suggestion PDF`}
                            placement={"top-start"}
                          >
                            <FontAwesomeIcon
                              icon={faDownload}
                              style={{ color: "#008080", cursor: "pointer" }}
                              size="lg"
                              onClick={() =>
                                (window.location.href = item.pdf_url)
                              }
                            />
                          </CTooltip>
                          <CSwitch
                            onChange={() => toggleModal(item)}
                            size="sm"
                            variant={"3d"}
                            color={"success"}
                            checked={item.status == 1 ? true : false}
                          />
                        </div>
                      </td>
                    );
                  },
                  status: (item, index) => {
                    return (
                      <td>
                        {item.status == 1 ? (
                          <CBadge color="success">Active</CBadge>
                        ) : (
                          <CBadge color="danger">Blocked</CBadge>
                        )}
                      </td>
                    );
                  },
                }}
              ></CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ListSuggestionPDFs;
