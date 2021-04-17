const {dbClient} = require("../mongodb.js")
const {sbAlias, dAlias} = require("../constants.js")
const globalFunctions = require("../globalfunctions.js")
const aliasList = ["lc", "list", "listc", "listcategory"]

module.exports = {
	name: 'listcategories',
	alises: aliasList,
	async execute(message, args) {
		var listEmbed = {
			color: 0x4ea8de,
			title: 'Placeholder',
			fields: [{
				name: "_ _",
				value: "_ _"
			}],
			footer: {
				text: 'Skyblock Guides',
				icon_url: "https://i.imgur.com/184jyne.png",
			},
		}
		var guide = args[0]
		var categoryID = ""
		if (args.length == 0 || guide == undefined) return message.channel.send({embed: globalFunctions.commandHelpEmbed("List Categories", aliasList, Date.now(), "g!lc sb", "Returns all the category names for Skyblock Guides")})
		//checks if there is any bad input
		
		if (globalFunctions.checkAliases(sbAlias, guide) == false && globalFunctions.checkAliases(dAlias, guide) == false) return message.channel.send('You are missing an argument! See `g!listcategories <#Guide Channel>`')
		//checks if provided Guide matches alias list

		if (globalFunctions.checkAliases(sbAlias, guide)) {
			guide = "Skyblock"
			categoryID = "772942075301068820"
		} else if (globalFunctions.checkAliases(dAlias, guide)) {
			guide = "Dungeons"
			categoryID = "772944394542121031"
		}
		
		let categoryCollection = dbClient.db("skyblockGuide").collection("Guides")
		var categoryList = await categoryCollection.find({"category": guide}).toArray()
		
		categoryList.map(val => listEmbed.fields.push({name: val.categoryTitle, value: globalFunctions.makeMsgLink(val.messageID, categoryID, message.guild.id)}))
		listEmbed.timestamp = new Date()
		listEmbed.title = "List of categories for " + guide
		
		message.channel.send({embed: listEmbed})
	},
}