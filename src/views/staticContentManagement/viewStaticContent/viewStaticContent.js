import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { getStaticContentDetails, getFileContent } from "../../../api";
import { CButton } from "@coreui/react";
import StaticContentFrame from "../getFrame";
import apiConstant from "src/apiConstants";
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
          setSrcURL(`${apiConstant.baseURL}/${apiConstant.getTextFromHTML}?file_url=${data.staticContentDetails.page_url}`)
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
              onClick={() => history.push(`/editStaticContent/${params.id}`)}
              className="shadow bg-blue-500 ml-3 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              color="primary"
            >
              Edit
            </CButton>

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
                  <StaticContentFrame srcURL={ srcURL}/>
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
