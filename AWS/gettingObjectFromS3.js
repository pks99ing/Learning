require('dotenv').config();
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// Configure AWS SDK v3
const s3Client = new S3Client({ region: process.env.AWS_REGION, accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

// Define the parameters for listing objects
const params = {
    Bucket: 'bucket-name',
    Prefix: 'live/new/file-name'
};



// Define an async function to handle the listObjectsV2 operation
const listObjects = async () => {
    try {
        // Call listObjectsV2 using the S3 client
        const data = await s3Client.send(new ListObjectsV2Command(params));

        console.log(`Objects with prefix ${params.Prefix}:`);
        for (const obj of data.Contents) {
            // Generate a presigned URL with a 10-minute expiry
            const urlParams = {
                Bucket: params.Bucket,
                Key: obj.Key,
            };
            const command = new GetObjectCommand(urlParams);
            // const response = await s3Client.send(command);
            // const byteArray = await response.Body.transformToByteArray();
            // const buffer = Buffer.from(byteArray);
            // await fs.writeFile("image.pdf", buffer);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
            console.log(url)

        }
    } catch (err) {
        console.log('Error', err);
    }
};

// Call the async function to list objects and generate URLs
listObjects();



// * First you want to list all the object that are present in your bucket. So obviously you have to give your bucket name.
// ListObjectV2Command({Bucket:"bucket-name"}) is used to list all the objects that you have in ur bucket (max returned 1000 object at once) 
// The "data.Contents" attribute contains the key name of all the object that are returned.
// Since from the first command we only got list of objects but not actual object. Therefore with GetObjectCommand({Bucket:"bucket-name" ,key:obj.Key}) we make a command and with s3Client object we
// send the command.
