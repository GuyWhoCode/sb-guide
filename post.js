const {dbClient} = require("./mongodb.js")
const globalFunctions = require("./globalfunctions.js")
const {yesAlias, noAlias, cancelAlias, templateEmbed, skycommAffliates, skycommPartners} = require("./constants.js")

module.exports = {
    async post (client, message, serverID, action, changedMsg) {
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        
        let serverInfo = dbClient.db("skyblockGuide").collection("Settings")
        let findServer = await serverInfo.find({"serverID": serverID}).toArray()
        let dTableOfContents = Object.create(templateEmbed)
        dTableOfContents.title = "Table of Contents -- Dungeons"
        dTableOfContents.timestamp = new Date()        
        
        let sbTableOfContents = Object.create(templateEmbed)
        sbTableOfContents.title = "Table of Contents -- Skyblock"
        sbTableOfContents.timestamp = new Date()

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
                            
                            guideMessage.category === "Skyblock" ? (guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID)) : (guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID))
        
                            guideChannel.send({embed: guideMessage.embedMessage}).catch(err => {
                                message.channel.send("Oops! Something went wrong. If this continues, contact Mason#9718. Error Message: " + err)
                            }).then(msg => {
                                guideMessage.messageID[serverID] = msg.id
                                guideMessage.category === "Skyblock" ? (sbTableOfContents.fields.push({name: guideMessage.categoryTitle, value: globalFunctions.makeMsgLink(msg.id, findServer[0].sbGuideChannelID, serverID)})) : (dTableOfContents.fields.push({name: guideMessage.categoryTitle, value: globalFunctions.makeMsgLink(msg.id, findServer[0].dGuideChannelID, serverID)}))
                                console.log("Operation complete for " + guideMessage.categoryTitle)

                                guidesDB.updateOne({"categoryTitle": guideMessage.categoryTitle}, {$set: {"embedMessage": guideMessage.embedMessage, "categoryTitle": guideMessage.categoryTitle, "messageID": guideMessage.messageID, "category": guideMessage.category}})
                            })
                        }
                        
                        await message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID)
                            .send({embed: sbTableOfContents})
                            .then(msg => findServer[0].sbTable = msg.id)
                        //Sends Skyblock Table of Contents   

                        await message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)
                            .send({embed: dTableOfContents})
                            .then(msg => findServer[0].dTable = msg.id)
                        //Sends Dungeon Table of Contents

                        await serverInfo.updateOne({"serverID": message.guild.id}, {$set: findServer[0]})
                        return message.channel.send("Initialization complete!")
                        //Copied lines 78-111 as Message Collectors do not properly exit after returning

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
                    
                    guideMessage.category === "Skyblock" ? (guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID)) : (guideChannel = message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID))

                    guideChannel.send({embed: guideMessage.embedMessage}).catch(err => {
                        message.channel.send("Oops! Something went wrong. If this continues, contact Mason#9718. Error Message: " + err)
                    }).then(msg => {
                        guideMessage.messageID[serverID] = msg.id
                        guideMessage.category === "Skyblock" ? (sbTableOfContents.fields.push({name: guideMessage.categoryTitle, value: globalFunctions.makeMsgLink(msg.id, findServer[0].sbGuideChannelID, serverID)})) : (dTableOfContents.fields.push({name: guideMessage.categoryTitle, value: globalFunctions.makeMsgLink(msg.id, findServer[0].dGuideChannelID, serverID)}))
                        guidesDB.updateOne({"categoryTitle": guideMessage.categoryTitle}, {$set: {"embedMessage": guideMessage.embedMessage, "categoryTitle": guideMessage.categoryTitle, "messageID": guideMessage.messageID, "category": guideMessage.category}})
                    })
                }

                await message.guild.channels.cache.find(ch => ch.id === findServer[0].sbGuideChannelID)
                    .send({embed: sbTableOfContents})
                    .then(msg => findServer[0].sbTable = msg.id)
                //Sends Skyblock Table of Contents   

                await message.guild.channels.cache.find(ch => ch.id === findServer[0].dGuideChannelID)
                    .send({embed: dTableOfContents})
                    .then(msg => findServer[0].dTable = msg.id)
                //Sends Dungeon Table of Contents
                
                await serverInfo.updateOne({"serverID": message.guild.id}, {$set: findServer[0]})
                return message.channel.send("Initialization complete!")
            }
        
        } else if (action == "edit") {
            // if (globalFunctions.msToDay(Date.now()) - globalFunctions.msToDay(findServer[0].lastUpdated) < timeDelay) return undefined;
            let guideMessage = await guidesDB.find({"categoryTitle": changedMsg}).toArray()
            
            //update the table of contents message if add category is called with the serverID -- which is not being utilized
            
            let allServers = await serverInfo.find({}).toArray()
            client.guilds.cache.map(server => {
                let serverSettings;
                allServers.map(val => val.serverID === server.id ? serverSettings = val : undefined)

                server.channels.cache.map(async(channel) => {
                    if (channel.id === serverSettings.sbGuideChannelID) {
                        // channel.messages.fetch({around: guideMessage[0][serverInfo.serverID], limit: 1})
					    //     .then(msg => {
                        //         console.log(msg)
					    //     	// msg.first().edit({embed: embedMessage}).then(me => {message.channel.send("ID: " + me.id)});
					    //     })
                        //updates the guide message

                        await channel.messages.fetch({around: serverSettings.sbTable, limit: 1})
                            .then(msg => {
                                if (serverInfo.sbTable == msg.id) msg.first().delete()
                                console.log(msg)
                                console.log("SB TOS above")
                                //if the msg id fetched doesn't match, assume the message is lost/deleted
                            })

                        await globalFunctions.tableOfContents("Skyblock", server.id)
                            .then(val => channel.send({embed: val}).then(msg => serverInfo.sbTable = msg.id))
                        //Deletes and resends the Skyblock Table of Contents
                    
                    } 
                    else if (channel.id === serverInfo.dGuideChannelID) {
                        // guideChannel.messages.fetch({around: guideMessage[0][serverInfo.serverID], limit: 1})
					    //     .then(msg => {
                        //         console.log(msg)
					    //     	// msg.first().edit({embed: embedMessage}).then(me => {message.channel.send("ID: " + me.id)});
					    //     })

                        await channel.messages.fetch({around: serverInfo.dTable, limit: 1})
                            .then(msg => {
                                if (serverInfo.dTable == msg.id) msg.first().delete()
                                //if the msg id fetched doesn't match, assume the message is lost/deleted
                                console.log(msg)
                                console.log("D TOS: " + msg)
                            })

                        await globalFunctions.tableOfContents("Dungeons", server.id)
                            .then(val => channel.send({embed: val}).then(msg => serverInfo.dTable = msg.id))
                        //Deletes and resends the Dungeon Table of Contents
                    }
                })
                
                serverInfo.updateOne({"serverID": server.id}, {$set: serverInfo})
                console.log("Operation complete!")
            })

        } else if (action == "delete") {
            // Get the settings DB and loop over the Message IDs through each of the servers
        }
    }
}