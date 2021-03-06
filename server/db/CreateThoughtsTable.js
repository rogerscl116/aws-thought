// import aws-sdk package
const AWS = require('aws-sdk');

require('dotenv').config()

module.exports = function(customENV){ return function(req, res) {
    //get ENV variables
    const AWS_KEY_ID = customENV.access_key;
    const AWS_SECRET_KEY = customENV.secret_access_key;
    const AWS_REGION = customENV.s3_region;

// modify the AWS config object that DynamoDB uses to connect
AWS.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    endpoint: "http://localhost:8000"
  });
}};

// create the DynamoDB service object
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// params object that holds the schema and metadata of the table
const params = {
    TableName : "Thoughts",
    KeySchema: [       
      { AttributeName: "username", KeyType: "HASH"},  // partition key
      { AttributeName: "createdAt", KeyType: "RANGE" }  // sort key
    ],
    AttributeDefinitions: [       
      { AttributeName: "username", AttributeType: "S" },
      { AttributeName: "createdAt", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 10, 
      WriteCapacityUnits: 10
    }
  };

  // make a call to the DynamoDB instance and create a table
  dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});