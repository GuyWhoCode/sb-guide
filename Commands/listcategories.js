const {dbClient} = require("../mongodb.js")
const {sbAlias, dAlias} = require("../constants.js")
const globalFunctions = require("../globalfuncions.js")

module.exports = {
	name: 'listcategories',
	alises: ["lc", "list", "listc", "listC", "Listcategories", "listcategory", "Listcategory"],
	execute(message, args) {
		var guide = args[0]
		if (args.length == 0 || guide == undefined) return message.channel.send('See `g!listcategories <Section>`')
		//checks if there is any bad input
		
		if (globalFunctions.checkAliases(sbAlias, guide) == false && globalFunctions.checkAliases(dAlias, guide) == false) return message.channel.send('You are missing an argument! See `g!listcategories <Guide>`')
		//checks if provided Guide matches alias list

		if (globalFunctions.checkAliases(sbAlias, guide)) guide = "Skyblock"
		if (globalFunctions.checkAliases(dAlias, guide)) guide = "Dungeons"

		dbClient.connect(async (err) => {
			let categoryCollection = dbClient.db("skyblockGuide").collection("Guides")
			var categoryList = await categoryCollection.find({"category": guide}).toArray()
			var categoryMsg = ""

			categoryList.map(val => categoryMsg += "`" + val.categoryTitle + "`" + "\n")
			message.channel.send("List of categories for " + guide + ":\n" + categoryMsg)
		})
	},
}