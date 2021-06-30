import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { CButton } from "@coreui/react";
import { addFaq } from "../../../../api";
import { useSelector } from "react-redux";

const AddFaqs = () => {
  const token = useSelector((state) => state.auth.isSignedIn);
  const history = useHistory();
  const { id } = useParams();

  const [data, setData] = useState({
    answer: "",
    question: "",
  });

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleValidation = () => {
    let error = false;
    if (data.question === "") {
      setError("Please fill the question ");
      error = true;
    } else if (data.answer === "") {
      setError("Please fill the answer ");
      error = true;
    }
    return error;
  };

  const handleSubmit = async () => {
    if (!handleValidation()) {
      const res = await addFaq(data)
        .then((res) => {
          setSuccessMsg("FAQs added successfully");
          setTimeout(() => {
            history.push(`/viewStaticContent/${id}/faqs`);
          }, 1000);

          setError(null);
        })
        .catch((error) => {
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
          <h1 className="text-2xl">Add FAQ</h1>
          <br />
          <div style={{ marginLeft: "80%", marginTop: "-78px" }}>
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
              onClick={handleSubmit}
              className="shadow bg-blue-500 ml-3 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              color="primary"
            >
              Save
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
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "lightgrey",
              padding: "20px",
              // width: '990px',
              height: "400px",
            }}
          >
            <div className="flex mt-10 ">
              <h1 className="text-xl ml-50 ">Question</h1>
              <input
                style={{
                  width: "70%",
                  marginLeft: "110px",
                  height: "40px",
                  padding: "10px",
                }}
                placeholder="Enter the question"
                onChange={(e) => {
                  let updatedData = { ...data };
                  updatedData["question"] = e.target.value;
                  setData(updatedData);
                }}
              />
            </div>

            <div className="flex mt-10 ">
              <h1 className="text-xl ml-50 ">Answer</h1>
              <textarea
                placeholder="Enter the answer"
                style={{
                  width: "70%",
                  height: "100px",
                  marginLeft: "110px",
                  padding: "10px",
                }}
                id="ans"
                onChange={(e) => {
                  let updatedData = { ...data };
                  updatedData["answer"] = e.target.value;
                  setData(updatedData);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFaqs;
