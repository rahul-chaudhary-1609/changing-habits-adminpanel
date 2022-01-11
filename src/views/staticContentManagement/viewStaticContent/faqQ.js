import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { DeleteFaq, getFaqs, ToggleFaqStatus } from "../../../api";
import { useHistory, useParams } from "react-router";
import { freeSet } from "@coreui/icons";
import _ from "lodash";
import {
  CPagination,
  CButton,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CModalTitle,
  CSwitch,
  CTooltip,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const FAQS = () => {
  const history = useHistory();

  // const { id } = useParams();
  const path = useParams();
  const id = path.id;

  const [statusOpened, setStatusOpened] = useState({});
  const [qus, setQus] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const [questionId, setQuestionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enableModal, setEnableModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [show, setShow] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);
  const [activePage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [onsearchCHange, setOnSearchChange] = useState("");

  const handleCollapse = (e, id) => {
    let updatedStatus = { ...statusOpened };
    // let updatedStatus = { statusOpened };
    updatedStatus[id] = !updatedStatus[id];
    setStatusOpened(updatedStatus);
  };

  const toggleEnable = (data) => {
    setUserId(data.id);
    setActive(data.status);
    setEnableModal(!enableModal);
  };

  const handleEnable = async () => {
    try {
      setEnableModal(!enableModal);
      await ToggleFaqStatus(userId);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleQuestions();
  }, [refresh, activePage]);

  const handleQuestions = async () => {
    if (refresh) setRefresh(!refresh);

    const data = await getFaqs(activePage ? activePage : 1, onsearchCHange);
    if (data.status == 200) {
      setError(null);
      let rows = data.faqsData.rows;
      let Status = {};
      rows.forEach(({ id }) => (Status[id] = false));
      setStatusOpened(Status);
      setQus(data.faqsData.rows);
      setTotalItems(data.faqsData.count);
      let newStartId = 10 * (activePage - 1);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteModal(!deleteModal);
      const deleteResult = await DeleteFaq(questionId);
      if (deleteResult.status == 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async () => {
    setRefresh(!refresh);
    onsearchCHange &&
      history.push(
        `/viewStaticContent/${id}/faqs?search=${onsearchCHange}&page=${activePage ? activePage : 1
        }`
      );
  };

  const handleReset = () => {
    setOnSearchChange("");
    setRefresh(!refresh);
    history.push(
      `/viewStaticContent/${id}/faqs?page=${activePage ? activePage : 1}`
    );
  };

  return (
    <>
      <CModal
        show={deleteModal}
        centered={true}
        backdrop={true}
        onClose={setDeleteModal}
      >
        <CModalHeader
          style={{ backgroundColor: "teal", color: "white" }}
          closeButton
        >
          <CModalTitle>Delete FAQ?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to Delete this FAQ question?
        </CModalBody>
        <CModalFooter>
          <CButton
            onClick={handleDelete}
            style={{ backgroundColor: "teal", color: "white" }}
          >
            Yes
          </CButton>
          <CButton color="danger" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        show={enableModal}
        centered={true}
        onClose={setEnableModal}
        backdrop={true}
        style={{ fontFamily: "Poppins" }}
      >
        <CModalHeader
          style={{ height: "3rem", backgroundColor: "teal", color: "white" }}
        >
          <CModalTitle>{active ? "Disable Faq?" : "Enable Faq?"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {active
            ? "Are you sure you want to disable this Faq?"
            : "Are you sure you want to enable this Faq?"}
        </CModalBody>
        <CModalFooter style={{ height: "4rem" }}>
          <CButton
            style={{ backgroundColor: "teal", color: "white" }}
            onClick={handleEnable}
          >
            Yes
          </CButton>{" "}
          <CButton color="danger" onClick={() => setEnableModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      <div
        className="main-content pb-16 md:pb-5 flex-1 pt-20 px-2"
        style={{ height: "100vh" }}
      >
        <div id="recipients" className="p-4 md:p-8 mt-6 lg:mt-0 rounded  ">
          <h1 className="text-3xl">FAQs</h1>
          <br />
          <div style={{ textAlign: "right", marginTop: "-88px" }}>
            <CButton
              style={{
                cursor: "pointer",
                backgroundColor: "gray",
              }}
              title="Click to go back"
            >
              <strong>
                {" "}
                <FontAwesomeIcon
                  color="white"
                  size="lg"
                  style={{
                    cursor: "pointer",
                    color: "black",
                  }}
                  icon={faArrowLeft}
                  onClick={() => history.push('/static')}
                />
              </strong>
            </CButton>
            <CButton
              style={{
                width: "5rem",
                backgroundColor: "teal",
                color: "white",
                marginLeft: "10px",
              }}
              title="Click to add"
              onClick={() => history.push(`/viewStaticContent/${id}/addFaqs`)}
            >
              <strong>Add</strong>
            </CButton>
          </div>
        </div>
        <div className="flex ">
          <div
            style={{
              paddingLeft: "87px",
              marginBottom: "-23px",
              paddingTop: "15px",
            }}
          >
            <CInputGroup>
              <CInputGroupPrepend>
                <CInputGroupText
                  style={{ backgroundColor: "teal", color: "white" }}
                >
                  <CIcon content={freeSet.cilSearch} />
                </CInputGroupText>
              </CInputGroupPrepend>
              <CInput
                style={{ maxWidth: "15rem" }}
                value={onsearchCHange}
                onChange={(e) => {
                  setOnSearchChange(e.target.value);
                }}
                autoComplete="off"
                id="input1-group1"
                name="input1-group1"
                placeholder="Search by Question"
              />

              <CButton
                onClick={handleSearch}
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "teal",
                  color: "white",
                }}
              >
                Search
              </CButton>
              <CButton
                onClick={() => {
                  handleReset();
                }}
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "teal",
                  color: "white",
                }}
              >
                Reset
              </CButton>
            </CInputGroup>
          </div>
          {qus && (
            <div
              style={{
                marginLeft: "90px",
                backgroundColor: "white",
                padding: "20px",
                height: "fit-content",
                marginTop: "50px",
                border: error != null ? "1px solid white" : "1px solid black",
              }}
            >
              <div
                id="doc"
                style={{
                  height: "fit-content",
                }}
              >
                {error ? (
                  <p
                    style={{
                      color: "red",
                      fontSize: "20px",
                      textAlign: "center",
                      width: "100%",
                      marginTop: "12px",
                    }}
                  >
                    {error}
                  </p>
                ) : (
                  qus.map((ques) => {
                    return (
                      <>
                        <div
                          style={{
                            width: "100%",
                            padding: "10px",
                          }}
                          onClick={(e) => handleCollapse(e, ques.id)}
                        >
                          <label
                            htmlFor={"acc" + ques.id}
                            style={{ fontSize: "20px", wordBreak: "break-all" }}
                            className="font-semibold"
                          >
                            {ques.question}
                            {!statusOpened[ques.id] ? (
                              <ArrowDropDownIcon style={{ float: "right" }} />
                            ) : (
                              <ArrowDropUpIcon style={{ float: "right" }} />
                            )}
                          </label>
                          <Collapse
                            isOpened={statusOpened[ques.id]}
                            id={"acc" + ques.id}
                          >
                            <div
                              style={{
                                backgroundColor: "lightgrey",
                                padding: "10px",
                                marginTop: "3px",
                              }}
                            >
                              <p style={{ fontSize: "17px" }}>{ques.answer}</p>
                              <div style={{ textAlign: "right" }}>
                                <CTooltip
                                  content={"Edit Faq"}
                                  placement={"top-start"}
                                >
                                  <CIcon
                                    onClick={() =>
                                      history.push(
                                        `/viewStaticContent/${id}/faqs/${ques.id}/editFaqs`
                                      )
                                    }
                                    style={{
                                      color: "black",
                                      cursor: "pointer",
                                      marginBottom: "10px",
                                    }}
                                    size="lg"
                                    content={freeSet.cilPencil}
                                  />
                                </CTooltip>

                                <CTooltip
                                  content={`Delete Faq
                          `}
                                  placement={"top-start"}
                                  interactive={true}
                                  trigger="mouseenter"
                                >
                                  <CIcon
                                    onClick={() => {
                                      setShow("question");
                                      setDeleteModal(true);
                                      setQuestionId(ques.id);
                                    }}
                                    size="lg"
                                    style={{
                                      color: "red",
                                      cursor: "pointer",
                                      outline: "none",
                                      boxShadow: "none",
                                      marginBottom: "13px",
                                      marginLeft: "5px",
                                    }}
                                    content={freeSet.cilTrash}
                                  />
                                </CTooltip>
                                <CSwitch
                                  onChange={() => toggleEnable(ques)}
                                  size="sm"
                                  style={{ marginLeft: "10px" }}
                                  variant={"3d"}
                                  color={"success"}
                                  checked={ques.status}
                                />
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      </>
                    );
                  })
                )}
                {qus.length < 1 ? (
                  <p
                    style={{
                      color: "red",
                      fontSize: "20px",
                      textAlign: "center",
                      width: "100%",
                      marginTop: "12px",
                    }}
                  >
                    No Items Found
                  </p>
                ) : (
                  ""
                )}
                <br /> (showing{" "}
                {qus.length < 1
                  ? 0
                  : qus.length < 11
                    ? 1
                    : 10 * (activePage - 1) + 1}{" "}
                - {qus.length} of {totalItems})
                <div style={{ textAlign: "right" }}>
                  <CPagination
                    activePage={activePage}
                    pages={Math.ceil(totalItems / 10)}
                    onActivePageChange={handlePageChange}
                    doubleArrows={true}
                    align="start"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FAQS;
