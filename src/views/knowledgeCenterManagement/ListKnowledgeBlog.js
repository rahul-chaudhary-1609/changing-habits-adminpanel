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
    CCol,
    CPagination,
    CContainer,
    CRow,
    CCard,
    CCardHeader,
    CCardBody
} from "@coreui/react"
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import { listBlog,deleteBlog } from "../../data/knowledgeCenterManagement"
import {DeleteModal} from "src/utils/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { getFormatedDateTime } from "../../utils/helper";
import MediaView from "src/utils/components/mediaView";

function ListKnowledgeBlog() {
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
        { key: 's_no',label:"S.No.",_style: {width: "4%" } },
        { key: 'title', lable: "Title",_style: {width: "36%" } },
        { key:'media',label:"Image/Audio/Video",_style: {width: "20%" }},
        { key: 'posted_date', lable: "Posted Date",_style: {width: "20%" } },
        { key: 'action',label:"Action",_style: { width: "20%" } },
    ]

    let toggleModal = (item) => {
        setModal(!modal);
        setToggleData(item);
    }

    let deleteQuestion =(item) => {
        setModal(!modal)
            let req = {
                pathParams: {
                    id: item.id,
                },
                data:{}
        }
        deleteBlog(req).then((response) => {
                setStatus(!status)
                setErrorResponse({ message: null, code: null, isFound: false })
            }).catch((error)=> {
                setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        })

    }

    let formatData = (rows) => {
        let s_no = (page.number - 1) * page.size;
        return rows.map((row) => {
            return {
                s_no: ++s_no,
                posted_date:row.createdAt,
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
                let response = await listBlog(req);
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


    return (
        <CContainer>
            <DeleteModal
                toggleModal={toggleModal}
                modal={modal}
                toggleData={toggleData}
                deleteQuestion={deleteQuestion}
                setStatus={setStatus}
                status={status}
                info={"blog"}
            />
            <CRow>
                <CCol sm="12">
                    <CCard>
                        <CCardHeader>
                            {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
                                <h2>Knowledge Blog Management</h2>
                                <CButton
                                    style={{ width: "5rem",float:"right",backgroundColor:"#008080",color:"#fff"}}
                                    onClick={()=> history.push('/addKnowledgeBlog')}
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
                        <CCol style={{ marginBottom: "1rem", display: "flex" }}>
                            <CInputGroup>
                                <CInputGroupPrepend>
                                    <CInputGroupText style={{backgroundColor:"#008080",color:"#fff"}}>
                                        <CIcon name={'cilSearch'} />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CInput style={{ maxWidth: "14rem" }} type="text" id="search" name="search" placeholder="Search by title"
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
                            return (
                                <td>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                        <CTooltip content={"Edit Blog"} placement={"top-start"}>
                                            <CIcon style={{ color: "black", cursor: "pointer" }}
                                                size="lg"
                                                name={"cilPencil"}
                                                onClick={()=>history.push(`/editKnowledgeBlog/${item.id}`)}
                                            />
                                        </CTooltip>
                                        <CTooltip content={`View Blog`} placement={"top-start"}>
                                            <FontAwesomeIcon
                                                color="green"
                                                size="lg"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                history.push({
                                                    pathname: `/viewKnowledgeBlog/${item.id}`,
                                                })
                                                }
                                                icon={faEye}
                                            />
                                        </CTooltip>
                                        <CTooltip content={`Delete Blog`} placement={"top-start"}>
                                            <CIcon style={{ color: "red", cursor: "pointer" }}
                                                size="lg"
                                                name={"cilTrash"}
                                                onClick={()=>toggleModal(item)}
                                            />
                                        </CTooltip>
                                    </div>
                                </td>
                            )
                        },
                        posted_date: (item, index) => {
                            return (<td>{ getFormatedDateTime(item.posted_date)}</td>)
                        },
                        media: (item, index) => {
                            let mediaInput={
                                    type: item.image_url?"image":item.video_url?"video":item.audio_url?"audio":"link",
                                    source: item.image_url || item.video_url || item.audio_url || item.external_link || null,
                                    isError: false,
                                    errorMessage:"Image/Video/Audio is Required",
                                }
                            return (<td><MediaView mediaInput={mediaInput} /></td>)
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

export default ListKnowledgeBlog;


  