import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {arabToRoman} from 'roman-numbers';
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
    CCardBody,
    CSelect
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import { FaFilter} from 'react-icons/fa';

import { listSlides,deleteSlide,getSectionList,changeSlideOrder } from "../../data/informativeSlides"
import {DeleteModal} from "src/utils/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faChevronCircleUp, faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

function ListInfromativeSlides() {
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
    let [deleteSlides, setDeleteSlides] = useState(true);
    let [deleteModal, setDeleteModal] = useState(false);
    let [toggleDeleteData, setToggleDeleteData] = useState(null);

    let [section,setSection]=useState(0);
    let [sections,setSections]=useState([]);


    const fields = [
        { key: 's_no',label:"S.No.",_style: {width: "4%" } },
        { key: 'slide_category_name', lable: "Section Name",_style: {width: "36%" } },
        { key:'order',label:"Slide No.",_style: {width: "10%" }},
        { key: 'title', lable: "Slide Name",_style: {width: "20%" } },
        { key: 'action',label:"Action",_style: { width: "30%" } },
    ]

    let toggleModal = (item) => {
        setDeleteModal(!deleteModal);
        setToggleDeleteData(item);
    }

    let deleteQuestion =(item) => {
        setDeleteModal(!deleteModal)
            let req = {
                pathParams: {
                    id: item.id,
                },
                data:{}
        }
        deleteSlide(req).then((response) => {
                setDeleteSlides(!deleteSlides)
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
                ...row
            }
        });
    }

    useEffect(() => {
        getSectionList().then((response) => {
            setSections(response.slideCategoryList)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {        
        getData();       
        
    },[page.number,searchKey,deleteSlides,section])


    const getData = async () => {
        try {
            let req = {
                queryParams: {
                    searchKey: searchKey,
                    page: page.number,
                    page_size: page.size,
                }
            }
            if(section>0){
                req.queryParams.section_id=section;
            }
            setLoading(true)
            let response = await listSlides(req);
            let updatedData = formatData(response.rows);
            for(let item of updatedData){
                let slideGorupBySection=updatedData.filter(data=>data.section_id==item.section_id);
                item.maxOrder=slideGorupBySection.reduce((max,data)=>data.order>max?data.order:max,slideGorupBySection[0].order)
            }
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

    let handleSlideOrderChange=async(item,direction)=>{
        let req={
            data:{
                slide_id:item.id,
                current_order:item.order,
            }
        }
        if(direction=="up"){
            req.data.new_order=--item.order
        }else if(direction=="down"){
            req.data.new_order=++item.order
        }else{
            req.data.new_order=item.order
        }

        changeSlideOrder(req).then((response) => {
            getData()
        }).catch((error) => {
            console.log(error)
        })

    }


    return (
        <CContainer>
            <DeleteModal
                toggleModal={toggleModal}
                modal={deleteModal}
                toggleData={toggleDeleteData}
                deleteQuestion={deleteQuestion}
                setStatus={setDeleteSlides}
                status={deleteSlides}
                info={"slide"}
            />
            <CRow>
                <CCol sm="12">
                    <CCard>
                        <CCardHeader>
                            {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
                                <h2>Informative Onboarding Slides</h2>
                                <CButton
                                    style={{ width: "5rem",float:"right",backgroundColor:"#008080",color:"#fff"}}
                                    onClick={()=> history.push('/addInformativeSlide')}
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
                                <CInput style={{ maxWidth: "14rem" }} type="text" id="search" name="search" placeholder="Search by name, slide no"
                                    value={searchValue}
                                    onChange={(e) => { setSearchValue(e.target.value) }}
                                    autoComplete="off"
                                />
                                <CButton style={{ marginLeft: "1rem", backgroundColor:"#008080",color:"#fff"}}
                                    onClick={() => { setSearchKey(searchValue.trim() != "" ? searchValue.trim() : null) }}
                                >
                                    Search
                                </CButton>
                                {/* <CButton style={{ marginLeft: "1rem",backgroundColor:"#008080",color:"#fff" }}
                                    onClick={() => {
                                        setSearchValue("")
                                        setSearchKey(null)
                                    }}
                                >
                                    Reset
                                </CButton> */}

                                <CInputGroupPrepend style={{marginLeft:"3rem",}}>
                                    <CInputGroupText style={{ borderRadius:"2px",backgroundColor:"#008080",color:"#fff"}} >
                                        <FaFilter/>
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                                <CSelect
                                    style={{ maxWidth: "14rem" }}
                                    onChange={(e)=>setSection(e.target.value)}
                                    value={section}
                                    id="section"
                                    name="section"
                                    custom
                                    required
                                    > 
                                    <option value="0" defaultValue>All Sections</option>
                                    {sections.map((section) => {
                                        return <option key={section.id} value={section.id}> {section.slide_category_name}</option>
                                    })}
                                </CSelect> 
                                <CButton style={{ marginLeft: "4rem",backgroundColor:"#008080",color:"#fff" }}
                                    onClick={() => {
                                        setSearchValue("")
                                        setSearchKey(null)
                                        setSection(0)
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
                        order:(item,index)=>{
                            return (
                                <td>{arabToRoman(item.order)}</td>
                            )
                        },
                        action: (item, index) => {
                            return (
                                <td>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                        <CTooltip content={"Edit Slide"} placement={"top-start"}>
                                            <CIcon style={{ color: "black", cursor: "pointer" }}
                                                size="lg"
                                                name={"cilPencil"}
                                                onClick={()=>history.push(`/editInformativeSlide/${item.id}`)}
                                            />
                                        </CTooltip>
                                        <CTooltip content={`View Slide`} placement={"top-start"}>
                                            <FontAwesomeIcon
                                                color="green"
                                                size="lg"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                history.push({
                                                    pathname: `/viewInformativeSlide/${item.id}`,
                                                })
                                                }
                                                icon={faEye}
                                            />
                                        </CTooltip>
                                        <CTooltip content={`Delete Slide`} placement={"top-start"}>
                                            <CIcon style={{ color: "red", cursor: "pointer" }}
                                                size="lg"
                                                name={"cilTrash"}
                                                onClick={()=>toggleModal(item)}
                                            />
                                        </CTooltip>
                                        <CTooltip content={item.order>1 && section>0?`Move Slide Up`:section<=0?`Please select specific section to perform this`:`Not Allowed`} placement={"top-start"}>
                                            <FontAwesomeIcon
                                                    color={item.order>1 && section>0?"#008080":"gray"}
                                                    size="lg"
                                                    style={{ cursor:item.order>1 && section>0?"pointer":"not-allowed" }}
                                                    onClick={()=>item.order>1 && section>0?handleSlideOrderChange(item,"up"):""}
                                                    icon={faChevronCircleUp}
                                                />
                                        </CTooltip>
                                        <CTooltip content={item.order<item.maxOrder && section>0?`Move Slide Down`:section<=0?`Please select specific section to perform this`:`Not Allowed`} placement={"top-start"}>
                                            <FontAwesomeIcon
                                                    color={item.order<item.maxOrder && section>0?"#008080":"gray"}
                                                    size="lg"
                                                    style={{ cursor:item.order<item.maxOrder  && section>0?"pointer":"not-allowed" }}
                                                    onClick={()=>item.order<item.maxOrder && section>0?handleSlideOrderChange(item,"down"):""}
                                                    icon={faChevronCircleDown}
                                                />
                                        </CTooltip>
                                    </div>
                                </td>
                            )
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

export default ListInfromativeSlides;