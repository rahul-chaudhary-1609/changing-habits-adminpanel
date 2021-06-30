import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { DeleteFaq, getFaqs } from "../../../api";
import { useHistory, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import {
  CPagination,
  CButton,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CModalTitle,
} from "@coreui/react";

const FAQS = () => {
  const history = useHistory();

  // const { id } = useParams();
  const path = useParams();
  const id = path.id;
  const topicid = path.topicid;

  const [statusOpened, setStatusOpened] = useState({});
  const [qus, setQus] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const [questionId, setQuestionId] = useState(null);

  const [show, setShow] = useState(null);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [startId, setStartId] = useState(0);
  let endId = qus && (startId < 0 ? 0 : startId + qus.length);

  const handleCollapse = (e, id) => {
    // let updatedStatus = { ...statusOpened };
    let updatedStatus = { statusOpened };
    updatedStatus[id] = !updatedStatus[id];
    setStatusOpened(updatedStatus);
  };

  useEffect(() => {
    handleQuestions();
  }, [topicid, activePage]);

  const handleQuestions = async () => {
    const data = await getFaqs(activePage);
    if (data.status == 200) {
      setError(null);
      let rows = data.faqsData.rows;
      let status = {};
      rows.forEach(({ id }) => (status[id] = false));
      setStatusOpened(status);
      setQus(data.faqsData.rows);
      setTotalItems(data.faqsData.count);
      let newStartId = pageSize * (activePage - 1);
      setStartId(newStartId);
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

  return (
    <>
      <CModal
        show={deleteModal}
        centered={true}
        backdrop={true}
        color="warning"
        onClose={setDeleteModal}
      >
        <CModalHeader closeButton>
          <CModalTitle>Delete FAQ?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to Delete this FAQ question?
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={handleDelete}>
            Yes
          </CButton>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
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
          <div style={{ marginLeft: "80%", marginTop: "-88px" }}>
            <CButton
              style={{ height: "3rem" }}
              onClick={() => history.goBack()}
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              color="primary"
            >
              Back
            </CButton>
            <CButton
              style={{ height: "3rem" }}
              onClick={() => history.push(`/viewStaticContent/${id}/addFaqs`)}
              className="shadow bg-blue-500 ml-3 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              color="primary"
            >
              Add New
            </CButton>
          </div>
        </div>
        <div className="flex ">
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
                                <FontAwesomeIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    history.push(
                                      `/viewStaticContent/${id}/faqs/${ques.id}/editFaqs`
                                    )
                                  }
                                  className="text-red-600 trash w-5 h-5"
                                  color="red"
                                  icon={faPencilAlt}
                                />
                                <FontAwesomeIcon
                                  className="text-red-600 trash w-5 h-5 ml-4"
                                  color="red"
                                  onClick={() => {
                                    setShow("question");
                                    setDeleteModal(true);
                                    setQuestionId(ques.id);
                                  }}
                                  icon={faTrashAlt}
                                />
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      </>
                    );
                  })
                )}
                <br />
                (showing {startId < 0 ? 0 : startId + 1} - {endId} of{" "}
                {totalItems})
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
