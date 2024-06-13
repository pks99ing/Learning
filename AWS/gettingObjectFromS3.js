// You can get list of all object from specified S3 bucket which has certain prefix that you provide.
// Here I am using 'aws-sdk'

// get the aws-sdk library
const AWS = require('aws-sdk');

// configure your credentials from .env file
AWS.config.update({ region: process.env.AWS_REGION, accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

// create an s3 object (this object will interact with s3)
const s3 = new AWS.S3();

const params = 
    // name of the bucket that you want to work with
    Bucket: 'bucketName',
    // prefix of the file eg let say you have  (bucketName)/live/new/2024151014444_5_hello.pdf
    Prefix: 'live/new/2024151014444'
};

// Call S3 to list objects with the specified prefix
s3.listObjectsV2(params, (err, data) => {
    if (err) {
        console.log('Error', err);
    } else {
        console.log(`Objects with prefix ${params.Prefix}:`);
        data.Contents.forEach((obj) => {
            const urlParams = { Bucket: params.Bucket, Key: obj.Key };
            // using bucket name and the key you can get the signedUrl using which you can download the file
            const url = s3.getSignedUrl('getObject', urlParams);
            console.log('URL for', obj.Key, ':', url);
        });
    }
});
