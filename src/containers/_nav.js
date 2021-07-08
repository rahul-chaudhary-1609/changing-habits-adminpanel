import React from "react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";

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
    icon: (
      <CIcon content={freeSet.cilDinner} customClasses="c-sidebar-nav-icon" />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Content Management",
    to: "/static",
    icon: (
      <CIcon content={freeSet.cilFile} customClasses="c-sidebar-nav-icon" />
    ),
  },
];

export default _nav;
