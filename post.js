// const {dbClient} = require("./mongodb.js")
const globalFunctions = require("./globalfunctions.js")
// const mongoClient = require('mongodb').MongoClient
// const uri = "mongodb+srv://dbADMIN:"+  process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
// const dbClient = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10})

//replaces process.env.password for personal testing
async function post (action) {
    let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
    let guides = await guidesDB.find({}).toArray()
    
    console.log(guides)

    // guideChannel.send({embed: guideMessage}).catch(err => {
    //     message.channel.send("Oops! Something went wrong. Error Message: " + err)
    // }).then(msg => {
    //     newMsgId = msg.id
    //     guidesDB.updateOne({"categoryTitle": guide[0].categoryTitle}, {$set: {"embedMessage": guideMessage, "categoryTitle": guide[0].categoryTitle, "messageID": newMsgId, "category": guide[0].category}})
    // })
    
    //**PESUDOCODE**
    
    // if (action == "initiaize") {
        //Get every Guide Message from the DB
        //Check if SB channel and D channel exist, exist if it doesn't.
        //Edge case if has no perms to type/read messages
            //Discord Permissions: Edit/Delete
        //Iterate over each Guide Message
            //Send first then update Guide DB w/ proper message ID
    // }

    //else if (action == "edit") {
        //Get the guide DB and loop over the Message IDs through each of the servers
    // }

    
    //similar code would happen for delete
}
// dbClient.connect((err) => {
//     console.log("Connected to database!")
//     post("Edit")
// })
// module.exports = {
    
// }