import React, {useEffect, useState, useImperativeHandle,forwardRef} from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState,ContentState, convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import parse from 'html-react-parser';

let CustomEditor =forwardRef((props,ref)=>{

    let [description, setDescription] = useState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(props.description))));

    useEffect(()=>{
        props.setDescription(draftToHtml(convertToRaw(description.getCurrentContent())))
        
    },[description])

    useImperativeHandle(ref, () => ({
        updateEditorValue() {
            setDescription(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(props.description))))
        },

        validateEditorValue(){
            if (!description || description.getCurrentContent().getPlainText().trim() == "") {
                props.setDescriptionCheck(true);
                return false;
            }else{
                return true;
            }
        }
    
      }));

    return (
        <Editor
            editorState={description}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorStyle={{minHeight:"200px", border:"1px solid rgba(0,0,0,0.2)", borderRadius:"5px", overflow:"scroll", maxHeight:"400px"}}
            onEditorStateChange={(e)=>{
                console.log(e)
                props.setDescriptionCheck(false)
                setDescription(e)
            }}
        />
    )        
})

function CustomEditorViewer(props){
    return (
        <div 
            style={{
                overflow:"scroll",
                maxHeight:"150px",
                minHeight:"150px",
                maxWidth:props.maxWidth?props.maxWidth:"500px",
                minWidth:props.minWidth?props.minWidth:"500px",
                border:"1px solid rgba(0,0,0,0.2)",
                borderRadius:"5px",
                padding:"10px"
            }}
        >
            {parse(props.description)}
        </div>
    )        
}


export {
    CustomEditor,
    CustomEditorViewer
}