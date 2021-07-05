import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CImg,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
} from "@coreui/react";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { GetUserProfile } from "../../api";
import DefaultUser from "../../assets/svgs/defaultUser";

export default function AdminProfile() {
  const history = useHistory();
  const location = useLocation();
  const userId = useSelector((state) => state.auth.userId);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await GetUserProfile();
        setUserData(res);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return userData ? (
    <CRow alignHorizontal="center" alignVertical="center">
      <CCol xl>
        <CModal
          show={location.state ? true : false}
          size={location.state && location.state.type === "edit" ? "sm" : ""}
          backdrop={false}
          color="warning"
        >
          <CModalHeader closeButton>
            {/* <CModalTitle>Block User Account?</CModalTitle> */}
            {location.state && location.state.data ? location.state.data : ""}
          </CModalHeader>
        </CModal>
        <CCard>
          <CCardHeader
            style={{
              fontFamily: "Lato",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <h2>
              <strong>Admin Profile</strong>
            </h2>
            <CButton
              style={{ width: "8rem" }}
              color="success"
              onClick={() =>
                history.push({
                  pathname: "./editAdmin",
                  state: { data: userData },
                })
              }
            >
              <strong>Edit Profile</strong>
            </CButton>
          </CCardHeader>
          <CCardBody
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {userData.profile_picture_url ? (
              <CImg
                src={userData.profile_picture_url}
                className="c-avatar-img"
                alt=""
                style={{ marginBottom: "2rem", width: "6rem", height: "6rem" }}
              />
            ) : (
              <DefaultUser style={{ marginBottom: "2rem" }} />
            )}

            <table className="table table-striped table-hover">
              <tbody style={{ fontFamily: "Poppins" }}>
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <td style={{ marginLeft: "8rem" }}>
                    <strong>Name</strong>
                  </td>
                  <td style={{ marginLeft: "9.8rem" }}>
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
                  <td style={{ marginLeft: "8rem" }}>
                    <strong>Email</strong>
                  </td>
                  <td style={{ marginLeft: "9.8rem" }}>
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
                  <td style={{ marginLeft: "8rem" }}>
                    <strong>Phone Number</strong>
                  </td>
                  <td style={{ marginLeft: "5.6rem" }}>
                    <>
                      {userData["phone_no"] ? String(userData["phone_no"]) : ""}
                    </>
                  </td>
                </tr>
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  ) : null;
}
