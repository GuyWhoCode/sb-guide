// const {dbClient} = require("./mongodb.js")
const globalFunctions = require("./globalfunctions.js")
const mongoClient = require('mongodb').MongoClient
const uri = process.env.uri;
const dbClient = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10})

//replaces process.env.password for personal testing
async function post (message, serverID, action) {
    let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
    let guides = await guidesDB.find({}).toArray()
    
    let serverInfo = dbClient.db("skyblockGuide").collection("Settings")
	let findServer = await serverInfo.find({"serverID": serverID}).toArray()
	let server = findServer[0]
    
    if (action == "initiaize") {
        if (server.sbGuideChannelID == "None" || server.dGuideChannelID == "None") return message.channel.send("Initialization failed. If you wanted to have the Skyblock/Dungeon Guides channels, rerun `g!config`")
        
        //         Send first then update Guide DB w/ proper message ID
        // guideChannel.send({embed: guideMessage}).catch(err => {
        //     message.channel.send("Oops! Something went wrong. Error Message: " + err)
        // }).then(msg => {
        //     newMsgId = msg.id
        //     guidesDB.updateOne({"categoryTitle": guide[0].categoryTitle}, {$set: {"embedMessage": guideMessage, "categoryTitle": guide[0].categoryTitle, "messageID": newMsgId, "category": guide[0].category}})
        // })
    }

    
    
    //**PESUDOCODE**
    //else if (action == "edit") {
        //Get the guide DB and loop over the Message IDs through each of the servers
    // }

    
    //similar code would happen for delete
}
dbClient.connect(async(err) => {
    // post("Edit")
})
// module.exports = {
    
// }

