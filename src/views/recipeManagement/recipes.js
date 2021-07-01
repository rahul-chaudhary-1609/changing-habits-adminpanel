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
} from "@coreui/react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import moment from "moment";

import { GetRecipeList, ChangeUserStatus, DeleteRecipe } from "../../api";

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
  { key: "id", label: "Id", _style: { fontFamily: "Poppins" } },
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

  const pageChange = (newPage) => {
    let newPage1 = newPage;
    if (newPage1 === 0) {
      newPage1 = 1;
    }
    currentPage !== newPage &&
      history.push(`/users?search=${onsearchCHange}&&page=${newPage1}`);
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
      history.push(`/recipeManagement?search=${onsearchCHange}&&page=${page}`);
  };

  const handleReset = () => {
    setOnSearchChange("");
    let newPage = page;
    if (newPage === 0) {
      newPage = 1;
    }
    history.push(`/recipeManagement?search=&&page=${newPage}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await GetRecipeList(currentPage, currentPageSearch);
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
  }, [currentPage, currentPageSearch, refresh, page]);

  return (
    <CRow>
      <CModal
        show={enableModal}
        centered={true}
        color="warning"
        onClose={setEnableModal}
        backdrop={true}
        style={{ fontFamily: "Poppins" }}
      >
        <CModalHeader style={{ height: "3rem" }}>
          <CModalTitle>{active ? "Block User?" : "Unblock User?"}</CModalTitle>
        </CModalHeader>
        <CModal
          show={deleteModal}
          centered={true}
          backdrop={true}
          color="warning"
          onClose={setDeleteModal}
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete Category Genre?</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to Delete this Category?
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={handleDelete}>
              Yes
            </CButton>
            <CButton color="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModalBody>
          {active
            ? "Are you sure you want to Block the User?"
            : "Are you sure you want to Unblock the User?"}
        </CModalBody>
        <CModalFooter style={{ height: "4rem" }}>
          <CButton color="success" onClick={handleEnable}>
            Yes
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setEnableModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={deleteModal}
        centered={true}
        backdrop={true}
        color="warning"
        onClose={setDeleteModal}
      >
        <CModalHeader>
          <CModalTitle>Delete Recipe?</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to Delete the Recipe?</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleDelete}>
            Yes
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
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
              style={{ width: "5rem", marginLeft: "90%" }}
              color="success"
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
                <CCol style={{ marginBottom: "1rem", display: "flex" }} md="5">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText
                        style={{ backgroundColor: "#0D86FF", color: "white" }}
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
                      placeholder="Search"
                    />

                    <CButton
                      onClick={handleSearch}
                      style={{ marginLeft: "1rem" }}
                      color="info"
                    >
                      Search
                    </CButton>
                    <CButton
                      onClick={() => {
                        handleReset();
                      }}
                      style={{ marginLeft: "1rem" }}
                      color="info"
                    >
                      Reset
                    </CButton>
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
                email: (item) => <td>{item.email}</td>,
                PostedBy: (item) => (
                  <td>{item.role == 1 ? `App user:${item.name}` : "Admin"}</td>
                ),
                recipeType: (item) => (
                  <td>{item.recipe_type == 1 ? "Veg" : "Non Veg"}</td>
                ),
                status: (item) => (
                  <td>
                    {item.status == 1 ? (
                      <CBadge
                        style={{ width: "4rem", height: "1.1rem" }}
                        shape="pill"
                        color={getBadge("Active")}
                      >
                        Active
                      </CBadge>
                    ) : (
                      <CBadge
                        style={{ width: "4rem", height: "1.1rem" }}
                        shape="pill"
                        color={getBadge("Banned")}
                      >
                        Blocked
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
                        <CTooltip content={"edit User"} placement={"top-start"}>
                          <CIcon
                            onClick={() =>
                              history.push({
                                pathname: `/addRecipe/${item.id}`,
                                state: { item },
                              })
                            }
                            style={{ color: "red", cursor: "pointer" }}
                            size="lg"
                            content={freeSet.cilPencil}
                          />
                        </CTooltip>
                        <CTooltip
                          content={`Delete ${item.recipe_title} Recipe
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
