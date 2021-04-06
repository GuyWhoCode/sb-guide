const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")

module.exports = {
    name: "search",
    async execute(message, args) {
        if (args.length == 0) return message.channel.send("See `g!search <Category Name>`")
        let searchQuery = globalFunctions.escapeRegex(args.join(" ").trim())
        //checks if there is any bad input
        // var categoryName = new RegExp(searchQuery, "i") 
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        // let guide = await guidesDB.find( { "categoryTitle": { $regex: categoryName } }).toArray()
        let guide = await guidesDB.find({}).toArray()
        console.log(guide)
        // if (guide[0] == undefined || guide.length > 1) return message.channel.send("The Category Title that was given was incorrect.")
        //returns an error if the Category Title did not match anything in the database
        
        // let guideMessage = guide[0].embedMessage
        // guideMessage.timestamp = new Date()
        // message.channel.send({embed: guideMessage}).catch(err => {
        //     message.channel.send("Oops! Something went wrong. Error Message: " + err)
        // })
	}
}

// https://fusejs.io/
// https://www.npmjs.com/package/jaro-winkler
// Command to run test file for this is: node ./Commands/search.js
// const fuse = require('fuse.js')
// const distance = require('jaro-winkler')

// the distance from jaro-winkler should be first algo to use. fuse is backup algo.
// might need to pull from entire db? need to read into that