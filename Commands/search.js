const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfuncions.js")

module.exports = {
    name: "search",
    execute(message, args) {
        if (args.length == 0 || args[0] == undefined) return message.channel.send("See `g!search <Category-Name>`")
        //checks if there is any bad input
        var categoryName = new RegExp(globalFunctions.translateCategoryName(args[0]), "i") 
        dbClient.connect(async (err) => {
            let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
            let guide = await guidesDB.find( { "categoryTitle": { $regex: categoryName } }).toArray()
           
            let guideMessage = guide[0].embedMessage
            guideMessage.timestamp = new Date()
			message.channel.send({embed: guideMessage})
		})
	}
}