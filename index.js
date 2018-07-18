const axios = require("axios");
const express = require('express');
const app = express();
var token;
const port = process.env.PORT || 5000

app.use(express.static('public'));

app.listen(port, function () {
  console.log(`Listening on ${port}`);
});




var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
// var url = 'mongodb://localhost:27017/riithinkdb';
var url = 'mongodb://cardwatch1:cardwatch1@ds239931.mlab.com:39931/cardwatch';
var doesCollectionExist = true;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    if(doesCollectionExist == false) {
        insertDocuments(db, function() {
            // findDocuments(db, function() {
                doesCollectionExist = true;
                db.close();
            // });
        });
    }

});


var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('tokens');
    // Insert some documents
    collection.insertMany([
        {token: token}
    ], 
    function(err, result) {
        // assert.equal(err, null);
        // assert.equal(3, result.result.n);
        // assert.equal(3, result.ops.length);
        console.log("Inserted token into the collection");
        callback(result);
    });
}



// var findDocuments = function(db, callback) {
//     // Get the documents collection
//     var collection = db.collection('tokens');
//     // Find some documents
//     collection.find({}).toArray(function(err, docs) {
//       assert.equal(err, null);
//       console.log("Found the following records");
//       console.log(docs)
//       callback(docs);
//     });
// }


// var updateDocument = function(db, callback) {
//     // Get the documents collection
//     var collection = db.collection('tokens');
//     // Update document where a is 2, set b equal to 1
//     collection.updateOne({ a : 2 }
//       , { $set: { b : 1 } }, function(err, result) {
//       assert.equal(err, null);
//       assert.equal(1, result.result.n);
//       console.log("Updated the document with the field a equal to 2");
//       callback(result);
//     });  
// }

// var MongoClient = require('mongodb').MongoClient;
// var doesCollectionExist = true;
// var url = 'mongodb://cardwatch1:cardwatch1@ds239931.mlab.com:39931/cardwatch';

// MongoClient.connect(url, function(err, db) {
    
//     if (err) throw err;
    
//     tokens = db.collection('tokens');
    
// });




var dataObj = {
    token: token
}

// if (doesCollectionExist == true) {
//     tokens.insertOne(dataObj);
//     doesCollectionExist = false;
//     console.log('collection does exist');
// }
// else if (doesCollectionExist == false) {
//     console.log('collection does NOT exist');
//     tokens.update(


//         // grab id
//         dataObj,
//         // define what to update
//         dataObj,
        
//         // Tell mongo to re-check each time
//         { upsert: true }
//     );
// }


















function getDate() {
    return Math.floor(Date.now()/1000/60/60);
};


var token = '358B1CF3-37E4-48D5-B84A-18B6B2F1F806';
var tokenDate = 425512;
var expiration = 0;
console.log('origin info is ' + token, tokenDate, expiration);

// create function to generate new token, return TOKEN and EXPIRATION
function getNewToken() {
    console.log('getNewToken has been fired');
    axios.get('http://dev.cwposdev.com:8084/mobileapi/servoy-service/rest_ws/cdwapi/authToken', {
        headers: { 'Authorization':  'Basic NzZFRTkyODQtMTk4MC00NjEzLUI5NzktOThFMUY0MjU3MTE0OjhCOTQxRjA1LUJCNkUtNDlBRi1CMUFCLUI5NThGNjkyOTVGNA==' }
    })
    .then(response => {
        console.log(response.data);
        var rawExpireDate = response.data.results.expiresIn;
        expiration = rawExpireDate/60/60;
        token = response.data.results.accessToken;
        tokenDate = getDate();
    })
    .catch(function (error) {
        console.log(error);
    })
}


function checkToken() {
    console.log('updated info is ' + token, tokenDate, expiration);
    var expirationDate = tokenDate + expiration;
    var todaysDate = getDate();
    if(expirationDate <= todaysDate) {
        console.log('token has expired');
        getNewToken();
    }
    else {
        console.log('token is not expired');
        console.log(expirationDate);
        return;
    }

};


app.get("/endpoint", function(request, response) {
    
    
    // checkToken();


    var requestType = request.query.requestType;
    if(requestType == 'balance') {
        
        let baseUrl = 'http://dev.cwposdev.com:8084/mobileapi/servoy-service/rest_ws/cdwapi/';
        let balance = 'balance/';
        let customerNumber = 717;
        let displaySpouse = '?display_spouse=true&token=';
        let balanceRequest = baseUrl + balance + customerNumber + displaySpouse + token;
        let testArray = [];

        axios.get(balanceRequest, {
    
        })
        .then(response => {
            let newResponse = response.data;
            userBalance = newResponse.results[0].records[0].accountBalance;
            testArray.push(userBalance);
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            response.send(testArray);
        })
    } else if (requestType == 'transactions') {
        let baseUrl = 'http://dev.cwposdev.com:8084/mobileapi/servoy-service/rest_ws/cdwapi/';
        let transaction = 'transactions?customer=';
        let customerNumber = 717;
        let displaySpouse = '&token=';
        let transactionRequest = baseUrl + transaction + customerNumber + displaySpouse + token;
        let transactionsList = [];
        axios.get(transactionRequest, {
        })
        .then(response => {
            let newResponse = response.data;
            console.log(newResponse);
            for (i=0; i<newResponse.results[0].records.length; i++) {
                userTransactions = newResponse.results[0].records[i];
                transactionsList.push(userTransactions.amount);
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            response.send(transactionsList);
        })

    }



    























});