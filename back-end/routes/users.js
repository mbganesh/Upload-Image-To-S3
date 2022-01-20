var express = require("express");
var router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  uploadFileToS3,
  getFileStream,
  deleteFile,
  deleteAllFile
} = require("../s3");


// newbieeee

function generateRandomStr(len) {
  var rdmString = "";
  for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substring(2));
  return  rdmString.substr(0, len);

}

router.post("/upload-image", upload.single("image"), async (req, res) => {
  var recievedData = req.body;

  var result ;
  for (let i = 0; i < 10; i++) {
    result = await uploadFileToS3(recievedData["base64Image"] , generateRandomStr(5) );
  }
  console.log(result);
  res.json({ success: true });
});

router.post("/view-image", async (req, res) => {
  var recievedData = req.body;
  const result = getFileStream(recievedData["fileKey"]);
  res.json({ success: true, message: result });
});

router.post("/delete-image", async (req, res) => {
  const result = deleteFile(req.body.fileKey);
  console.log(result + "xxxxxx");
  res.json({ success: true, message: result });
});

router.post('/delete-all-image' , async ( req , res ) => {
  console.log(req.body); // { fileKey: 'tempDir/' }
  const result = deleteAllFile(req.body.fileKey)
  res.json({ success: true, message: result });
})

module.exports = router;
