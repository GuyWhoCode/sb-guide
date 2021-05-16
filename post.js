const {dbClient} = require("./mongodb.js")
const globalFunctions = require("./globalfunctions.js")
const {yesAlias, noAlias, cancelAlias, skycommAffliates, skycommPartners} = require("./constants.js")
const {client} = require("./server.js")
module.exports = {
    async post (message, serverID, action, changedMsg) {
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        
        let serverInfo = dbClient.db("skyblockGuide").collection("Settings")
        let findServer = await serverInfo.find({"serverID": serverID}).toArray()
        // let timeDelay = 0

        // if (serverID == "587765474297905158" || serverID == "807319824752443472") {} //do nothing
        // else if (globalFunctions.checkAliases(skycommAffliates, serverID)) timeDelay = 1
        // else if (globalFunctions.checkAliases(skycommPartners, serverID)) timeDelay = 2
        // else timeDelay = 3

        if (action == "initialize") {
            if (findServer[0].sbGuideChannelID == "None" || findServer[0].dGuideChannelID == "None") return message.channel.send("Initialization failed. If you wanted to have the Skyblock/Dungeon Guides channels, rerun `g!config`")
            let guides = await guidesDB.find({}).toArray()

            if (findServer[0].initialization) {
                message.channel.send("Previous Initialization detected. Confirm with `yes` or `no` if you want to resend **all** of the guides. **WARNING** This will not delete the existing guide messages but send new messages.")
                const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
		        const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("3m")})
                collector.on('collect', async (msg) => {
                    if (globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
                        collector.stop()
                        //Stops the collector after confirmation

                        for (let guideMessage of guides) {
                            let guideChannel = "";
                            if (guideMessage.category === "resource") break;
                            guideMessage.category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID) : guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)

                            guideChannel.send({embed: guideMessage.embedMessage}).catch(err => {
                                message.channel.send("Oops! Something went wrong. If this continues, contact Mason#9718. Error Message: " + err)
                            }).then(msg => {
                                guideMessage.messageID[serverID] = msg.id
                                guidesDB.updateOne({"categoryTitle": guideMessage.categoryTitle}, {$set: {"embedMessage": guideMessage.embedMessage, "categoryTitle": guideMessage.categoryTitle, "messageID": guideMessage.messageID, "category": guideMessage.category}})
                            })
                        }
                        await globalFunctions.tableOfContents("Skyblock", serverID)
                            .then(val => 
                                message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID)
                                    .send({embed: val})
                                    .then(msg => findServer[0].sbTable = msg.id))
                                
                        await globalFunctions.tableOfContents("Dungeons", serverID)
                            .then(val => 
                                message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)
                                    .send({embed: val})
                                    .then(msg => findServer[0].dTable = msg.id))
                        
                        
                        await serverInfo.updateOne({"serverID": message.guild.id}, {$set: findServer[0]})
                        //Copied lines 78-91 as Message Collectors do not properly exit after returning
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
                    if (guideMessage.category === "resource") break;
                    guideMessage.category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID) : guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)

                    guideChannel.send({embed: guideMessage.embedMessage}).catch(err => {
                        message.channel.send("Oops! Something went wrong. If this continues, contact Mason#9718. Error Message: " + err)
                    }).then(msg => {
                        guideMessage.messageID[serverID] = msg.id
                        guidesDB.updateOne({"categoryTitle": guideMessage.categoryTitle}, {$set: {"embedMessage": guideMessage.embedMessage, "categoryTitle": guideMessage.categoryTitle, "messageID": guideMessage.messageID, "category": guideMessage.category}})
                    })
                }
                findServer[0].initialization = true
                await globalFunctions.tableOfContents("Skyblock", serverID)
                    .then(val => 
                        message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID)
                            .send({embed: val})
                            .then(msg => findServer[0].sbTable = msg.id))
                                
                await globalFunctions.tableOfContents("Dungeons", serverID)
                    .then(val => 
                        message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)
                            .send({embed: val})
                            .then(msg => findServer[0].dTable = msg.id))
                
                
                await serverInfo.updateOne({"serverID": message.guild.id}, {$set: findServer[0]})
                return message.channel.send("Initialization complete!")
            }
        
        } else if (action == "edit") {
            // if (globalFunctions.msToDay(Date.now()) - globalFunctions.msToDay(findServer[0].lastUpdated) < timeDelay) return undefined;
            let guideMessage = await guidesDB.find({"categoryTitle": changedMsg}).toArray()
            
        
        } else if (action == "delete") {
            // Get the settings DB and loop over the Message IDs through each of the servers
        }
    }
}