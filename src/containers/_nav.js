import React from "react";
import CIcon from "@coreui/icons-react";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "User Management",
    to: "/users",
    icon: <CIcon name="cil-people" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Recipe Management",
    to: "/recipeManagement",
    icon: <CIcon name="cil-star" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Content Management",
    to: "/static",
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon" />,
  },
];

export default _nav;
