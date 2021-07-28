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
    CCardBody
} from "@coreui/react"
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

//import { listNotification } from "../../data/notificationManagement"
import { getFormatedDateTime } from "../../utils/helper";

function GetAnalytics() {
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
        { key: 'name', lable: "User Name",_style: {width: "40%" } },
        //{ key: 'description', lable: "Description" },
        { key: 'email', lable: "Eamil",_style: {width: "20%" } },
        { key: 'action',label:"Action",_style: { width: "36%" } },
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
        // const getData = async () => {
        //     try {
        //         let req = {
        //             queryParams: {
        //                 searchKey: searchKey,
        //                 page: page.number,
        //                 page_size: page.size
        //             }
        //         }
        //         setLoading(true)
        //         let response = await listNotification(req);
        //         let updatedData = formatData(response.rows);
        //         setData([...updatedData])
        //         setDataCount(response.count)
        //         setLoading(false)
        //         setErrorResponse({ message: null, code: null, isFound: false })
                

        //     } catch (error) {
        //         setData([])
        //         setDataCount(0)
        //         if (error.message) {
        //             setLoading(false)
        //             setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        //         }
        //     } 
        // }
        
        // getData();
        
        
    },[page.number,searchKey])


    return (
        <CContainer>
            <CRow>
                <CCol sm="12">
                    <CCard>
                        <CCardHeader>
                            {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
                                <h2>Analytics</h2>
                                {/* <CButton
                                    style={{ width: "5rem",float:"right",backgroundColor:"#008080",color:"#fff"}}
                                    onClick={()=> history.push('/sendNotification')}
                                >
                                    <strong>Send</strong>
                                </CButton> */}
                            {/* </div> */}
                                            
                        </CCardHeader>
                        <CCardBody>
                            <div>
                                Work in progress...
                            </div>
                
      </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
        
  )
    
      
    
}

export default GetAnalytics;


  