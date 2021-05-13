const {dbClient} = require("./mongodb.js")
const globalFunctions = require("./globalfunctions.js")
const {yesAlias, noAlias, cancelAlias} = require("../constants.js")

module.exports = {
    async post (message, serverID, action) {
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guides = await guidesDB.find({}).toArray()
        
        let serverInfo = dbClient.db("skyblockGuide").collection("Settings")
        let findServer = await serverInfo.find({"serverID": serverID}).toArray()
        
        if (action == "initialize") {
            if (findServer[0].sbGuideChannelID == "None" || findServer[0].dGuideChannelID == "None") return message.channel.send("Initialization failed. If you wanted to have the Skyblock/Dungeon Guides channels, rerun `g!config`")
            
            if (findServer[0].initialization) {
                message.channel.send("Previous Initialization detected. Confirm with `yes` or `no` if you want to resend **all** of the guides. **WARNING** This will not delete the existing guide messages but send new messages.")
                const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
		        const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("3m")})
                collector.on('collect', msg => {
                    if (globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
                        collector.stop()
                        //Stops the collector after confirmation

                        for (let guideMessage of guides) {
                            let guideChannel = "";
                            guideMessage.category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID) : guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)
                            //need to add case for resource being posted in the wrong category
                            guideChannel.send({embed: guideMessage.embedMessage}).catch(err => {
                                message.channel.send("Oops! Something went wrong. If this continues, contact Mason#9718. Error Message: " + err)
                            }).then(msg => {
                                guideMessage.messageID[serverID] = msg.id
                                guidesDB.updateOne({"categoryTitle": guideMessage.categoryTitle}, {$set: {"embedMessage": guideMessage.embedMessage, "categoryTitle": guideMessage.categoryTitle, "messageID": guideMessage.messageID, "category": guideMessage.category}})
                            })
                        }
                        //Copied lines 49-59 as Message Collectors do not properly exit after returning
                        return message.channel.send("Initialization complete!")
                    
                    } else if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())) {
                        collector.stop()
                        //Stops the collector after confirmation
                        return message.channel.send("Initialization cancelled.")
                    
                    } else {
                        return message.channel.send("Enter a proper response. Either `yes` or `no`")
                    }
                })
            
            } else {
                for (let guideMessage of guides) {
                    let guideChannel = "";
                    guideMessage.category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID) : guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)
                    //need to add case for resource being posted in the wrong category
                    guideChannel.send({embed: guideMessage.embedMessage}).catch(err => {
                        message.channel.send("Oops! Something went wrong. If this continues, contact Mason#9718. Error Message: " + err)
                    }).then(msg => {
                        guideMessage.messageID[serverID] = msg.id
                        guidesDB.updateOne({"categoryTitle": guideMessage.categoryTitle}, {$set: {"embedMessage": guideMessage.embedMessage, "categoryTitle": guideMessage.categoryTitle, "messageID": guideMessage.messageID, "category": guideMessage.category}})
                    })
                }
                findServer[0].initialization = true
                settingsDB.updateOne({"serverID": message.guild.id}, {$set: findServer[0]})
                return message.channel.send("Initialization complete!")
            }

            
        }
    
        
        
        //**PESUDOCODE**
        //else if (action == "edit") {
            //Get the guide DB and loop over the Message IDs through each of the servers
        // }
    
        
    }
}
