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
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guide = await guidesDB.find({}).toArray()
        let fuseSearch = new Fuse(guide, options)
        
        const parseQuery = query => {
            possibleQueries = {}
            guide.map(val => {
                if (distance(query, val.categoryTitle, {caseSensitive: false}) > 0.70 || val.categoryTitle == query) {
                    possibleQueries[val.categoryTitle] = distance(query, val.categoryTitle, {caseSensitive: false})
                    possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
                }
                //Exact case matching: If the entire query closely matches the category title, priorityize it first.
                else {

                    let closeness = val.categoryTitle
                        .split(" ")
                        .map(word => distance(query, word, {caseSensitive: false}))
                        .reduce((prev, current) => prev + current)/(val.categoryTitle.split(" ").length)
                    
                    if (closeness > threshold) {
                        possibleQueries[val.categoryTitle] = closeness
                        possibleQueries[val.categoryTitle + " embed"] = val.embedMessage
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
                return possibleQueries[bestResult + " embed"]
            }
            //Sorts out the results by picking the highest rated one and returns the corresponding guide embed message
            
            let results = fuseSearch.search(query)
            return results[0].item.embedMessage
            //Implements fuzzy searching as a backup search algorithm when the Jaro-winkler algorithm doesn't give a result
        }

        let guideMessage = parseQuery(searchQuery)
        
        guideMessage.timestamp = new Date()
        message.channel.send({embed: guideMessage}).catch(err => {
            message.channel.send("Oops! Something went wrong. Error Message: " + err)
        })
	}
}