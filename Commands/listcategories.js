const {dbClient} = require("../mongodb.js")
const {sbAlias, dAlias} = require("../constants.js")
const globalFunctions = require("../globalfunctions.js")

module.exports = {
	name: 'listcategories',
	alises: ["lc", "list", "listc", "listC", "Listcategories", "listcategory", "Listcategory"],
	execute(message, args) {
		var listEmbed = {
			color: 0x4ea8de,
			title: 'My sad embed',
			fields: [{
				name: "_ _",
				value: "_ _"
			}],
			footer: {
				text: 'Skycomm Guide Bot',
				icon_url: "https://i.imgur.com/184jyne.png",
			},
		}
		var guide = args[0]
		var categoryID = ""
		if (args.length == 0 || guide == undefined) return message.channel.send('See `g!listcategories <#Guide Channel>`')
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

		const makeMsgLink = msgID => {
			return "https://discord.com/channels/587765474297905158/" + categoryID + "/" + msgID
		}

		let categoryCollection = dbClient.db("skyblockGuide").collection("Guides")
		var categoryList = await categoryCollection.find({"category": guide}).toArray()
		
		categoryList.map(val => listEmbed.fields.push({name: val.categoryTitle, value: "[Jump](" + makeMsgLink(val.messageID) + ")"}))
		listEmbed.timestamp = new Date()
		listEmbed.title = "List of categories for " + guide
		
		message.channel.send({embed: listEmbed})
	},
}