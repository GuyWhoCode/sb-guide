const {dbClient} = require("../mongodb.js")
const {sbAlias, dAlias} = require("../constants.js")
const globalFunctions = require("../globalfuncions.js")

//Fetches values from database and lists it to users.
module.exports = {
	name: 'listcategories',
	alises: ["lc", "list", "listc", "listC", "Listcategories", "listcategory", "Listcategory"],
	execute(message, args) {
		if (args.length == 0) return message.channel.send('You did not specify a section! See `g!listcategories <Section>`')
		
		var section = args[0]
		if (globalFunctions.checkAliases(sbAlias, section) == false && globalFunctions.checkAliases(dAlias, section) == false) return message.channel.send('You are missing an argument! See `g!listcategories <Section>`')
		
		if (globalFunctions.checkAliases(sbAlias, section)) section = "Skyblock"
		if (globalFunctions.checkAliases(dAlias, section)) section = "Dungeons"

		dbClient.connect(async (err) => {
			let categoryCollection = dbClient.db("skyblockGuide").collection("Guides")
			var categoryList = await categoryCollection.find({"category": section}).toArray()
			var categoryMsg = ""

			categoryList.map(val => categoryMsg += "`" + val.categoryTitle + "`" + "\n")
			message.channel.send("List of categories for " + section + ":\n" + categoryMsg)
		})
	},
}