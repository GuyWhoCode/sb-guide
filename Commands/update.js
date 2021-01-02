const {dbClient} = require("../mongodb.js")

const entrySchema = {
    "name": "_ _",
    "value": "_ _"
}
module.exports = {
    name: "update",
    alises: ['u', 'Update'],
    execute(message, args) {
        return message.channel.send("This commmand has bee deplicated for the time being.")
        if (args.length == 0) return message.channel.send("You need to input something! See `g!update <Update Tip>`")
        
        let updateSuggestion = args.join(" ").trim()

        dbClient.connect(async (err) => {
            let updateDB = dbClient.db("skyblockGuide").collection("Update Tips")
            let findUpdateMsg = await updateDB.find({"identifier": "Update Tips"}).toArray()

            var updateMsg = findUpdateMsg[0].msgObject
            let msgId = findUpdateMsg[0].currentMsgId

            updateMsg.timestamp = new Date()
            
            if (updateMsg.description != undefined) {
                updateMsg.fields[0].value = updateSuggestion
                delete updateMsg.description 
            } 
            // else if (updateMsg.fields.length >= 24){
                //create a new update embed and add it to db
            // }
            else {
                let entry = Object.create(entrySchema)
                entry.value = updateSuggestion
                updateMsg.fields.push(entry)
            }
            await updateDB.updateOne({"identifier": "Update Tips"}, {$set: {"currentMsgId": msgId, "identifier": "Update Tips", "msgObject": updateMsg}})
            await updateDB.updateOne({"messageID": msgId}, {$set: {"messageID": msgId, "categoryTitle": updateMsg.title, "embedMessage": updateMsg}})

            let updateChannel = message.guild.channels.cache.find(ch => ch.name === "update-tips")
		    updateChannel.messages.fetch({around: msgId, limit: 1})
			.then(msg => {
			  msg.first().edit({embed: updateMsg})
            })

        })
		
        message.channel.send("Your update tip has been created! Check it out at <#779467383604772874>")
    }
}