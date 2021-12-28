import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  CDataTable,
  CBadge,
  CTooltip,
  CSwitch,
  CButton,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CInput,
  CCol,
  CPagination,
  CContainer,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
} from "@coreui/react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import {
  listReason,
  deleteReason,
} from "../../data/weightGainReasonManagement";
import { DeleteModal } from "src/utils/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { phaseList } from "../../utils/helper";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function ListWeightGainReason() {
  let history = useHistory();

  let [data, setData] = useState([]);
  let [dataCount, setDataCount] = useState(0);
  let [isLoading, setLoading] = useState(false);
  let [page, setPage] = useState({
    size: 10,
    number: 1,
  });
  let [searchKey, setSearchKey] = useState(null);
  let [searchValue, setSearchValue] = useState("");
  let [errorResponse, setErrorResponse] = useState({
    message: null,
    code: null,
    isFound: false,
  });
  let [status, setStatus] = useState(true);
  let [modal, setModal] = useState(false);
  let [toggleData, setToggleData] = useState(null);

  const fields = [
    { key: "s_no", label: "S.No.", _style: { width: "4%" } },
    { key: "weight_gain", lable: "Weight Gain", _style: { width: "20%" } },
    { key: "reason", lable: "Reason", _style: { width: "40%" } },
    { key: "phase_id", label: "Phase", _style: { width: "16%" } },
    { key: "action", label: "Action", _style: { width: "20%" } },
  ];

  let toggleModal = (item) => {
    setModal(!modal);
    setToggleData(item);
  };

  let deleteQuestion = (item) => {
    setModal(!modal);
    let req = {
      pathParams: {
        id: item.id,
      },
      data: {},
    };
    deleteReason(req)
      .then((response) => {
        setStatus(!status);
        setErrorResponse({ message: null, code: null, isFound: false });
      })
      .catch((error) => {
        setErrorResponse({
          message: error.message || null,
          code: error.status || null,
          isFound: true,
        });
      });
  };

  let formatData = (rows) => {
    let s_no = (page.number - 1) * page.size;
    return rows.map((row) => {
      return {
        s_no: ++s_no,
        posted_date: row.createdAt,
        ...row,
      };
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        let req = {
          queryParams: {
            searchKey: searchKey,
            page: page.number,
            page_size: page.size,
          },
        };
        setLoading(true);
        let response = await listReason(req);
        let updatedData = formatData(response.rows);
        setData([...updatedData]);
        setDataCount(response.count);
        setLoading(false);
        setErrorResponse({ message: null, code: null, isFound: false });
      } catch (error) {
        setData([]);
        setDataCount(0);
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
  }, [page.number, searchKey, status]);

  return (
    <CContainer>
      <DeleteModal
        toggleModal={toggleModal}
        modal={modal}
        toggleData={toggleData}
        deleteQuestion={deleteQuestion}
        setStatus={setStatus}
        status={status}
        info={"reason"}
      />
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
              <h2>Weight Loss/Gain Reason Management</h2>
              <CButton
                style={{
                  width: "5rem",
                  float: "right",
                  backgroundColor: "#008080",
                  color: "#fff",
                }}
                onClick={() => history.push("/addWeightGainReason")}
              >
                <strong>Add</strong>
              </CButton>
              {/* </div> */}
            </CCardHeader>
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
                overTableSlot={
                  <CCol style={{ marginBottom: "1rem", display: "flex" }}>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText
                          style={{ backgroundColor: "#008080", color: "#fff" }}
                        >
                          <CIcon name={"cilSearch"} />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        style={{ maxWidth: "14rem" }}
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Search by weight"
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                        }}
                        autoComplete="off"
                      />
                      <CButton
                        style={{
                          marginLeft: "1rem",
                          backgroundColor: "#008080",
                          color: "#fff",
                        }}
                        onClick={() => {
                          setSearchKey(
                            searchValue.trim() != "" ? searchValue.trim() : null
                          );
                        }}
                      >
                        Search
                      </CButton>
                      <CButton
                        style={{
                          marginLeft: "1rem",
                          backgroundColor: "#008080",
                          color: "#fff",
                        }}
                        onClick={() => {
                          setSearchValue("");
                          setSearchKey(null);
                        }}
                      >
                        Reset
                      </CButton>
                    </CInputGroup>
                  </CCol>
                }
                underTableSlot={
                  <CCol style={{ marginBottom: "1rem" }}>
                    {/* {dataCount == 0 ? <div>Showing  0 - 0 of 0</div> : <div>Showing {page.number} - {page.number + page.size - 1} of {dataCount}</div>} */}
                    {dataCount == 0 ? (
                      <div>Showing 0 - 0 of 0</div>
                    ) : page.number * page.size > dataCount ? (
                      <div>
                        Showing {(page.number - 1) * page.size + 1} -{" "}
                        {dataCount} of {dataCount}
                      </div>
                    ) : (
                      <div>
                        Showing {(page.number - 1) * page.size + 1} -{" "}
                        {page.number * page.size} of {dataCount}
                      </div>
                    )}
                  </CCol>
                }
                scopedSlots={{
                  reason: (item, index) => {
                    return (
                      <td align="justify">
                        <div style={{ maxHeight: "150px", overflow: "scroll" }}>
                          <ul>
                            {item.reason.map((ele, index) => {
                              return (
                                <>
                                  <li>{`${ele}`}</li>
                                </>
                              );
                            })}
                          </ul>
                        </div>{" "}
                      </td>
                    );
                  },
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
                          <CTooltip
                            content={"Edit Weight Gain Reason"}
                            placement={"top-start"}
                          >
                            <CIcon
                              style={{ color: "black", cursor: "pointer" }}
                              size="lg"
                              name={"cilPencil"}
                              onClick={() =>
                                history.push(`/editWeightGainReason/${item.id}`)
                              }
                            />
                          </CTooltip>
                          <CTooltip
                            content={`View Weight Gain Reason`}
                            placement={"top-start"}
                          >
                            <FontAwesomeIcon
                              color="green"
                              size="lg"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                history.push({
                                  pathname: `/viewWeightGainReason/${item.id}`,
                                })
                              }
                              icon={faEye}
                            />
                          </CTooltip>
                          <CTooltip
                            content={`Delete Weight Gain Reason`}
                            placement={"top-start"}
                          >
                            <CIcon
                              style={{ color: "red", cursor: "pointer" }}
                              size="lg"
                              name={"cilTrash"}
                              onClick={() => toggleModal(item)}
                            />
                          </CTooltip>
                        </div>
                      </td>
                    );
                  },
                  phase_id: (item, index) => {
                    return (
                      <td>
                        <ul
                          style={{
                            listStyleType: "none",
                            padding: "0",
                            margin: "0",
                          }}
                        >
                          {phaseList
                            .filter((ph) => item.phase_id.includes(ph.id))
                            .map((ph) => {
                              return <li>{ph.name}</li>;
                            })}
                        </ul>
                      </td>
                    );
                  },
                }}
              ></CDataTable>
              <CPagination
                activePage={page.number}
                pages={Math.ceil(dataCount / page.size)}
                onActivePageChange={(i) => {
                  if (i == 0) i = 1;
                  setPage({ ...page, number: i });
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default ListWeightGainReason;
