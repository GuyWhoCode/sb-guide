const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")

const capitalizeString = str => {
	return str[0].toUpperCase() + str.substring(1)
}

module.exports = {
	name: 'approve',
	alises: ["a", "Approve"],
	async execute(message, args) {
		if (args.length == 0 || args[1] == undefined || args[2] == undefined) return message.channel.send("See `g!approve <Suggestion ID> <Category-Name> <Section-Name>`")
		//checks if there is any bad input

		var messageID = args[0] 
		var categoryTitle = globalFunctions.translateCategoryName(args[1]) 
		var sectionTitle = globalFunctions.translateCategoryName(args[2])
		if (args.length >= 4) return message.channel.send("I received more parameters (>3) than I can work with. If there are more than 2 words in the Category or Section name, replace the spaces with a hyphen (-).")
		//returns an error if Category name or Section Name is not formatted correctly

		let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
		let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
		let suggestion = suggestionDB.find({"messageID": messageID}).toArray()

		if (suggestion.length == 0) return message.channel.send("The given message ID was copied wrong. Please use the right format. `g!approve  <Suggestion ID> <Section Name>`")
		//returns an error if the provided message ID did not match anything in the database
		if (suggestion[0].status != undefined) return message.channel.send("The suggestion was already approved!")
		//returns an error if the retrieved message from the database was already approved
		let categoryMsg = await guidesDB.find({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") } }).toArray()
		let embedMessage = categoryMsg[0].embedMessage
		
		if (categoryMsg[0] == undefined || categoryMsg.length > 1) return message.channel.send("The Category Title that was given was incorrect. Remember to separate Category titles with more than 2 words with hyphens.")
		//returns an error if the Category Title did not match anything in the database
		var foundSection = false
		var approveMsgIndex = 0 
		embedMessage.fields.map((val, index) => {
			val.name.toLowerCase() === sectionTitle.toLowerCase() ? (val.value === "_ _" ? val.value = suggestion[0].description + "\n\u200b": val.value += "\n\u200b" + suggestion[0].description + "\n\u200b", foundSection = true, approveMsgIndex = index): undefined
		})
		//adds the suggestion message to the existing Guide Message by looping through all the fields for matching Section name and adding new line at the end ("\n\u200b")
		if (foundSection == false) return message.channel.send("The section that was given was incorrect. Remember to separate Section titles with more than 2 words with hyphens.")
		//returns an error if the provided Section Name did not match anything in the Guide message
		if (suggestion[0].section != categoryMsg[0].category || capitalizeString(suggestion[0].section) != categoryMsg[0].category) return message.channel.send("The suggestion that you have tried to approve does not match with the category's guide. Make sure that Skyblock Suggestions are approved for the Skyblock Guide and that Dungeon Suggestions are approved for the Dungeons Guide.")
		//edge case when the suggestion trying to be approved is in the wrong section
		embedMessage.timestamp = new Date()
		if (globalFunctions.embedCharCount(embedMessage) >= 6000) return message.channel.send("Error. Approving the following suggestion exceeds the embed character limit (6000). Use `g!e` to shorten the embed.")
		//edge case when embed exceeds limit
		
		let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
		suggestionChannel.messages.fetch({around: messageID, limit: 1})
		.then(msg => {
		  msg.first().edit("This suggestion has been approved!")
		})
		
		var guideChannel = ""
		categoryMsg[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
		guideChannel.messages.fetch({around: messageID, limit: 1})
		.then(msg => {
			msg.first().edit({embed: embedMessage}).then(me => {message.channel.send("ID: " + me.id)});
		})
		
		guidesDB.updateOne({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") }}, {$set: {"embedMessage": embedMessage, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": messageID, "category": categoryMsg[0].category}})
		
		let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
		logChannel.send({embed: globalFunctions.logAction(message.author.username, message.author.id, 'Approve', embedMessage.fields[approveMsgIndex].value, categoryMsg[0].categoryTitle)})
		
		suggestionDB.updateOne({"messageID": messageID}, {$set: {"section": suggestion[0].section, "messageID": messageID, "description": suggestion[0].description, "user": suggestion[0].user, "status": "Approved"}})
		message.channel.send("That suggestion has been approved!")
	},
}