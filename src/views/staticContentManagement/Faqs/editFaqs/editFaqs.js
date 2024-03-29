import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { getFaqById, editFaqs } from "../../../../api";
import Loader from "../../../../globalComponent/loader";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditFqs = () => {
  const history = useHistory();
  const path = useParams();
  const id = path.questionId;

  const [faqs, setFaqs] = useState({});
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    faqById();
  }, []);

  const faqById = () => {
    const res = getFaqById(id)
      .then((res) => {
        setFaqs(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleValidation = () => {
    let error = false;
    if (faqs.question === "") {
      setError("Please fill the question ");
      error = true;
    } else if (faqs.answer === "") {
      setError("Please fill the answer ");
      error = true;
    }
    return error;
  };

  const handleSubmit = () => {
    console.log("------------------------");
    setSubmitting(true);
    if (!handleValidation()) {
      let bodyData = {};
      bodyData.question = faqs.question;
      bodyData.answer = faqs.answer;

      const res = editFaqs(faqs.id, bodyData)
        .then((res) => {
          if (res.status == 200) {
            setError(null);
            setSuccessMsg("FAQ updated successfully");
            setTimeout(() => {
              history.push(`/viewStaticContent/${id}/faqs`);
            }, 1000);
          }
        })
        .catch((error) => {
          setSubmitting(false)
          setError(error);
        });
    }

  };
  return (
    <>
      <div className="main-content pb-16 md:pb-5 flex-1 pt-20 px-2">
        <div
          id="recipients"
          className="p-4 md:p-8 mt-6 lg:mt-0 rounded shadow bg-white"
        >
          <h1 className="text-2xl">Edit FAQ</h1>
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
                  onClick={() => history.goBack()}
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
              onClick={handleSubmit}
              disabled={submitting}
            >
              <strong>Save</strong>
            </CButton>
          </div>
          <br />
          {error && (
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
          )}
          {successMsg && (
            <div
              style={{
                backgroundColor: "#9ACD32",
                padding: "10px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "24px",
                width: "fit-content",
              }}
            >
              {successMsg}
            </div>
          )}

          {!faqs ? (
            <Loader />
          ) : (
            <div
              style={{
                marginTop: "20px",
                backgroundColor: "lightgray",
                padding: "20px",
                height: "400px",
              }}
            >
              <div className="flex mt-10 ">
                <h1 className="text-xl ml-50 ">Question</h1>
                <input
                  style={{
                    width: "70%",
                    marginLeft: "140px",
                    height: "40px",
                    padding: "10px",
                  }}
                  placeholder="Enter the question "
                  value={faqs.question}
                  onChange={(e) => {
                    let updatedData = { ...faqs };
                    updatedData["question"] = e.target.value;
                    setFaqs(updatedData);
                  }}
                />
              </div>

              <div className="flex mt-10 ">
                <h1 className="text-xl ml-50 ">Answer</h1>
                <textarea
                  placeholder="Enter the answer "
                  style={{
                    width: "70%",
                    height: "170px",
                    marginLeft: "140px",
                    padding: "10px",
                  }}
                  id="ans"
                  value={faqs.answer}
                  onChange={(e) => {
                    let updatedData = { ...faqs };
                    updatedData["answer"] = e.target.value;
                    setFaqs(updatedData);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditFqs;
