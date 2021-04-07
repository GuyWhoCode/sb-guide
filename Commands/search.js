const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const distance = require('jaro-winkler')
const Fuse = require('fuse.js')
const options = {
    includeScore: true,
    shouldSort: true,
    keys: ["categoryTitle", "embedMessage.fields.name"]
}
let threshold = 0.60

module.exports = {
    name: "search",
    async execute(message, args) {
        if (args.length == 0) return message.channel.send("See `g!search <Category Name>`")
        //checks if there is any bad input
        let searchQuery = globalFunctions.escapeRegex(args.join(" ").trim())
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guide = await guidesDB.find({}).toArray()
        let fuseSearch = new Fuse(guide, options)
        
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
                return possibleQueries[bestResult + " embed"]
            }
            //Sorts out the results by picking the highest rated one and returns the corresponding guide embed message
            
            let results = fuseSearch.search(query)
            return results[0].item.embedMessage
            //Implements fuzzy searching as a backup search algorithm when the Jaro-winkler algorithm doesn't give a result
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