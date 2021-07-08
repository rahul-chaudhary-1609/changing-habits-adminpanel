import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
    CDataTable,
    CBadge,
    CTooltip,
    CSwitch,
    CButton,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CInput,
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CPagination
} from "@coreui/react"
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import { listLearningContent,toggleLearningContentStatus } from "../../data/learningContentManagement"
import StatusModal from "src/utils/components/modal";

function ListLearningContent() {
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
    let [status, setStatus] = useState(true);
    let [modal, setModal] = useState(false);
    let [toggleData, setToggleData] = useState(null);


    const fields = [
        { key: 's_no',label:"S.No." },
        { key: 'title', labellable: "Learning Content" },
        { key: 'description',label:"Description" },
        { key: 'phase_day',label:"Phase Day" },
        { key: 'phase_id', label: "Phase" },
        { key: 'status', label: "Status" },
        { key: 'action',label:"Action" },
    ]

    let toggleModal = (item) => {
        setModal(!modal);
        setToggleData(item);
    }

    let toggleStatus = async (item) => {
        setModal(!modal)
        try {
            let req = {
                pathParams: {
                    id: item.id,
                },
                data:{}
            }
            let response = await toggleLearningContentStatus(req);
            setStatus(!status)
            setErrorResponse({ message: null, code: null, isFound: false })

            } catch (error) {
                setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        }
        
    }

    let formatData = (rows) => {
        let s_no = (page.number - 1) * page.size;
        return rows.map((row) => {
            return {
                s_no: ++s_no,
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
                let response = await listLearningContent(req);
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
        
        
    },[page.number,searchKey,status])


    return (        // <CContainer fluid>
        //     <StatusModal
        //         toggleModal={toggleModal}
        //         modal={modal}
        //         toggleData={toggleData}
        //         toggleStatus={toggleStatus}
        //         setStatus={setStatus}
        //         status={status}
        //     />
        //     <CRow>
        //         <CCol>
        //             <CCard>
        //                 <CCardHeader>
        //                     <div style={{display:"flex", justifyContent:"space-between"}}>
        //                         <h2>Today's Learning Management</h2>
        //                         <CButton
        //                             color="success"
        //                             style={{ width: "5rem",}}
        //                             onClick={()=>history.push('/selectLearningContentType')}
        //                         >
        //                             <strong>Add</strong>
        //                         </CButton>
        //                     </div>
                                            
        //                 </CCardHeader>
        //                 <CCardBody>

                            <>
            <StatusModal
                toggleModal={toggleModal}
                modal={modal}
                toggleData={toggleData}
                toggleStatus={toggleStatus}
                setStatus={setStatus}
                status={status}
            />
                           
                            <CDataTable
                                items={data}
                                fields={fields}
                                striped
                                border
                                addTableClasses="table-class"
                                loading={isLoading}
                                noItemsViewSlot={isLoading ? <div>Loading...</div> : <div>{errorResponse.isFound ? errorResponse.message : "No Record Found"}</div>}
                                overTableSlot={
                                    <CCol style={{ marginBottom: "1rem", display: "flex" }}>
                                        <CInputGroup>
                                            <CInputGroupPrepend>
                                                <CInputGroupText className={'bg-info text-white'}>
                                                    <CIcon name={'cilSearch'} />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput style={{ maxWidth: "14rem" }} type="text" id="search" name="search" placeholder="Search"
                                                value={searchValue}
                                                onChange={(e) => { setSearchValue(e.target.value) }}
                                            />
                                            <CButton color="info" style={{ marginLeft: "1rem" }}
                                                onClick={() => { setSearchKey(searchValue != "" ? searchValue : null) }}
                                            >
                                                Search
                                            </CButton>
                                            <CButton color="info" style={{ marginLeft: "1rem" }}
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
                                        return (
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                                    <CTooltip content={"Edit Content"} placement={"top-start"}>
                                                        <CIcon style={{ color: "red", cursor: "pointer" }}
                                                            name={"cilPencil"}
                                                            onClick={()=>history.push(`/editLearningContent/${item.id}`)}
                                                        />
                                                    </CTooltip>
                                                    <CSwitch
                                                        onChange={() => toggleModal(item)}
                                                        size="sm"
                                                        variant={"3d"}
                                                        color={"success"}
                                                        checked={item.status == 1 ? true : false}
                                                    />
                                                </div>
                                            </td>
                                        )
                                    },
                                    phase_id: (item, index) => {
                                        switch (item.phase_id) {
                                            case 1:
                                                return (<td>Kickstart</td>)
                                            case 2:
                                                return (<td>Phase 1</td>)
                                            case 3:
                                                return (<td>Phase 2</td>)
                                            case 4:
                                                return (<td>Phase 3</td>)
                                            case 5:
                                                return (<td>Phase 4</td>)
                                            case 6:
                                                return (<td>Phase 4 EVA</td>)
                                            default:
                                                return (<td>Phase 4 EVA</td>)
                                      }  
                                    },                                    
                                    status: (item, index) => {
                                        return (
                                            <td>
                                                {item.status == 1 ? <CBadge color="success">Active</CBadge> : <CBadge color="danger">Blocked</CBadge>}
                                            </td>
                                        )
                                    }
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
            
                        {/* </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer> */}
        </>
  )
    
      
    
}

export default ListLearningContent;


  