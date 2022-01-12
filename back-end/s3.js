require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads
function uploadFileToS3(base64Image) {
  var buf = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""),'base64')
  var data = {
    Key: "file"+ Math.round((new Date()).getTime() / 1000) , 
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    Bucket: bucketName
  };
  // return s3.putObject(data, function(err, data){
  //     if (err) { 
  //       console.log(err);
  //       console.log('Error uploading data: ', data); 
  //     } else {
  //       console.log(data);
  //       console.log('successfully uploaded the image!');
  //     }
  // }).promise();
  return s3.upload(data).promise();

}
exports.uploadFileToS3 = uploadFileToS3;


function viewFileFromS3(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
exports.viewFileFromS3 = viewFileFromS3;

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// download
function getFileStream(fileKey) {

  const fileURL = s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: fileKey,
    Expires: 60 * 1 // time in seconds: e.g. 60 * 5 = 5 mins
})

console.log(fileURL);
return fileURL

}
exports.getFileStream = getFileStream;


// delete
function deleteFile(fileKey){

    var params = {
        Bucket: bucketName,
        Key: fileKey
      };

      s3.deleteObject(params , (err , data) => {
        if (err) console.log(err, err.stack);
        else console.log(data)
      })

}
exports.deleteFile = deleteFile
