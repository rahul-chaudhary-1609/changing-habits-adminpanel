import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { getStaticContentDetails, getFileContent } from "../../../api";
import { CButton } from "@coreui/react";
import StaticContentFrame from "../getFrame";
import apiConstant from "src/apiConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const ViewStaticContent = () => {
  const history = useHistory();
  const params = useParams();

  const [staticContentDetails, setStaticContentDetails] = useState([]);
  let [srcURL, setSrcURL] = useState(null);
  useEffect(() => {
    const getDetails = async () => {
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
    getDetails();
  }, [params.id]);

  return (
    <>
      <div className="main-content pb-16 md:pb-5 flex-1 pt-20 px-2">
        {staticContentDetails && (
          <div
            id="recipients"
            className="p-4 md:p-8 mt-6 lg:mt-0 rounded shadow bg-white"
          >
            <br />
            <div style={{ textAlign: "right" }}>
              <CButton
                style={{
                  cursor: "pointer",
                  backgroundColor: "gray",
                }}
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
                    title="Click to go back"
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
                onClick={() => history.push(`/editStaticContent/${params.id}`)}
              >
                <strong>Edit</strong>
              </CButton>
            </div>
            <div
              style={{
                marginTop: "20px",
                backgroundColor: "lightgrey",
                padding: "20px",
                width: "100%",
              }}
            >
              <div className="flex ">
                <h1 className="text-xl">{staticContentDetails.title}</h1>
              </div>

              <div className="flex mt-10 ">
                <div className="flex flex-col ml-40">
                  <br />
                  <StaticContentFrame srcURL={srcURL} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewStaticContent;
