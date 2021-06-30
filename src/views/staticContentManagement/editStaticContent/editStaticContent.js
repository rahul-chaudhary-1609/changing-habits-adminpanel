import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import {
  getStaticContentDetails,
  updateStaticContent,
  uploadImage,
  getFileContent,
} from "../../../api";
import Loader from "../../../globalComponent/loader";
import { CButton } from "@coreui/react";

const EditStaticContent = () => {
  const history = useHistory();
  const params = useParams();
  const [staticContentDetails, setStaticContentDetails] = useState(null);

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [image_url, setImage_url] = useState(null);
  const [filename, setFilename] = useState(null);

  useEffect(() => {
    const getContent = async () => {
      try {
        const data = getStaticContentDetails(Number(params.id)).then((data) => {
          const Details = getFileContent(
            data.staticContentDetails.page_url
          ).then((Details) => {
            document.getElementById("doc").innerHTML = Details;
            console.log(Details);
          });

          setStaticContentDetails(data.staticContentDetails);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getContent();
  }, []);

  const handleUploadFile = async (e) => {
    setFilename(e.target.files[0].name);

    const bodyFormData = new FormData();
    bodyFormData.append("image", e.target.files[0], e.target.files[0].name);
    bodyFormData.append("folderName", "other");
    try {
      const res = await uploadImage(bodyFormData);
      if (res.status == 200) {
        setError(null);
        updateContent(res.data.image_url);
        setImage_url(res.data.image_url);
      }
    } catch (error) {
      setError(error);
    }
  };

  const updateContent = (url) => {
    try {
      const Details = getFileContent(url).then((Details) => {
        document.getElementById("doc").innerHTML = Details;
        console.log(Details);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitUpdatedFile = async () => {
    var data = new FormData();

    data.append("content_id", params.id);
    data.append("page_url", image_url);
    try {
      const res = await updateStaticContent(data);
      if (res.status == 200) {
        setSuccessMsg("Content updated successfully");
        setTimeout(() => {
          history.push("/static");
        }, 1000);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <div className="main-content pb-16 md:pb-5 flex-1 pt-20 px-2">
        {!staticContentDetails ? (
          <Loader />
        ) : (
          <div
            id="recipients"
            className="p-4 md:p-8 mt-6 lg:mt-0 rounded shadow bg-white"
          >
            <br />
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
              onClick={handleSubmitUpdatedFile}
              className="shadow bg-blue-500 ml-3 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              color="primary"
            >
              Save
            </CButton>
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
                height: "610px",
              }}
            >
              <div className="flex ">
                <h1 className="text-xl">{staticContentDetails.title}</h1>
              </div>
              <div className="flex mt-10 ">
                <div className="flex flex-col ml-40">
                  <div
                    id="doc"
                    style={{
                      marginLeft: "70px",
                      fontSize: "15px",
                      marginLeft: "10px",
                      maxHeight: "200px",
                      height: "300px",
                      overflow: "auto",
                      padding: "10px",
                      border: "1px solid black",
                    }}
                  ></div>
                  <div style={{ display: "flex" }}>
                    <label for="upload" className="w-24 block ">
                      <div className="w-full px-2 py-1 ml-5 my-2 flex justify-around items-center bg-gray-400 rounded-lg text-white">
                        Upload File
                        <input
                          type="file"
                          onChange={handleUploadFile}
                          id="upload"
                          style={{ display: "none", padding: "10px" }}
                          accept=".html"
                        />
                      </div>
                    </label>
                    <span
                      style={{
                        color: "red",
                        paddingTop: "13px",
                        paddingLeft: "10px",
                      }}
                    >
                      Upload file of type html
                    </span>
                    {filename && (
                      <p
                        style={{
                          marginTop: "12px",
                          fontSize: "15px",
                          marginLeft: "10px",
                        }}
                      >
                        {filename}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditStaticContent;
