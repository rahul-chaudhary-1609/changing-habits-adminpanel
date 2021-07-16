import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import { setSideBar } from "../actions/index";
import changingHabitsLogo from "../assets/icons/logo tflp – 1.png";
import biglogo from "../assets/icons/logo tflp – 1.png";
import navigation from "./_nav";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebar.sidebarShow);

  return (
    <CSidebar show={show} onShowChange={(val) => dispatch(setSideBar(val))}>
      <CSidebarBrand className="d-md-down-none" to="/">
        <img
          alt="admin"
          className="c-sidebar-brand-full"
          style={{ width: "75%", marginTop: "20px" }}
          src={biglogo}
        />
        <img
          className="c-sidebar-brand-minimized"
          src={changingHabitsLogo}
          alt="admin"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navigation.slice(0,4)}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
        <CSidebarNavDropdown
          name="Food Log Management"
          icon={<CIcon content={freeSet.cilFastfood} customClasses="c-sidebar-nav-icon" />}

        >
         <CCreateElement
          items={navigation.slice(4,6)}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
        </CSidebarNavDropdown>
        <CCreateElement
          items={navigation.slice(6)}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
