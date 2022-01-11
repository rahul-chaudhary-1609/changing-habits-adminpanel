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
  {
    _tag: "CSidebarNavItem",
    name: "Today's Learning",
    to: "/listLearning/content",
    icon: (
      <CIcon content={freeSet.cilBook} customClasses="c-sidebar-nav-icon" />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Food Log Category",
    to: "/listFoodLogCategory",
    icon: (
      <CIcon content={freeSet.cilLibrary} customClasses="c-sidebar-nav-icon" />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "Food Log Suggestion",
    to: "/listFoodLogSuggestion/foodlog",
    icon: (
      <CIcon content={freeSet.cilFastfood} customClasses="c-sidebar-nav-icon" />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "User Progress Management",
    to: "/listUserProgress",
    icon: (
      <CIcon
        content={freeSet.cilListHighPriority}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "Onboarding Quiz",
    to: "/listOnboardingQuiz",
    icon: (
      <CIcon content={freeSet.cilPuzzle} customClasses="c-sidebar-nav-icon" />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Knowledge Center",
    to: "/listKnowledgeBlog",
    icon: (
      <CIcon content={freeSet.cilStorage} customClasses="c-sidebar-nav-icon" />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Notification Management",
    to: "/listNotification",
    icon: (
      <CIcon content={freeSet.cilBell} customClasses="c-sidebar-nav-icon" />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "Analytics",
    to: "/getAnalytics",
    icon: (
      <CIcon content={freeSet.cilInfo} customClasses="c-sidebar-nav-icon" />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "Weight Gain Reason",
    to: "/listWeightGainReason",
    icon: (
      <CIcon
        content={freeSet.cilWeightlifitng}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "List Informative Slides",
    to: "/listInformativeSlides",
    icon: (
      <CIcon
        content={freeSet.cilImageBroken}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
];

export default _nav;
