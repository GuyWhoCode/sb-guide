const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
var database;
const dbClient = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
    database = db
})

console.log(database.collection("Guides").find({"category": "Skyblock"}))
module.exports = {
    database: database
}