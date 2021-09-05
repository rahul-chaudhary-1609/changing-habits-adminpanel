import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
    CDataTable,
    CButton,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CInput,
    CCol,
    CPagination,
    CContainer,
    CRow,
    CCard,
    CCardHeader,
    CCardBody,
    CTooltip,
} from "@coreui/react"
import { freeSet } from "@coreui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import CIcon from "@coreui/icons-react";

import { listUser } from "../../data/userProgressManagement";
import { getFormatedDateTime } from "../../utils/helper";

function ListUserProgress() {
    let history = useHistory();

    let [data, setData] = useState([])
    let [dataCount, setDataCount] = useState(0)
    let [isLoading, setLoading] = useState(false)
    let [page, setPage] = useState({
        size:10,
        number: 1,
    })
    let [searchKey, setSearchKey] = useState(null);
    let [searchValue, setSearchValue] = useState("");
    let [errorResponse, setErrorResponse] = useState({
        message: null,
        code: null,
        isFound: false,
    });


    const fields = [
        { key: 's_no',label:"S.No.",_style: {width: "4%" } },
        { key: 'name', lable: "User Name",_style: {width: "20%" } },
        { key: 'email', lable: "Eamil",_style: {width: "56%" } },
        { key: 'action',label:"Action",_style: { width: "20%" } },
    ]


    let formatData = (rows) => {
        let s_no = (page.number - 1) * page.size;
        return rows.map((row) => {
            return {
                s_no: ++s_no,
                sent_date:row.createdAt,
                ...row
            }
        });
    }

    useEffect(() => {
        const getData = async () => {
            try {
                let req = {
                    queryParams: {
                        searchKey: searchKey,
                        page: page.number,
                        page_size: page.size
                    }
                }
                setLoading(true)
                let response = await listUser(req);
                let updatedData = formatData(response.rows);
                setData([...updatedData])
                setDataCount(response.count)
                setLoading(false)
                setErrorResponse({ message: null, code: null, isFound: false })
                

            } catch (error) {
                setData([])
                setDataCount(0)
                if (error.message) {
                    setLoading(false)
                    setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
                }
            } 
        }
        
        getData();
        
        
    },[page.number,searchKey])


    return (
        <CContainer>
            <CRow>
                <CCol sm="12">
                    <CCard>
                        <CCardHeader>
                            {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
                                <h2>User Progress Management</h2>
                                {/* <CButton
                                    style={{ width: "5rem",float:"right",backgroundColor:"#008080",color:"#fff"}}
                                    onClick={()=> history.push('/sendNotification')}
                                >
                                    <strong>Send</strong>
                                </CButton> */}
                            {/* </div> */}
                                            
                        </CCardHeader>
                        <CCardBody>   
                <CDataTable
                    items={data}
                    fields={fields}
                    striped
                    border
                    addTableClasses="table-class"
                    loading={isLoading}
                    noItemsViewSlot={!isLoading ? "" : <div style={{ height: "14rem" }}></div>}
                    overTableSlot={
                        <CCol style={{ marginBottom: "1rem", display: "flex" }}>
                            <CInputGroup>
                                <CInputGroupPrepend>
                                    <CInputGroupText style={{backgroundColor:"#008080",color:"#fff"}}>
                                        <CIcon name={'cilSearch'} />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CInput style={{ maxWidth: "14rem" }} type="text" id="search" name="search" placeholder="Search by name or email"
                                    value={searchValue}
                                    onChange={(e) => { setSearchValue(e.target.value) }}
                                    autoComplete="off"
                                />
                                <CButton style={{ marginLeft: "1rem", backgroundColor:"#008080",color:"#fff"}}
                                    onClick={() => { setSearchKey(searchValue.trim() != "" ? searchValue.trim() : null) }}
                                >
                                    Search
                                </CButton>
                                <CButton style={{ marginLeft: "1rem",backgroundColor:"#008080",color:"#fff" }}
                                    onClick={() => {
                                        setSearchValue("")
                                        setSearchKey(null)
                                    }}
                                >
                                    Reset
                                </CButton>
                            </CInputGroup>
                        </CCol>
                    }
                    underTableSlot={
                        <CCol style={{ marginBottom: "1rem", }}>
                            {/* {dataCount == 0 ? <div>Showing  0 - 0 of 0</div> : <div>Showing {page.number} - {page.number + page.size - 1} of {dataCount}</div>} */}
                            {
                                dataCount == 0 ? <div>Showing  0 - 0 of 0</div>
                                    :
                                    (page.number * page.size) > dataCount ? <div>Showing {((page.number - 1) * page.size) + 1} - {dataCount} of {dataCount}</div>
                                        : <div>Showing {((page.number - 1) * page.size) + 1} - {page.number * page.size} of {dataCount}</div>
                            }
                        </CCol>
                    }
                    scopedSlots={{
                        action: (item, index) => {
                            return (<td><CTooltip content={`View Progress`} placement={"top-start"}>
                            <FontAwesomeIcon
                                color="green"
                                size="lg"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                history.push({
                                    pathname: `/viewUserProgress/${item.id}`,
                                })
                                }
                                icon={faEye}
                            />
                        </CTooltip></td>)
                        },
                    }}
                ></CDataTable>
                <CPagination
                    activePage={page.number}
                    pages={Math.ceil(dataCount / page.size)}
                    onActivePageChange={(i) => {
                        if (i == 0)
                            i=1
                        setPage({ ...page, number: i })
                    }}
            />
      </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
        
  )
    
      
    
}

export default ListUserProgress;


  