import React, { useState, useEffect, useRef } from "react";
import { Route, useHistory, Link} from "react-router-dom";
import {    
    CInputGroupText,
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CButton,
    CDataTable,
    CBadge,
    CTooltip,
    CSwitch,
    CInputGroup,
    CInputGroupPrepend,
    CInput,
    CPagination,
    CSelect
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import { FaFilter} from 'react-icons/fa';

import { listFoodLogCategory,listPhases,toggleFoodLogCategoryStatus } from "../../data/foodLogCategory"
import StatusModal from "../../utils/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function ListFoodLogCategory() {
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
    let [phase, setPhase] = useState(0);
    let [phases,setPhases]=useState([])


    const fields = [
        { key: 's_no',label:"S.No." },
        { key: 'food_type', lable: "Category" },
        { key: 'phase_id', label: "Phase" },
        { key: 'status', label: "Status" },
        { key: 'action',label:"Action",_style: { minWidth: "7rem" } },
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
            let response = await toggleFoodLogCategoryStatus(req);
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
        listPhases().then((response) => {
            setPhases(response.phasesList)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    
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
                if (phase > 0) {
                    req.queryParams.phase_id=phase
                }
                setLoading(true)
                let response = await listFoodLogCategory(req);
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
        
        
    },[page.number,searchKey,status,phase])
    
    
    return (
        <CContainer>
            <StatusModal
                toggleModal={toggleModal}
                modal={modal}
                toggleData={toggleData}
                toggleStatus={toggleStatus}
                setStatus={setStatus}
                status={status}
                info={"food log category"}
            />
            <CRow>
                <CCol sm="12">
                    <CCard>
                        <CCardHeader>
                            {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
                                <h2>Food Log Category</h2>
                                <CButton
                                    style={{ width: "5rem",float:"right",backgroundColor:"#008080",color:"#fff"}}
                                    onClick={()=> history.push('/addFoodLogCategory')}
                                >
                                    <strong>Add</strong>
                                </CButton>
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
                        <CCol style={{ marginBottom: "1rem", display: "flex", justifyContent:"start" }}>
                            <CInputGroup>
                                <CInputGroupPrepend>
                                    <CInputGroupText style={{backgroundColor:"#008080",color:"#fff"}}>
                                        <CIcon name={'cilSearch'} />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CInput style={{ maxWidth: "14rem" }} type="text" id="search" name="search" placeholder="Search by category"
                                    value={searchValue}
                                    onChange={(e) => { setSearchValue(e.target.value) }}
                                />
                                <CButton style={{ marginLeft: "1rem",backgroundColor:"#008080",color:"#fff" }}
                                    onClick={() => { setSearchKey(searchValue != "" ? searchValue : null) }}
                                >
                                    Search
                                </CButton>
                            
                            
                            
                                <CInputGroupPrepend style={{marginLeft:"3rem",}}>
                                    <CInputGroupText style={{ borderRadius:"2px",backgroundColor:"#008080",color:"#fff"}} >
                                        <FaFilter/>
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CSelect
                                    style={{ maxWidth: "14rem" }}
                                    onChange={(e)=>setPhase(e.target.value)}
                                    value={phase}
                                    id="phase"
                                    name="phase"
                                    custom
                                    required
                                    > <option value="0" defaultValue>All Phase</option>
                                    {phases.map((phase) => {
                                        return <option key={phase.id} value={phase.id}> {phase.phase_name}</option>
                                    })}
                                </CSelect> 
                                <CButton style={{ marginLeft: "4rem",backgroundColor:"#008080",color:"#fff" }}
                                    onClick={() => {
                                        setSearchValue("")
                                        setSearchKey(null)
                                        setPhase(0)
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
                                        <CTooltip content={"Edit Food Log Category"} placement={"top-start"}>
                                            <CIcon style={{ color: "black", cursor: "pointer" }}
                                                size="lg"
                                                name={"cilPencil"}
                                                onClick={()=>history.push(`/editFoodLogCategory/${item.id}`)}
                                            />
                                        </CTooltip>
                                        <CTooltip content={`View Food Log Category`} placement={"top-start"}>
                                            <FontAwesomeIcon
                                                color="green"
                                                size="lg"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                history.push({
                                                    pathname: `/viewFoodLogCategory/${item.id}`,
                                                })
                                                }
                                                icon={faEye}
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

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
        
    )
}

export default ListFoodLogCategory
