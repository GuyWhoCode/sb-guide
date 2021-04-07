const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const distance = require('jaro-winkler')
module.exports = {
    name: "search",
    async execute(message, args) {
        if (args.length == 0) return message.channel.send("See `g!search <Category Name>`")
        let searchQuery = globalFunctions.escapeRegex(args.join(" ").trim())
        //checks if there is any bad input
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guide = await guidesDB.find({}).toArray()

        let threshold = 0.60
        const parseQuery = query => {
            possibleQueries = {}
            guide.map(val => {
                let closeness = val.categoryTitle
                    .split(" ")
                    .map(word => distance(query, word, {caseSensitive: false}))
                    .reduce((prev, current) => prev + current)/(val.categoryTitle.split(" ").length)
                if (closeness > threshold) {
                    possibleQueries[val.categoryTitle] = closeness
                    possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                }
            })
        
            var bestQuery = ""
            Object.keys(possibleQueries)
                .filter(val => !val.includes("embed"))
                .map(val => {
                    if (bestQuery == "" || possibleQueries[bestQuery] < possibleQueries[val]) {
                        bestQuery = val 
                    } 
                })
            return possibleQueries[bestQuery + " embed"]
        }
        let guideMessage = parseQuery(searchQuery)
        // if (guide[0] == undefined || guide.length > 1) return message.channel.send("The Category Title that was given was incorrect.")
        //returns an error if the Category Title did not match anything in the database
        
        
        guideMessage.timestamp = new Date()
        message.channel.send({embed: guideMessage}).catch(err => {
            message.channel.send("Oops! Something went wrong. Error Message: " + err)
        })
	}
}

// https://fusejs.io/
// https://www.npmjs.com/package/jaro-winkler
// const fuse = require('fuse.js')
//fuse is backup algo.

// Command to run test file for this is: node ./Commands/search.js