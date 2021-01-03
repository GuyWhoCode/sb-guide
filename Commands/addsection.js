const {dbClient} = require("../mongodb.js")
const globalFunction = require("../globalfunctions.js")
const entrySchema = {
    "name": "_ _",
    "value": "_ _"
}

module.exports = {
    name: "addsection",
    alises: ["as", "Addsection", "Adds", "AddSection", "As"],
    execute(message, args) {
        let sectionName = args.slice(1, args.length).join(" ").trim()
        if (args.length == 0 || args[0] == undefined || sectionName.length == 0) return message.channel.send("See `g!addsection <Category-Name> <Section Name>`")
        //checks if there is any bad input
        var categoryName = globalFunction.translateCategoryName(args[0])

		dbClient.connect(async (err) => {
			let guideCollection = dbClient.db("skyblockGuide").collection("Guides")
            let categoryMsg = await guideCollection.find({"categoryTitle": { $regex: new RegExp(categoryName, "i") } }).toArray()
            console.log(categoryMsg[0])
            if (categoryMsg[0] == undefined) return message.channel.send("The Category Name provided did not match anything. Did you make sure to include hyphens?")
            //If the provided category does not exist in the database, give the user an error saying so.

            let msgEmbed = categoryMsg[0].embedMessage
            msgEmbed.timestamp = new Date()

            // include edge case here to remove default value
            var newEntry = Object.create(entrySchema)
            newEntry.name = sectionName
            msgEmbed.fields.push(newEntry)
            
            delete msgEmbed.description

            // let channelName = categoryMsg[0].category
            // guideCollection.updateOne({"categoryTitle": { $regex: new RegExp(categoryName, "i") }}, {$set: {"category": channelName, "messageID": categoryMsg[0].messageID, "categoryTitle": categoryMsg[0].categoryTitle, "embedMessage": msgEmbed}})
            
            // var guideChannel = ""
            // channelName === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
            // guideChannel.messages.fetch({around: categoryMsg[0].messageID, limit: 1})
			// .then(msg => {
			// 	msg.first().edit({embed: msgEmbed})
            // })
            
            message.channel.send("Your section has been added!")
		})
        
    }
}