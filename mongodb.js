const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
var database;
const dbClient = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true})

dbClient.connect((err, data) => {
    database = data.db("skyblockGuide")
})
module.exports = {
    database: database
}