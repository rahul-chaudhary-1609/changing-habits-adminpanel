import React from "react";
import {CImg} from "@coreui/react"

function MediaView(props) {
    return (
        <div
            style={{
                display:"flex",
                justifyContent: "center",
                alignItems:"center",
                border:props.mediaInput.isError?"3.5px solid rgba(0,0,255,0.3)":"1px solid rgba(0,0,0,0.2)",
                height: "135px",
                width: "190px",
                padding: "10px",
                borderRadius:"10px"
            }} >
            
            <div>
            {
                props.mediaInput.type == "image" ?
                    <CImg
                        style={{
                            height: "125px",
                            width: "100%",
                        }}
                        src={props.mediaInput.source}
                        shape="rounded"
                    /> :props.mediaInput.type == "video" ?
                    <video
                        style={{
                            height: "125px",
                            width: "100%",
                        }}
                        controlsList="nodownload" controls>
                            <source src={props.mediaInput.source}/>
                            </video> : props.mediaInput.type == "audio" ?
                        <audio
                        style={{
                            width: "180px",
                        }}
                        controlsList="nodownload" controls>
                            <source src={props.mediaInput.source}/>
                            </audio> :null}
                </div>
        </div>
    )
}

export default MediaView;