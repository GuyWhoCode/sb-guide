const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true })

//Fetches values from database and lists it to users.
module.exports = {
	name: 'listcategories',
	description: 'Lists categories',
	execute(message, args) {
		message.channel.send('Lists categories command!')
	},
}