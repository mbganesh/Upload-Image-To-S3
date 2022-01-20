import React, { useState } from "react";
import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import axios from "axios";
import HelpersF from "./HelpersF";

export default function UploadToS3() {
    
  const [image, setImage] = useState("")
  
    const handleUpload = () => {
      let img = HelpersF.img
      axios.post('http://localhost:8080/users/upload-image' , {user:'admin' , base64Image : img})
    }

    const handleView = () => {
        let fileKey = "tempDir/tempImg6"
        axios.post('http://localhost:8080/users/view-image' , {user:'admin' , fileKey:fileKey}).then ( (response)=> {
          var res = response.data.message
          console.log(res);
          setImage(res)
        } )
    }

    const handleDelete = () => {
        let fileKey = "tempDir/tempImg5";
        axios.post('http://localhost:8080/users/delete-image' , {fileKey:fileKey}).then (response => {
          console.log(response.data)
          setImage("")
        })
    }

    const handleDeleteAll = () => {
      let fileKey = "tempDir/";
      axios.post('http://localhost:8080/users/delete-all-image' , {fileKey:fileKey}).then (response => {
        console.log(response.data)
        setImage("")
      })
  }

  return (
    <div style={{ display:'flex' , flexDirection:'column' , height:'100vh' , backgroundColor:'#ddd' }}>
      <AppBar position="fixed">
        <Toolbar style={{ backgroundColor: "pink" }}>
          <Typography style={{ fontWeight: "bold", color: "black" }}>
            Upload Image to S3
          </Typography>
        </Toolbar>
      </AppBar>


      <div style={{backgroundColor:'pink' , marginTop:'150px', height:'250px'}} >

        <img src={image} alt="loading..." style={{width:'250px' , height:'250px'}} />

      </div>


     <div style={{marginTop:'150px' , display:'flex' , justifyContent:'space-evenly'}}>
         <Button variant="contained" style={{ color:'white' ,backgroundColor:'green'}} onClick={() => handleUpload()} >Upload Image</Button>

         <Button variant="contained" style={{ color:'white' ,backgroundColor:'orange'}} onClick={() => handleView()} >View Image</Button>

         <Button variant="contained" style={{ color:'white' ,backgroundColor:'red'}} onClick={() => handleDelete()} >Delete Image</Button>

         <Button variant="contained" style={{ color:'white' ,backgroundColor:'red'}} onClick={() => handleDeleteAll()} >Delete All Image</Button>
     </div>


    </div>
  );
}
