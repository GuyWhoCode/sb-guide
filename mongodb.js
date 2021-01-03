const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
var database;
// const dbClient = new mongoClient(uri, )
mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    database = client.db("skyblockGuide")
    module.exports = {
        database: database
    }
})


// dbClient.connect((err, data) => {
//     // console.log()
//     console.log(data)
// })
