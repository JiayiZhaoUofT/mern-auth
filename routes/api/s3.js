const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const fs = require("fs");
const bluebird = require("bluebird");
const multiparty = require("multiparty");
const router = express.Router();
const request = require("request");
// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name) => {
  console.log(process.env.S3_BUCKET);
  const params = {
    ACL: "public-read",
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    // ContentType: type.mime,
    Key: `${name}`
  };
  return s3.upload(params).promise();
};
router.post("/testing", async (req, res) => {
  let url = req.data.url;
  request({ url, encoding: null }, async (err, resp, buffer) => {
    // Use the buffer
    // buffer contains the image data
    // typeof buffer === 'object'
    if (err) return res.status(200).send(err);
    try {
      const data = await uploadFile(buffer, req.data.name);
      return res.status(200).send(data);
    } catch (err) {
      return res.status(400).send(err);
    }
  });
});
// Define POST route
router.post("/upload", (request, response) => {
  const form = new multiparty.Form();

  form.parse(request, async (error, fields, files) => {
    console.log("upload");
    if (error) throw new Error(error);
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      //    const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `bucketFolder/${timestamp}-lg`;
      const data = await uploadFile(buffer, fileName);
      return response.status(200).send(data);
    } catch (error) {
      console.log(error);
      return response.status(400).send(error);
    }
  });
});
router.get("/test", (req, res) => {
  res.send("s3 test ");
});
// app.listen(process.env.PORT || 9000);
// console.log("Server up and running...");
router.get("/", (req, res) => res.send("s3"));
module.exports = router;
