const {dbClient} = require("../mongodb.js")

const entrySchema = {
    "name": "_ _",
    "value": "_ _"
}
module.exports = {
    name: "addsection",
    description: "Adds a section to either a Skyblock Guide or a Dungeons Guide",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("`g!addsection <Guide Message ID> <Section Name>`")
        
        let msgId = args[0]
        if (msgId.length == 0) return message.channel.send("You need to input a Message ID from the Skyblock/Dungeons Guide! See `g!addsection <Guide Message ID> <Section Name>`")
        
        let sectionName = args.slice(1, args.length).join(" ").trim()
        if (sectionName.length == 0) return message.channel.send("You need to input a Section Name! See `g!addsection <Guide Message ID> <Section Name>`")
        

		dbClient.connect(async (err) => {
			let guideCollection = dbClient.db("skyblockGuide").collection("Guides")
			let categoryMsg = await guideCollection.find({"messageID": msgId}).toArray()
            let msgEmbed = categoryMsg[0].embedMessage
            
            var newEntry = Object.create(entrySchema)
            newEntry.name = sectionName
            msgEmbed.fields.push(newEntry)
            
            msgEmbed.fields.push(entrySchema)
            delete msgEmbed.description

            let channelName = categoryMsg[0].category
            
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