const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10})

dbClient.connect(async (err) => {
    console.log("Connected to database!")
})

module.exports = {
    dbClient: dbClient
}