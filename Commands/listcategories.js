const { CategoryChannel } = require('discord.js');
const {dbClient} = require("../mongodb.js")


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
			let categoryCollection = dbClient.db("skyblockGuide").collection("Guides")
			var categoryList = await categoryCollection.find({"category": section}).toArray()
			var categoryMsg = ""

			categoryList.map(val => categoryMsg += "`" + val.categoryTitle + "`" + "\n")
			message.channel.send("List of categories for " + section + ":\n" + categoryMsg)
		})
	},
}