import { useStateRef } from "react-usestateref";
import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [myImg, setMyImg] = useState("");
  // const [myImgKey, setMyImgKey , imgKeyRef] = useStateRef("");

  const submit = async (event) => {
    event.preventDefault();
    const result = await postImage({ image: file, description });
    setImages([result.image, ...images]);

  };

  async function postImage({ image, description }) {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);
  
    const result = await axios
      .post("http://localhost:8080/users/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        var i = res['data']['key']
        console.log(i);
        // setMyImgKey(i)
        updateImage(i)
        console.log(i);
      })
    return result.data;
  }

  const updateImage = (i) => {
    setMyImg("http://localhost:8080/users/images/"+i)
  };

  const deleteNow = (i) => {
    axios.get("http://localhost:8080/users/image-delete/0d8668a099d2fb58a5cff1e294bc321c").then( (res) => {
      var d = res;
      console.log(d);
    } )
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  useEffect ( () => {
      // console.log(i);
  } , [])

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Submit</button>
      </form>

      {images.map((image) => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}

      <img
        src={myImg}
        alt="loading"
        style={{ width: "250px", height: "250px" }}
      ></img>


        <button onClick={() => deleteNow()}> Delete </button>

    </div>
  );
}

export default App;
