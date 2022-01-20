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
function uploadFileToS3(base64Image, name) {
  var buf = Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  var data = {
    Key: "tempDir/" + name, // "file"+ Math.round((new Date()).getTime() / 1000) ,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    Bucket: bucketName,
  };
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

// download
function getFileStream(fileKey) {
  const fileURL = s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: fileKey,
    Expires: 60 * 1, // time in seconds: e.g. 60 * 5 = 5 mins
  });

  console.log(fileURL);
  return fileURL;
}
exports.getFileStream = getFileStream;

// delete
function deleteFile(fileKey) {
  var params = {
    Bucket: bucketName,
    Key: fileKey,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}
exports.deleteFile = deleteFile;

// deleteAll
function deleteAllFile(fileName) {
  // fileName -> 'tempDir/'
  var myKeys = [];

  var params = {
    Bucket: bucketName,
    Prefix: fileName, // dirName
  };

  s3.listObjectsV2(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data.Contents.length);

      for (let i = 0; i < data.Contents.length; i++) {
        var key = data.Contents[i]["Key"];
        console.log(key);
        myKeys.push(key);
      }

      if (myKeys.length !== 0) deleteWithKeys(myKeys)
    }
  });

  console.log(myKeys);
}
exports.deleteAllFile = deleteAllFile;


// deleteImageFinalFun
function deleteWithKeys(myKeys) {
  for (let i = 0; i < myKeys.length; i++) {
    fileName = myKeys[i];
    console.log(fileName);
    var params = {
      Bucket: bucketName,
      Key: fileName,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }
}


/** **************  FOR DELETE IMAGE ****************
 * 
 * Resource:1
 * -----------
 * https://stackoverflow.com/a/61982236/11579741
 * 
 * EX:
 * ----
 * {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowBucketSync",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:PutObjectAcl",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::komala-app-bucket",
                "arn:aws:s3:::komala-app-bucket/*"
            ]
        }
    ]
}

 *  Resource:2
 * --------------
 * https://stackoverflow.com/a/50366802/11579741
 *  EX:
 * ----
//  var params = {
//   Bucket: 'STRING_VALUE', /* required */
//   Prefix: 'STRING_VALUE'  // Can be your folder name
// };
// s3.listObjectsV2(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });
