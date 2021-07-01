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
import { GetUserProfile } from "../../api";
import DefaultUser from "../../assets/svgs/defaultUser";

const User = () => {
  const params = useParams();
  const history = useHistory();

  const [userData, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await GetUserProfile(params.id);

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
              style={{ width: "8rem" }}
              color="primary"
              onClick={() => history.goBack()}
            >
              <strong>Back</strong>
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
                      <>{userData["name"] ? String(userData["name"]) : ""}</>
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
                    <td style={{ marginLeft: "9.8rem", borderTop: "none" }}>
                      <>{userData["email"] ? String(userData["email"]) : ""}</>
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
                    <td style={{ marginLeft: "9.8rem", borderTop: "none" }}>
                      <>
                        {userData["phone_no"]
                          ? String(userData["phone_no"])
                          : ""}
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
                    <td style={{ marginLeft: "6.8rem", borderTop: "none" }}>
                      <>
                        {userData["subscription_token_id"]
                          ? String(userData["subscription_token_id"])
                          : ""}
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
