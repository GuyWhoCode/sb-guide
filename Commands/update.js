const {dbClient} = require("../mongodb.js")

const entrySchema = {
    "name": "_ _",
    "value": "_ _"
}
module.exports = {
    name: "update",
    description: "The latest and greatest for updates coming out!",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("You need to input something! See `g!update <Update Tip>`")
        
        let updateSuggestion = args.join(" ").trim()


        dbClient.connect(async (err) => {
            let updateDB = dbClient.db("skyblockGuide").collection("Update Tips")
            let findUpdateMsg = await updateDB.find({"identifier": "Update Tips"}).toArray()

            var updateMsg = findUpdateMsg[0].msgObject
            let msgId = findUpdateMsg[0].currentMsgId

            if (updateMsg.fields[0].value = "_ _") {
                updateMsg.fields[0].value = updateSuggestion
                delete updateMsg.description 
            } else {
                let entry = Object.create(entrySchema)
                entry.value = updateSuggestion
                updateMsg.fields.push(entry)
            }

            let updateChannel = message.guild.channels.cache.find(ch => ch.name === "update-tips")
		    updateChannel.messages.fetch({around: msgId, limit: 1})
			.then(msg => {
			  msg.first().edit({embed: updateMsg})
            })
            await updateDB.updateOne({"identifier": "Update Tips"}, {$set: {"currentMsgId": msgId, "identifier": "Update Tips", "msgObject": updateMsg}})
        })
		
        message.channel.send("Your update tip has been created! Check it out at <#779467383604772874>")
    }
}