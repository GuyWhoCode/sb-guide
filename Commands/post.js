const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfuncions.js")

module.exports = {
    name: "post",
    alises: ['p'],
    execute(message, args) {
        var categoryName = globalFunctions.translateCategoryName(args[0])
        dbClient.connect(async (err) => {
            let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
            let guide = await guidesDB.find({"categoryTitle": categoryName}).toArray()
            
            let guideMessage = guide[0].embedMessage
            guideMessage.timestamp = new Date()

            var guideChannel = ""
            if (guide[0].category === "Skyblock") {
				guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
			} else if (guide[0].category === "Dungeons") {
				guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
			}
            
            guideChannel.send({embed: guideMessage}).then(msg => {
				newMsgId = msg.id
				guidesDB.updateOne({"categoryTitle": categoryName}, {$set: {"embedMessage": guideMessage, "categoryTitle": guide[0].categoryTitle, "messageID": newMsgId, "category": guide[0].category}})
			})
            
            message.channel.send("Category posted.")
        })
    }
}