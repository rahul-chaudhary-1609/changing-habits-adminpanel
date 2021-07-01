import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CTooltip,
} from "@coreui/react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import { getStaticContents } from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const fields = [
  { key: "id", label: "S.No", _style: { fontFamily: "Poppins" } },
  {
    key: "title",
    label: "Page Name ",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "updatedAt",
    label: "Last Updated",
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
const StaticContentList = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await getStaticContents();
        setLoading(false);
        data.staticContentList.map((item) => {
          item._classes = "catTableItem";

          if (item.updatedAt) {
            item.updatedAt = item.updatedAt.slice(0, 10);
          }
          return item;
        });
        setData(data.staticContentList);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <CRow>
      <CCol xxl={12}>
        <CCard>
          <CCardHeader style={{ fontFamily: "Lato" }}>
            <h2>
              <strong>Content Management</strong>
            </h2>
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
              scopedSlots={{
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
                        {item.id != 5 ? (
                          <CTooltip
                            content={"edit User"}
                            placement={"top-start"}
                          >
                            <CIcon
                              onClick={() =>
                                history.push({
                                  pathname: `/editStaticContent/${item.id}`,
                                  state: { item },
                                })
                              }
                              style={{ color: "red", cursor: "pointer" }}
                              size="lg"
                              content={freeSet.cilPencil}
                            />
                          </CTooltip>
                        ) : (
                          ""
                        )}
                        <CTooltip
                          content={`View Content`}
                          placement={"top-start"}
                        >
                          <FontAwesomeIcon
                            color="green"
                            size="lg"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              item.id == 5
                                ? history.push({
                                    pathname: `/viewStaticContent/${item.id}/faqs`,
                                    state: { item },
                                  })
                                : history.push({
                                    pathname: `/viewStaticContent/${item.id}`,
                                    state: { item },
                                  })
                            }
                            icon={faEye}
                          />
                        </CTooltip>
                      </div>
                    </td>
                  );
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default StaticContentList;
