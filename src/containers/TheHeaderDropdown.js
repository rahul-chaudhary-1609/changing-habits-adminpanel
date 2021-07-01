import React, { useEffect, useState } from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { freeSet } from "@coreui/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetUserProfile } from "../api";
import DefaultUser from "../assets/svgs/defaultUser";

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const res = await GetUserProfile(auth.userId);
      setData(res.profile_picture_url);
    };

    dispatch({
      type: "UPDATEPIC",
      payload: getData,
    });
    getData();
  }, [dispatch, auth.isSignedIn, auth.userId]);

  const history = useHistory();

  const handleChangePassword = () => {
    history.push("/changePassword");
  };

  const handleLogout = () => {
    localStorage.clear();

    dispatch({ type: "USER_LOGOUT" });
  };

  const handleProfile = () => {
    history.push("/profile");
  };

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          {data ? (
            <CImg
              src={data}
              className="c-avatar-img"
              alt="admin@bootstrapmaster.com"
            />
          ) : (
            <DefaultUser />
          )}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={handleLogout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Log Out
        </CDropdownItem>

        <CDropdownItem onClick={handleChangePassword}>
          <CIcon name="cil-user" className="mfe-2" />
          Change Password
        </CDropdownItem>
        <CDropdownItem onClick={handleProfile}>
          <CIcon content={freeSet.cilShortText} className="mfe-2" />
          Profile
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
