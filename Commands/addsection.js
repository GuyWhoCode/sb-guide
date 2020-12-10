const {dbClient} = require("../mongodb.js")

const entrySchema = {
    "name": "_ _",
    "value": "_ _"
}

const translateCategoryName = name => {
    if (name.includes("-")) {
        return name.split("-").join(" ")
    } else if (name.includes("_")) {
        return name.split("_").join(" ")
    } else {
        return name
    }
}
module.exports = {
    name: "addsection",
    description: "Adds a section to either a Skyblock Guide or a Dungeons Guide",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("`g!addsection <Category-Name> <Section Name>`")

        var categoryName = translateCategoryName(args[0])
        if (categoryName.length == 0) return message.channel.send("You need to input a Category name from the Skyblock/Dungeons Guide! See `g!addsection <Category-Name> <Section Name>`")

        let sectionName = args.slice(1, args.length).join(" ").trim()
        if (sectionName.length == 0) return message.channel.send("You need to input a Section Name! See `g!addsection <Category-Name> <Section Name>`")
        

		dbClient.connect(async (err) => {
			let guideCollection = dbClient.db("skyblockGuide").collection("Guides")
            let categoryMsg = await guideCollection.find({"categoryTitle": categoryName}).toArray()
            if (categoryMsg[0] == undefined) return message.channel.send("The Category Name provided did not match anything. Did you make sure to include hyphens? It's CaSe SeNsItIvE.")

            let msgEmbed = categoryMsg[0].embedMessage
            
            var newEntry = Object.create(entrySchema)
            newEntry.name = sectionName
            msgEmbed.fields.push(newEntry)
            
            msgEmbed.fields.push(entrySchema)
            delete msgEmbed.description

            let channelName = categoryMsg[0].category
            guideCollection.updateOne({"categoryTitle": categoryName}, {$set: {"category": channelName, "messageID": categoryMsg[0].messageID, "categoryTitle": categoryName, "embedMessage": msgEmbed}})

            if (channelName === "Skyblock") {
                let sbGuide = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
                sbGuide.messages.fetch({around: categoryMsg[0].messageID, limit: 1})
				.then(msg => {
					msg.first().edit({embed: msgEmbed})
                })
            } else {
                let dGuide = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
                dGuide.messages.fetch({around: categoryMsg[0].messageID, limit: 1})
				.then(msg => {
					msg.first().edit({embed: msgEmbed})
				})
            }

		})
        message.channel.send("Your section has been added!")
    }
}