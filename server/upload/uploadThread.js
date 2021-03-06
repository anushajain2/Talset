const awsSDK = require("aws-sdk");
const { workerData, parentPort } = require("worker_threads");

awsSDK.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});
const s3 = new awsSDK.S3();

try {
  //console.log("hii");
  s3.putObject(
    {
      Bucket: "" + process.env.S3_BUCKET_NAME,
      Key: workerData.newName,
      Body: Buffer.from(workerData.buffer),
      ContentType: workerData.mimetype,
      ACL: "public-read",
    },
    async function (err, data) {
      if (err) console.log(err);
      else parentPort.postMessage({ status: "Done" });
    }
  );
  //
} catch (e) {
  console.log(e);
}
