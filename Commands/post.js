const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")

module.exports = {
    name: "post",
    alises: ['p'],
    execute(message, args) {
        if (args.length == 0 || args[0] == undefined) return message.channel.send("See `g!post <Category-Name>`")
        //checks if there is any bad input
        var categoryName = globalFunctions.translateCategoryName(args[0])
        dbClient.connect(async (err) => {
            let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
            let guide = await guidesDB.find( { "categoryTitle": { $regex: new RegExp(categoryName, "i") } }).toArray()
           
            if (guide[0] == undefined || guide.length > 1) return message.channel.send("The Category Name provided did not match anything. Did you make sure to include hyphens?")
            //If the provided category does not exist in the database, give the user an error saying so.

            let guideMessage = guide[0].embedMessage
            guideMessage.timestamp = new Date()
            
            var guideChannel = ""
            guide[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
			
            guideChannel.send({embed: guideMessage}).catch(err => {
                message.channel.send("Oops! Something went wrong. Error Message: " + err)
            }).then(msg => {
				newMsgId = msg.id
				guidesDB.updateOne({"categoryTitle": guide[0].categoryTitle}, {$set: {"embedMessage": guideMessage, "categoryTitle": guide[0].categoryTitle, "messageID": newMsgId, "category": guide[0].category}})
			})
            
            message.channel.send("Category posted.")
        })
    }
}