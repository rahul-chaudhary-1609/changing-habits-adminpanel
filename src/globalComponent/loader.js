import React,{useState} from 'react';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 10px auto;
  border-color: blue;
`;


const Loader = () =>{
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");
  
    return (
      <div className="sweet-loading" style={{height: '800px'}}>
      <ClipLoader color={color} loading={loading} css={override} size={150} />
      </div>
    );
}

export default Loader;