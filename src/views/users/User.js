import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CImg,
  CCardHeader,
  CButton,
} from "@coreui/react";
import { useHistory, useParams } from "react-router-dom";
import { GetUserManagementDetails } from "../../api";
import DefaultUser from "../../assets/svgs/defaultUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const params = useParams();
  const history = useHistory();

  const [userData, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await GetUserManagementDetails(params.id);

        setData(res);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [params.id]);

  return (
    <CRow alignHorizontal="center" alignVertical="center">
      <CCol xl>
        <CCard align="center">
          <CCardHeader
            style={{
              fontFamily: "Lato",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <h2>
              <strong>User Details</strong>
            </h2>
            <CButton
              style={{ backgroundColor: "gray" }}
              onClick={() => history.goBack()}
            >
              <strong>
                <FontAwesomeIcon
                  color="white"
                  size="lg"
                  style={{ cursor: "pointer", color: "black" }}
                  icon={faArrowLeft}
                />
              </strong>
            </CButton>
          </CCardHeader>
          <CCardBody>
            {userData && userData.profile_picture_url ? (
              <>
                <CImg
                  src={userData.profile_picture_url}
                  className="c-avatar-img"
                  alt="admin@bootstrapmaster.com"
                  style={{
                    marginBottom: "2rem",
                    width: "6rem",
                    height: "6rem",
                  }}
                />
                <br />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Profile Picture
                </span>
              </>
            ) : (
              <DefaultUser style={{ marginBottom: "2rem" }} />
            )}
            {userData ? (
              <table className="table table-striped table-hover">
                <tbody style={{ fontFamily: "Poppins" }}>
                  <tr
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <td
                      style={{
                        marginLeft: "8rem",
                        borderTop: "none",
                      }}
                    >
                      <strong>User Name</strong>
                    </td>
                    <td style={{ marginLeft: "8rem", borderTop: "none" }}>
                      <>{userData["name"] ? String(userData["name"]) : "N/A"}</>
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <td style={{ marginLeft: "8rem", borderTop: "none" }}>
                      <strong>Email</strong>
                    </td>
                    <td style={{ marginLeft: "10.4rem", borderTop: "none" }}>
                      <>
                        {userData["email"] ? String(userData["email"]) : "N/A"}
                      </>
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <td style={{ marginLeft: "8rem", borderTop: "none" }}>
                      <strong>Mobile</strong>
                    </td>
                    <td style={{ marginLeft: "10rem", borderTop: "none" }}>
                      <>
                        {userData["phone_no"]
                          ? String(userData["phone_no"])
                          : "N/A"}
                      </>
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <td style={{ marginLeft: "8rem", borderTop: "none" }}>
                      <strong>Subscription token id</strong>
                    </td>
                    <td style={{ marginLeft: "3.8rem", borderTop: "none" }}>
                      <>
                        {userData["subscription_token_id"]
                          ? String(userData["subscription_token_id"])
                          : "N/A"}
                      </>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default User;
