// Parameters: (MESSAGE ID, guide Name (SB / Dungeons), Category name)
// const mongoClient = require('mongodb').MongoClient
// const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
// const dbClient = new mongoClient(uri, { useNewUrlParser: true })

module.exports = {
	name: 'approve',
	description: 'Approves a suggestion.',
	execute(message, args) {
		message.channel.send('Approve command!')
		// message.channel.messages.fetch({around: "352292052538753025", limit: 1})
		// .then(messages => {
		//   messages.first().edit("This fetched message was edited");
		// });
	},
}