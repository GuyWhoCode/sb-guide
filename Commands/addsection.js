const {dbClient} = require("../mongodb.js")


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
			let categoryCollection = dbClient.db("skyblockGuide").collection(category)
			let categoryMsg = await categoryCollection.find({"messageID": msgId}).toArray()
            var msgEmbed = categoryMsg[0].embedMessage
            // msgEmbed

		})
        message.channel.send("Your section has been added!")
    }
}