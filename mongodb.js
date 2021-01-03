const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
var database;
// const dbClient = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true})
mongoClient.connect(uri, function(err, client) {
    database = client.db("skyblockGuide")
})
// dbClient.connect((err, data) => {
//     // console.log(data.collection("Guides").find({"category": "Skyblock"}))
//     console.log(data)
// })
module.exports = {
    database: database
}