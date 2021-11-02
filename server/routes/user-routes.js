const express = require('express');
const router = express.Router();

// configure the service interface object
const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-2",
  endpoint: "http://localhost:8000",

};

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

router.get('/users', (req, res) => {
    const params = {
      TableName: table
    };
      // scan return all items in the table
      dynamodb.scan(params, (err, data) => {
        if (err) {
        res.status(500).json(err); // an error occurred
      } else {
        res.json(data.Items)
        }
    });
  })

router.get('/users/:username', (req, res) => {
    console.log(`Querying for thought(s) from ${req.params.username}.`);
    const params = {
        TableName: table,
        KeyConditionExpression: "#un = :user",
        ExpressionAttributeNames: {
          "#un": "username",
          "#ca": "createdAt",
          "#th": "thought"
        },
        ExpressionAttributeValues: {
          ":user": req.params.username
        },
        ProjectionExpression: "#th, #ca",
        ScanIndexForward: false
      };

      dynamodb.query(params, (err, data) => {
        if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          res.status(500).json(err); // an error occurred
        } else {
          console.log("Query succeeded.");
          res.json(data.Items)
        }
      });
    }); // closes the route for router.get(users/:username)

module.exports = router;
