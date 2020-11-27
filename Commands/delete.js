const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true })
//Deletes, doubles as a bulk delete command for staff members.
module.exports = {
	name: 'delete',
	description: 'Deletes a suggestion or a section from the guide.',
	execute(message, args) {
		if (args.length == 0) return message.channel.send("You need to input a Message ID! See `g!delete <Message ID>`")
		if (message.member.roles.cache.find(role => role.name == "Discord Staff") == false && message.member.roles.cache.find(role => role.name == "Discord Management") == false) return message.channel.send("You have been locked from suggesting anything.")
		let messageID = args[0]
		let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
		
		suggestionChannel.messages.fetch({around: messageID, limit: 1})
			.then(msg => {
			  msg.first().delete()
			  message.channel.send("Suggestion found and deleted.")
			})
		
		dbClient.connect(async(err) => {
			let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
			await suggestionDB.deleteOne({"messageID": messageID})
		})
		
		message.channel.send('Delete command!!')
	},

}