const {dbClient} = require("./mongodb.js")

module.exports = {
    async post (message, serverID, action) {
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guides = await guidesDB.find({}).toArray()
        
        let serverInfo = dbClient.db("skyblockGuide").collection("Settings")
        let findServer = await serverInfo.find({"serverID": serverID}).toArray()
        
        if (action == "initialize") {
            if (findServer[0].sbGuideChannelID == "None" || findServer[0].dGuideChannelID == "None") return message.channel.send("Initialization failed. If you wanted to have the Skyblock/Dungeon Guides channels, rerun `g!config`")
            //Need Edge case to prevent initialization from sending twice
            for (let guideMessage of guides) {
                let guideChannel = "";
                guideMessage.category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID) : guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)
                
                guideChannel.send({embed: guideMessage}).catch(err => {
                    message.channel.send("Oops! Something went wrong. If this continues, contact Mason#9718. Error Message: " + err)
                }).then(msg => {
                    guideMessage.messageID[serverID] = msg.id
                    guidesDB.updateOne({"categoryTitle": guideMessage.categoryTitle}, {$set: {"embedMessage": guideMessage.embedMessage, "categoryTitle": guideMessage.categoryTitle, "messageID": guideMessage.messageID, "category": guideMessage.category}})
                })
            }
            return message.channel.send("Initialization complete!")
        }
    
        
        
        //**PESUDOCODE**
        //else if (action == "edit") {
            //Get the guide DB and loop over the Message IDs through each of the servers
        // }
    
        
        //similar code would happen for delete
    }
}