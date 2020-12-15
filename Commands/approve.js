const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfuncions.js")

const capitalizeString = str => {
	return str[0].toUpperCase() + str.substring(1)
}
module.exports = {
	name: 'approve',
	description: 'Approves a suggestion.',
	execute(message, args) {
		if (args.length == 0 || args[1] == undefined || args[2] == undefined) return message.channel.send("Please use the right format. `g!approve <Suggestion ID> <Category-Name> <Section-Name>`")
		//Weeds out all bad commands

		var messageID = args[0] 
		var categoryTitle = globalFunctions.translateCategoryName(args[1]) 
		var sectionTitle = globalFunctions.translateCategoryName(args[2])
		if (args.length >= 4) return message.channel.send("I received more parameters (>3) than I can work with. If there are more than 2 words in the Category or Section name, please replace the space with a hyphen (-), but keep the Capitalization. It's CaSe SeNsItIvE")

		dbClient.connect( async(err) => {
			let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
			let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
			let suggestion = await suggestionDB.find({"messageID": messageID}).toArray()

			if (suggestion.length == 0) return message.channel.send("The given message ID was copied wrong. Please use the right format. `g!approve  <Suggestion ID> <Section Name>`")
			if (suggestion[0].status === "Approved") return message.channel.send("The suggestion was already approved!")

			let categoryMsg = await guidesDB.find({"categoryTitle": categoryTitle}).toArray()
			let embedMessage = categoryMsg[0].embedMessage
			if (categoryMsg[0] == undefined) return message.channel.send("The Category Title that was given was incorrect. Remember to separate Category titles with more than 2 words with hyphens. It is CaSe SeNsItIvE.")
			
			var foundSection = false
			embedMessage.fields.map(val => {
				val.name === sectionTitle ? (val.value === "_ _" ? val.value = suggestion[0].description + "\n\u200b": val.value += "\n\u200b" + suggestion[0].description + "\n\u200b", foundSection = true): undefined
			})
			if (foundSection == false) return message.channel.send("The section that was given was incorrect. Remember to separate Section titles with more than 2 words with hyphens. It is CaSe SeNsItIvE.")

			if (suggestion[0].section != categoryMsg[0].category || capitalizeString(suggestion[0].section) != categoryMsg[0].category) return message.channel.send("The suggestion that you have tried to approve does not match with the category's guide. Make sure that Skyblock Suggestions are approved for the Skyblock Guide and that Dungeon Suggestions are approved for the Dungeons Guide")

			embedMessage.timestamp = new Date()

			let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
			suggestionChannel.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
				  msg.first().edit("This suggestion has been approved!");
				})

			var guideMessage = ""
			if (categoryMsg[0].category === "Skyblock") {
				guideMessage = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
			} else if (categoryMsg[0].category === "Dungeons") {
				guideMessage = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
			}
			
			guideMessage.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
				  msg.first().delete();
				})
			var newMsgId = ""
			guideMessage.send({embed: embedMessage}).then(msg => {
				newMsgId = msg.id
			})
			suggestionDB.updateOne({"messageID": messageID}, {$set: {"section": suggestion[0].section, "messageID": messageID, "description": suggestion[0].description, "user": suggestion[0].user, "status": "Approved"}})
			guidesDB.updateOne({"categoryTitle": categoryTitle}, {$set: {"embedMessage": embedMessage, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": newMsgId, "category": categoryMsg[0].category}})
			message.channel.send("That suggestion has been approved!")
		})
	},
}