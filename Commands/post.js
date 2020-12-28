const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfuncions.js")

module.exports = {
    name: "post",
    alises: ['p'],
    execute(message, args) {
        if (args.length == 0 || args[0] == undefined) return message.channel.send("See `g!post <Category-Name>`")
        //checks if there is any bad input
        var categoryName = "/" + globalFunctions.translateCategoryName(args[0]) + "/gi"

        message.channel.send("Regex expression: " + categoryName)
        dbClient.connect(async (err) => {
            let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
            let guide = await guidesDB.find( { "categoryTitle": { $regex: categoryName } }).toArray()
           
            let guideMessage = guide[0].embedMessage
            // guideMessage.timestamp = new Date()
            message.channel.send({embed: guideMessage})
            // var guideChannel = ""
            // guide[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
			
            // guideChannel.send({embed: guideMessage}).then(msg => {
			// 	newMsgId = msg.id
			// 	guidesDB.updateOne({"categoryTitle": categoryName}, {$set: {"embedMessage": guideMessage, "categoryTitle": guide[0].categoryTitle, "messageID": newMsgId, "category": guide[0].category}})
			// })
            
            // message.channel.send("Category posted.")
        })
    }
}