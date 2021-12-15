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
    CPagination
} from "@coreui/react"
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import { listLearningContent, toggleLearningContentStatus, deleteLearningContent, changeContentOrder } from "../../data/learningContentManagement"
import { DeleteModal } from "src/utils/components/modal";
import { StatusModal } from "src/utils/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faChevronCircleUp, faChevronCircleDown, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function ListLearningContent() {
    let history = useHistory();

    let [data, setData] = useState([])
    let [dataCount, setDataCount] = useState(0)
    let [isLoading, setLoading] = useState(false)
    let [page, setPage] = useState({
        size: 10,
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

    let [deleteLog, setDeleteLog] = useState(true);
    let [deleteModal, setDeleteModal] = useState(false);
    let [toggleDeleteData, setToggleDeleteData] = useState(null);


    const fields = [
        { key: 's_no', label: "S.No.", _style: { width: "4%" } },
        { key: 'title', label: "Title", _style: { width: "26%" } },
        { key: 'phase_id', label: "Phase", _style: { width: "12%" } },
        { key: 'content_type', label: "Content Type", _style: { width: "12%" } },
        { key: 'external_link', label: "External Link", _style: { width: "12%" } },
        { key: 'status', label: "Status", _style: { width: "6%" } },
        { key: 'action', label: "Action", _style: { width: "20%" } },
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
                data: {}
            }
            let response = await toggleLearningContentStatus(req);
            setStatus(!status)
            setErrorResponse({ message: null, code: null, isFound: false })

        } catch (error) {
            setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        }

    }

    let toggleDeleteModal = (item) => {
        setDeleteModal(!deleteModal);
        setToggleDeleteData(item);
    }

    let deleteFoodLog = (item) => {
        setDeleteModal(!deleteModal)
        let req = {
            pathParams: {
                id: item.id,
            },
            data: {}
        }
        deleteLearningContent(req).then((response) => {
            setDeleteLog(!deleteLog)
            setErrorResponse({ message: null, code: null, isFound: false })
        }).catch((error) => {
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


    useEffect(() => {
        getData();
    }, [page.number, searchKey, deleteLog, status])


    let handleSlideOrderChange = async (item, direction) => {
        let req = {
            data: {
                content_id: item.id,
                current_order: item.order,
            }
        }
        if (direction == "up") {
            req.data.new_order = --item.order
        } else if (direction == "down") {
            req.data.new_order = ++item.order
        } else {
            req.data.new_order = item.order
        }

        changeContentOrder(req).then((response) => {
            getData()
        }).catch((error) => {
            console.log(error)
        })

    }



    return (
        <>
            <StatusModal
                toggleModal={toggleModal}
                modal={modal}
                toggleData={toggleData}
                toggleStatus={toggleStatus}
                setStatus={setStatus}
                status={status}
                info={"learning content"}
                message={"Note: This will effect all the quiz related with this learning content"}
            />
            <DeleteModal
                toggleModal={toggleDeleteModal}
                modal={deleteModal}
                toggleData={toggleDeleteData}
                deleteQuestion={deleteFoodLog}
                setStatus={setDeleteLog}
                status={deleteLog}
                info={"Learning Content"}
                message={"Note: This will effect all the quiz related with this learning content"}
            />

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
                                <CInputGroupText style={{ backgroundColor: "#008080", color: "#fff" }}>
                                    <CIcon name={'cilSearch'} />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput style={{ maxWidth: "14rem" }} type="text" id="search" name="search" placeholder="Search by title"
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                                autoComplete="off"
                            />
                            <CButton style={{ marginLeft: "1rem", backgroundColor: "#008080", color: "#fff" }}
                                onClick={() => { setSearchKey(searchValue.trim() != "" ? searchValue.trim() : null) }}
                            >
                                Search
                            </CButton>
                            <CButton style={{ marginLeft: "1rem", backgroundColor: "#008080", color: "#fff" }}
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
                    'external_link': (item, index) => {
                        return (
                            <td>
                                <div
                                    onClick={() => {
                                        if (item.external_link) {
                                            window.open(item.external_link, '_blank')
                                        }
                                    }}
                                    style={{ cursor: 'pointer', color: 'blue' }}>
                                    {item.external_link ? item.external_link.length < 25 ? item.external_link : `${item.external_link.slice(0, 25)}...` : ""}
                                </div>
                            </td>
                        )
                    },
                    'content_type': (item, index) => {
                        return <td><div>{item.content_type === 1 ? 'Motivational' : 'Nutrition'}</div></td>
                    },
                    action: (item, index) => {
                        return (
                            <td>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                    <CTooltip content={"Edit Content"} placement={"top-start"}>
                                        <CIcon style={{ color: "black", cursor: "pointer" }}
                                            size="lg"
                                            name={"cilPencil"}
                                            onClick={() => history.push(`/editLearningContent/${item.id}`)}
                                        />
                                    </CTooltip>
                                    <CTooltip content={`View Content`} placement={"top-start"}>
                                        <FontAwesomeIcon
                                            color="green"
                                            size="lg"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                history.push({
                                                    pathname: `/viewLearningContent/${item.id}`,
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
                                    <CTooltip content={`Delete Learning Content`} placement={"top-start"}>
                                        <CIcon style={{ color: "red", cursor: "pointer" }}
                                            size="lg"
                                            name={"cilTrash"}
                                            onClick={() => toggleDeleteModal(item)}
                                        />
                                    </CTooltip>
                                    <CTooltip content={item.order > 1 ? `Move Slide Up` : `Not Allowed`} placement={"top-start"}>
                                        <FontAwesomeIcon
                                            color={item.order > 1 ? "#008080" : "gray"}
                                            size="lg"
                                            style={{ cursor: item.order > 1 ? "pointer" : "not-allowed" }}
                                            onClick={() => item.order > 1 ? handleSlideOrderChange(item, "up") : ""}
                                            icon={faChevronCircleUp}
                                        />
                                    </CTooltip>
                                    <CTooltip content={item.order < dataCount ? `Move Slide Down` : `Not Allowed`} placement={"top-start"}>
                                        <FontAwesomeIcon
                                            color={item.order < dataCount ? "#008080" : "gray"}
                                            size="lg"
                                            style={{ cursor: item.order < dataCount ? "pointer" : "not-allowed" }}
                                            onClick={() => item.order < dataCount ? handleSlideOrderChange(item, "down") : ""}
                                            icon={faChevronCircleDown}
                                        />
                                    </CTooltip>
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
                        i = 1
                    setPage({ ...page, number: i })
                }}
            />
        </>
    )



}

export default ListLearningContent;


