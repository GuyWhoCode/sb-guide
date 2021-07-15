const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const distance = require('jaro-winkler')
const Fuse = require('fuse.js')
const options = {
    includeScore: true,
    shouldSort: true,
    keys: ["categoryTitle", "embedMessage.fields.name"]
}
const threshold = 0.60
const aliasList = ["query", "s"]

module.exports = {
    name: "search",
    alises: aliasList,
    async execute(message, args) {
        if (args.length == 0) return globalFunctions.commandHelpEmbed("Search", aliasList, Date.now(), "g!search money", "Returns the Common Money Making Guide")
        //checks if there is any bad input
        let searchQuery = globalFunctions.escapeRegex(args.join(" ").trim())
        let settingsDB = dbClient.db("skyblockGuide").collection("Settings")
        let serverSettings = await settingsDB.find({"serverID": message.guild.id}).toArray()
        let server = serverSettings[0]
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guide = await guidesDB.find({}).toArray()
        let fuseSearch = new Fuse(guide, options)
        
        const parseQuery = query => {
            possibleQueries = {}
            guide.map(val => {
                if (distance(query, val.categoryTitle, {caseSensitive: false}) > 0.70 || val.categoryTitle == query) {
                    possibleQueries[val.categoryTitle] = distance(query, val.categoryTitle, {caseSensitive: false})
                    if (server.jumpSearchEnabled) {
                        let categoryID = val.category == "Skyblock" ? server.sbGuideChannelID : server.dGuideChannelID
                        possibleQueries[val.categoryTitle + " embed"] = globalFunctions.makeMsgLink(val.messageID[message.guild.id], categoryID, message.guild.id)
                    } else {
                        possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                    }
                }
                //Exact case matching: If the entire query closely matches the category title, prioritize it first.
                
                else if (query.includes(" ") && val.categoryTitle.toLowerCase().split(" ").map(titleWord => titleWord = query.split(" ").map(queryWord => queryWord = titleWord.includes(queryWord.toLowerCase())).filter(word => word == true).flat()).flat().filter(word => word == true).length >= 1 && distance(query, val.categoryTitle, {caseSensitive: false}) > 0.50) {
                    possibleQueries[val.categoryTitle] = distance(query, val.categoryTitle, {caseSensitive: false})
                    if (server.jumpSearchEnabled) {
                        let categoryID = val.category == "Skyblock" ? server.sbGuideChannelID : server.dGuideChannelID
                        possibleQueries[val.categoryTitle + " embed"] = globalFunctions.makeMsgLink(val.messageID[message.guild.id], categoryID, message.guild.id)
                    } else {
                        possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                    }
                //Exact word matching: If the query has a word that matches a category title, add it to the possible queries.
                //If a query has multiple words, check to see if any of the words are in the category title
                //Code structure: Check every word and map over it for exact word matching. If it matches, return a boolean and convert array of T/F into a single boolean w/ filter

                } else if (val.categoryTitle.toLowerCase().includes(query.toLowerCase()) && distance(query, val.categoryTitle, {caseSensitive: false}) > 0.50) {
                    possibleQueries[val.categoryTitle] = distance(query, val.categoryTitle, {caseSensitive: false})
                    if (server.jumpSearchEnabled) {
                        let categoryID = val.category == "Skyblock" ? server.sbGuideChannelID : server.dGuideChannelID
                        possibleQueries[val.categoryTitle + " embed"] = globalFunctions.makeMsgLink(val.messageID[message.guild.id], categoryID, message.guild.id)
                    } else {
                        possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                    }
                //Exact word matching: If the query has a word that matches a category title, add it to the possible queries.
                //If a query just has a single word, do this
                
                } else {
                    let closeness = val.categoryTitle
                        .split(" ")
                        .map(word => distance(query, word, {caseSensitive: false}))
                        .reduce((prev, current) => prev + current)/(val.categoryTitle.split(" ").length)
                    
                    if (closeness > threshold) {
                        if (server.jumpSearchEnabled) {
                            let categoryID = val.category == "Skyblock" ? server.sbGuideChannelID : server.dGuideChannelID
                            possibleQueries[val.categoryTitle + " embed"] = globalFunctions.makeMsgLink(val.messageID[message.guild.id], categoryID, message.guild.id)
                        } else {
                            possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                        }
                    }
                    //Queries with the search algorithm by matching each Category Title word with query and taking average.
                }
            })
            //Implements the Jaro-winkler search algorithm by comparing the search query string to the guide's title
            if (Object.keys(possibleQueries).length != 0) {
                var bestResult = ""
                Object.keys(possibleQueries)
                    .filter(val => !val.includes("embed"))
                    .map(val => {
                        if (bestResult == "" || possibleQueries[bestResult] < possibleQueries[val]) {
                            bestResult = val 
                        } 
                    })
                if (server.jumpSearchEnabled) {
                    return bestResult + "--" + possibleQueries[bestResult + " embed"]
                } else {
                    return possibleQueries[bestResult + " embed"]
                }
                
            }
            //Sorts out the results by picking the highest rated one and returns the corresponding guide embed message
            
            let results = fuseSearch.search(query)
            if (server.jumpSearchEnabled) {
                let categoryID = results[0].item.category == "Skyblock" ? server.sbGuideChannelID : server.dGuideChannelID
                return results[0].item.categoryTitle + "--" + globalFunctions.makeMsgLink(results[0].item.messageID[message.guild.id], categoryID, message.guild.id)
            } else {
                return results[0].item.embedMessage
            }
            //Implements fuzzy searching as a backup search algorithm when the Jaro-winkler algorithm doesn't give a result
            //NICE TO HAVE --- need to have an default case. Rather than returning the least best result, return a embed that suggests user to clarify/narrow down search
        }

        let guideMessage = parseQuery(searchQuery)
        if (server.jumpSearchEnabled) {
            let queryResult = guideMessage.split("--")
            let searchEmbed = {
                color: 0x4ea8de,
                title: 'Search Result',
                fields: [
                    {
                        name: queryResult[0],
                        value: queryResult[1]
                    },
                    
                    ],
                footer: {
                    text: 'Skyblock Guides',
                    icon_url: "https://i.imgur.com/184jyne.png",
                },
                timestamp: new Date()
            }
            message.channel.send({embed: searchEmbed})

        } else {
            guideMessage.timestamp = new Date()
            let section = 0
            const scrollThruMsg = (msg, action) => {
                let newMsg = Object.create(msg)
                //Instance of the msg to prevent accidentally setting the argument since it needs to be preserved for future scrolling
                action == "forward" ? section += 1 : section -= 1
                newMsg.fields = msg.fields[section]
                if (newMsg.fields === undefined) {
                    section -= 1 
                    return undefined
                } else if (newMsg.fields.name === "_ _") {
                    section += 1	
                    return undefined
                }
                return newMsg
            }

            message.channel.send({embed: scrollThruMsg(guideMessage, "forward")}).then((msg) => {
            	msg.react('➡️')
            	const filter = (reaction, user) => {return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id}
            	const collector = msg.createReactionCollector(filter, {time: globalFunctions.timeToMS("3m")})

            	collector.on('collect', reaction => {
            		let guideSection;
            		reaction.emoji.name === "⬅️" ? guideSection = scrollThruMsg(guideMessage, "back") : guideSection = scrollThruMsg(guideMessage, "forward")

            		guideSection != undefined ? msg.edit({embed: guideSection}) : undefined
            		msg.reactions.removeAll()
            		msg.react('⬅️').then(() => msg.react('➡️'))
            		// msg is an instance of message, the main library.
            		// Flow: when a reaction is collected, scroll left or right based on the reaction; reset all reactions; resend reactions
            	})

            	collector.on('end', () => {
            		msg.reactions.removeAll()
            		// once the time limit has been reached, clear all reactions to prevent any confusion
            	})
            })
            //Reaction Scroller
        }

	}
}