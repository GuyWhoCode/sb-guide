const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true})
var database;

dbClient.connect(async(err) => {
    database = dbClient.db("skyblockGuide")
})
module.exports = {
    database: database
}