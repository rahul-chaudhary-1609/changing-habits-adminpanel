import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CTooltip,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CButton,
  CModalTitle,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CSelect,
} from "@coreui/react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import moment from "moment";

import { GetRecipeList, ChangeUserStatus, DeleteRecipe } from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const getBadge = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Banned":
      return "danger";
    default:
      return "primary";
  }
};

const fields = [
  { key: "currentId", label: "Id", _style: { fontFamily: "Poppins" } },
  {
    key: "recipe_title",
    label: "Recipe Title ",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "recipeType",
    label: "Recipe Type",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "status",
    label: "Status",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "created_at",
    label: "Posted Date",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "PostedBy",
    label: "Posted By",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "show_details",
    label: "Action",
    _style: { minWidth: "7rem" },
    sorter: false,
    filter: false,
  },
];
const Recipes = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const queryPageSEarch = useLocation().search.match(
    /search=([A-Za-z0-9 _]+)/,
    ""
  );

  const currentPageSearch =
    queryPageSEarch && queryPageSEarch[1] ? queryPageSEarch[1] : "";

  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);

  const [page, setPage] = useState(currentPage);

  const [data, setData] = useState([]);
  const [count, setCount] = useState();
  const [userId, setUserId] = useState(null);
  const [onsearchCHange, setOnSearchChange] = useState(
    currentPageSearch ? currentPageSearch : ""
  );
  const [active, setActive] = useState(null);
  const [enableModal, setEnableModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [recipeType, setRecipeType] = useState(null);
  const [recipeStatus, setRecipeStatus] = useState(null);
  let currentId = page && page * 10 - 10;

  var recipe_status = [
    {
      label: "All Recipe Status",
      value: null,
    },
    {
      label: "Pending",
      value: 0,
    },
    {
      label: "Approved",
      value: 1,
    },
    {
      label: "Rejected",
      value: 2,
    },
  ];

  var recipe_type = [
    {
      label: "All Recipe Type",
      value: null,
    },
    {
      label: "Veg",
      value: 1,
    },
    {
      label: "Non Veg",
      value: 2,
    },
  ];

  const pageChange = (newPage) => {
    let newPage1 = newPage;
    if (newPage1 === 0) {
      newPage1 = 1;
    }
    currentPage !== newPage &&
      history.push(
        `/recipeManagement?search=${onsearchCHange}&page=${newPage1}`
      );
  };

  const toggleDelete = (id) => {
    setUserId(id);
    setDeleteModal(!deleteModal);
  };

  const handleEnable = async () => {
    try {
      setEnableModal(!enableModal);
      let pass;
      if (active) {
        pass = 0;
      } else {
        pass = 1;
      }
      await ChangeUserStatus(userId, pass);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteModal(!deleteModal);
      const deleteResult = await DeleteRecipe(userId);

      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setOnSearchChange(e.target.value);
  };

  const handleSearch = async () => {
    currentPageSearch !== onsearchCHange &&
      history.push(`/recipeManagement?search=${onsearchCHange}&page=${page}`);
  };

  const handleReset = () => {
    setOnSearchChange("");
    let newPage = page;
    if (newPage === 0) {
      newPage = 1;
    }
    history.push(`/recipeManagement?&page=${newPage}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setData([]);
        let dropdown = {};
        dropdown.recipeType = recipeType ? Number(recipeType) : null;
        dropdown.recipeStatus = recipeStatus ? Number(recipeStatus) : null;
        const data =
          recipeType || recipeStatus
            ? await GetRecipeList(currentPage, currentPageSearch, dropdown)
            : await GetRecipeList(currentPage, currentPageSearch);
        setLoading(false);
        data.rows.map((item) => {
          item._classes = "catTableItem";

          if (item.created_at) {
            item.created_at = moment(item.created_at).format("LLL");
          }
          return item;
        });

        setData(data.rows);
        setCount(data.count);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getData();

    currentPage !== page && setPage(currentPage);
  }, [currentPage, currentPageSearch, refresh, page, recipeStatus, recipeType]);

  return (
    <CRow>
      <CModal
        show={deleteModal}
        centered={true}
        backdrop={true}
        onClose={setDeleteModal}
      >
        <CModalHeader style={{ backgroundColor: "teal", color: "white" }}>
          <CModalTitle>Delete Recipe?</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to Delete the Recipe?</CModalBody>
        <CModalFooter>
          <CButton
            onClick={handleDelete}
            style={{ backgroundColor: "teal", color: "white" }}
          >
            Yes
          </CButton>{" "}
          <CButton color="danger" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      <CCol xxl={12}>
        <CCard>
          <CCardHeader style={{ fontFamily: "Lato" }}>
            <h2>
              <strong>Recipe Management</strong>
            </h2>
            <CButton
              style={{
                width: "5rem",
                marginLeft: "90%",
                backgroundColor: "teal",
                color: "white",
              }}
              onClick={() => history.push("/addRecipe")}
            >
              <strong>Add</strong>
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={data}
              fields={fields}
              hover
              border
              addTableClasses="table-class"
              striped
              loading={loading}
              noItemsViewSlot={
                !loading ? "" : <div style={{ height: "14rem" }}></div>
              }
              clickableRows
              overTableSlot={
                <CCol style={{ marginBottom: "1rem", display: "flex" }}>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText
                        style={{ backgroundColor: "teal", color: "white" }}
                      >
                        <CIcon content={freeSet.cilSearch} />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      style={{ maxWidth: "15rem" }}
                      value={onsearchCHange}
                      onChange={handleSearchChange}
                      id="input1-group1"
                      name="input1-group1"
                      placeholder="Search by Recipe Title"
                    />

                    <CButton
                      onClick={handleSearch}
                      style={{
                        marginLeft: "1rem",
                        backgroundColor: "teal",
                        color: "white",
                      }}
                    >
                      Search
                    </CButton>
                    <CButton
                      onClick={() => {
                        handleReset();
                      }}
                      style={{
                        marginLeft: "1rem",
                        backgroundColor: "teal",
                        color: "white",
                      }}
                    >
                      Reset
                    </CButton>
                  </CInputGroup>
                  <CInputGroup style={{ width: "30%", marginRight: "10px" }}>
                    <CSelect
                      onChange={(e) => {
                        setRecipeStatus(e.target.value);
                      }}
                      custom
                      value={recipeStatus}
                      name="status"
                      id="status"
                    >
                      {recipe_status.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </CSelect>
                  </CInputGroup>
                  <CInputGroup style={{ width: "30%" }}>
                    <CSelect
                      onChange={(e) => {
                        setRecipeType(e.target.value);
                      }}
                      custom
                      value={recipeType}
                      name="recipe_type"
                      id="recipe_type"
                    >
                      {recipe_type.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </CSelect>
                  </CInputGroup>
                </CCol>
              }
              underTableSlot={
                <div style={{ marginBottom: "1rem" }}>
                  Showing {page * 10 - 9}-
                  {page * 10 < data.length ? page * 10 : data.length} of{" "}
                  {data.length}
                </div>
              }
              scopedSlots={{
                currentId: (item) => {
                  currentId++;
                  return <td>{currentId}</td>;
                },
                email: (item) => <td>{item.email}</td>,
                PostedBy: (item) => (
                  <td>
                    {item.role == 1 ? (
                      <>
                        <b>App user : </b>
                        {item.name}
                      </>
                    ) : (
                      `Admin : ${item.name}`
                    )}
                  </td>
                ),
                recipeType: (item) => (
                  <td>{item.recipe_type == 1 ? "Veg" : "Non Veg"}</td>
                ),
                status: (item) => (
                  <td>
                    {item.status == 0 ? (
                      <CBadge
                        style={{ width: "4rem", height: "1.1rem" }}
                        shape="pill"
                        color={getBadge("")}
                      >
                        Pending
                      </CBadge>
                    ) : item.status == 1 ? (
                      <CBadge
                        style={{ width: "4rem", height: "1.1rem" }}
                        shape="pill"
                        color={getBadge("Active")}
                      >
                        Approved
                      </CBadge>
                    ) : (
                      <CBadge
                        style={{ width: "4rem", height: "1.1rem" }}
                        shape="pill"
                        color={getBadge("Banned")}
                      >
                        Rejected
                      </CBadge>
                    )}
                  </td>
                ),
                show_details: (item) => {
                  return (
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <CTooltip
                          content={"Edit Recipe"}
                          placement={"top-start"}
                        >
                          <CIcon
                            onClick={() =>
                              history.push({
                                pathname: `/addRecipe/${item.id}`,
                                state: { item },
                              })
                            }
                            style={{ color: "black", cursor: "pointer" }}
                            size="lg"
                            content={freeSet.cilPencil}
                          />
                        </CTooltip>
                        <CTooltip
                          content={`View Recipe`}
                          placement={"top-start"}
                        >
                          <FontAwesomeIcon
                            color="green"
                            size="lg"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              history.push({
                                pathname: `/viewRecipe/${item.id}`,
                                state: { item },
                              })
                            }
                            icon={faEye}
                          />
                        </CTooltip>
                        <CTooltip
                          content={`Delete Recipe
                          `}
                          placement={"top-start"}
                          interactive={true}
                          trigger="mouseenter"
                        >
                          <CIcon
                            onClick={() => toggleDelete(item.id)}
                            size="lg"
                            style={{
                              color: "red",
                              cursor: "pointer",
                              outline: "none",
                              boxShadow: "none",
                            }}
                            content={freeSet.cilTrash}
                          />
                        </CTooltip>
                      </div>
                    </td>
                  );
                },
              }}
            />
            <CPagination
              activePage={page}
              pages={Math.ceil(count / 10)}
              onActivePageChange={pageChange}
              doubleArrows={true}
              align="start"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Recipes;
