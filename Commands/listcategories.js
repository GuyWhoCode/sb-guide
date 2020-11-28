const { CategoryChannel } = require('discord.js');

const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true })


const sbAlias = ["sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock']
const dAlias = ["d", "dungeons", "dung", "Dungeons", "D", "dungeon", "Dungeon", "Dung"]

const checkAliases = (para, input) => {
    let returnVal = false
    para.map(val => val == input).filter(val => val == true)[0] ? (returnVal = true) : (returnVal = false)
    return returnVal
}

//Fetches values from database and lists it to users.
module.exports = {
	name: 'listcategories',
	description: 'Lists categories',
	execute(message, args) {
		if (args.length == 0) return message.channel.send('You did not specify a section! See `g!listcategories <Section>`')
		
		var section = args[0]
		if (checkAliases(sbAlias, section) == false && checkAliases(dAlias, section) == false) return message.channel.send('You are missing an argument! See `g!listcategories <Section>`')
		
		if (checkAliases(sbAlias, section)) section = "Skyblock"
		if (checkAliases(dAlias, section)) section = "Dungeons"

		dbClient.connect(async (err) => {
			let categoryCollection = dbClient.db("skyblockGuide").collection(section)
			let categoryList = await categoryCollection.find({"identifier": section}).toArray()
			var categoryMsg = ""
			categoryList[0].categoryList.map(val => categoryMsg += "`" + val + "`" + "\n")
			message.channel.send("List of categories:\n" + categoryMsg)
		})
		// message.channel.send('Lists categories command!')
	},
}