const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
var database;
// const dbClient = new mongoClient(uri, { )
mongoClient.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    poolSize: 10
}, (err, db) => {
    database = db
})
module.exports = {
    database: database
}