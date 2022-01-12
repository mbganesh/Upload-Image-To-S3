var express = require('express');
var router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile , uploadFileToS3 , getFileStream , deleteFile, viewFileFromS3} = require('../s3')



router.get('/images/:key' , (req , res)=> {
  const key = req.params.key
  const readStream = getFileStream(key)
  console.log(readStream);
  readStream.pipe(res)
})

router.get('/image-delete/:key' , (req , res)=> {
  const key = req.params.key
  const deleteFi = deleteFile(key)

  console.log(deleteFi);

  // readStream.pipe(res)
})


router.post('/images' , upload.single('image') , async (req , res) => {

  const file = req.file
  // console.log(file);
  const result = await uploadFile(file)

  console.log(result.key);

  const description = req.body.description

  res.json({key:result['key']})
})


// newbieeee

router.post('/upload-image' , upload.single('image') , async (req , res) => {

  var recievedData = req.body;

  const result = await uploadFileToS3(recievedData['base64Image'])
  
  console.log(result);

  res.json({success:true})

})

router.post('/view-image' , async (req , res) => {

  var recievedData = req.body;
  const result = getFileStream(recievedData['fileKey'])
 res.json({success:true, message:result})

})



module.exports = router;
