// Parameters: (MESSAGE ID, guide Name (SB / Dungeons), Category name)
const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true })

module.exports = {
	name: 'approve',
	description: 'Approves a suggestion.',
	execute(message, args) {
		// if (args.length != 1) return message.channel.send("Please use the right format. `g!approve [category] [suggestion ID] [Category Name]`")
		//Weeds out all bad commands

		// var category = args[0]
		var messageID = args[0] 
		// var sectionTitle = args[2] 		
		// if (category != "sb" && category != "d") return message.channel.send("You did not specify the right category. Please use the right format. `g!approve [category] [suggestion ID] [Category Name]`")
		
		// if (messageID.length != 18) 
		// let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
		// suggestionChannel.messages.fetch({around: messageID, limit: 1})
		// 	.then(msg => {
		// 	  msg.first().edit("This fetched message was edited");
		// 	})

		// if () return message.channel.send("The given message ID was copied wrong. Please use the right format. `g!approve [category] [suggestion ID] [Category Name]`")
		dbClient.connect( async(err) => {
			let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
			let suggestion = await suggestionDB.find({"messageID": messageID}).toArray()

			if (suggestion.length == 0) return message.channel.send("The given message ID was copied wrong. Please use the right format. `g!approve [category] [suggestion ID] [Category Name]`")

			message.channel.send("This is what I got back from my database! Suggestion: " + suggestion[0].description)
			message.channel.send("Message ID: " + messageID + " and type of it: " + typeof(messageID))
		})

		message.channel.send('Approve command!')
	},
}