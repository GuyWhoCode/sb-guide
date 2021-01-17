const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")

module.exports = {
    name: "search",
    async execute(message, args) {
        if (args.length == 0 || args[0] == undefined) return message.channel.send("See `g!search <Category Name>`")
        //checks if there is any bad input
        var categoryName = new RegExp(globalFunctions.translateCategoryName(args[0]), "i") 
        let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
        let guide = await guidesDB.find( { "categoryTitle": { $regex: categoryName } }).toArray()
        
        if (guide[0] == undefined || guide.length > 1) return message.channel.send("The Category Title that was given was incorrect.")
        //returns an error if the Category Title did not match anything in the database
        
        let guideMessage = guide[0].embedMessage
        guideMessage.timestamp = new Date()
        message.channel.send({embed: guideMessage}).catch(err => {
            message.channel.send("Oops! Something went wrong. Error Message: " + err)
        })
	}
}