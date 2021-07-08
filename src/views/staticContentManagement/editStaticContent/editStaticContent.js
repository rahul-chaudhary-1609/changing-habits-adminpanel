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
import StaticContentFrame from "../getFrame";
import apiConstant from "src/apiConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditStaticContent = () => {
  const history = useHistory();
  const params = useParams();
  const [staticContentDetails, setStaticContentDetails] = useState(null);
  let [srcURL, setSrcURL] = useState(null);

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [image_url, setImage_url] = useState(null);
  const [filename, setFilename] = useState(null);

  useEffect(() => {
    const getContent = async () => {
      try {
        getStaticContentDetails(Number(params.id)).then((data) => {
          setStaticContentDetails(data.staticContentDetails);
          setSrcURL(
            `${apiConstant.baseURL}/${apiConstant.getTextFromHTML}?file_url=${data.staticContentDetails.page_url}`
          );
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
      setSrcURL(
        `${apiConstant.baseURL}/${apiConstant.getTextFromHTML}?file_url=${url}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitUpdatedFile = async () => {
    let data = {
      content_id: params.id,
      page_url: image_url,
    };
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
            className="p-3 md:p-8 mt-6 lg:mt-0 rounded shadow bg-white"
          >
            <br />
            <div style={{ textAlign: "right" }}>
              <CButton
                style={{ cursor: "pointer", backgroundColor: "gray" }}
                title="Click to go back"
              >
                <strong>
                  {" "}
                  <FontAwesomeIcon
                    color="white"
                    size="lg"
                    style={{ cursor: "pointer", color: "black" }}
                    icon={faArrowLeft}
                    onClick={() => history.goBack()}
                  />
                </strong>
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
                height: "550px",
              }}
            >
              <div className="flex ">
                <h1 className="text-xl">{staticContentDetails.title}</h1>
              </div>
              <div className="flex mt-10 ">
                <div className="flex flex-col ml-40">
                  <StaticContentFrame srcURL={srcURL} />

                  <div style={{ display: "flex" }}>
                    <label for="upload" className="w-24 block ">
                      <div className="w-full px-2 py-1 ml-5 my-2 flex justify-around items-center bg-gray-800 rounded-lg text-white">
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
                  <div style={{ textAlign: "center" }}>
                    <CButton
                      type="submit"
                      onClick={handleSubmitUpdatedFile}
                      style={{
                        width: "75px",
                        backgroundColor: "teal",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Save
                    </CButton>
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
