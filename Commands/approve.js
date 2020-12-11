const {dbClient} = require("../mongodb.js")

const sbAlias = ["sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock']
const dAlias = ["d", "dungeons", "dung", "Dungeons", "D", "dungeon", "Dungeon", "Dung"]

const checkAliases = (para, input) => {
    let returnVal = false
    para.map(val => val == input).filter(val => val == true)[0] ? (returnVal = true) : (returnVal = false)
    return returnVal
}

const translateCategoryName = name => {
    if (name.includes("-")) {
        return name.split("-").join(" ")
    } else if (name.includes("_")) {
        return name.split("_").join(" ")
    } else {
        return name
    }
}

module.exports = {
	name: 'approve',
	description: 'Approves a suggestion.',
	execute(message, args) {
		if (args.length == 0) return message.channel.send("Please use the right format. `g!approve <Suggestion ID> <Category-Name> <Section-Name>`")
		//Weeds out all bad commands

		var messageID = args[0] 
		var categoryTitle = translateCategoryName(args[1]) 
		var sectionTitle = translateCategoryName(args[2])
		if (args.length >= 4) return message.channel.send("I received more parameters (>3) than I can work with. If there are more than 2 words in the Category or Section name, please replace the space with a hyphen (-), but keep the Capitalization. It's CaSe SeNsItIvE")

		dbClient.connect( async(err) => {
			let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
			let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
			let suggestion = await suggestionDB.find({"messageID": messageID}).toArray()

			if (suggestion.length == 0) return message.channel.send("The given message ID was copied wrong. Please use the right format. `g!approve  <Suggestion ID> <Section Name>`")
			if (suggestion[0].status === "Approved") return message.channel.send("The suggestion was already approved!")

			let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
			suggestionChannel.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
				  msg.first().edit("This suggestion has been approved!");
				})

			let categoryMsg = await guidesDB.find({"categoryTitle": categoryTitle}).toArray()
			let embedMessage = categoryMsg[0].embedMessage
			
			embedMessage.fields.map(val => {
				val.name === sectionTitle ? (val.value === "_ _" ? val.value = suggestion[0].description + "\n\u200b": val.value += suggestion[0].description + "\n\u200b"): undefined
			})
			
			if (categoryMsg[0].category === "Skyblock") {
				let guideMessage = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
				guideMessage.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
				  msg.first().edit({embed: embedMessage});
				})
			} else if (categoryMsg[0].category === "Dungeons") {
				let guideMessage = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
				guideMessage.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
				  msg.first().edit({embed: embedMessage});
				})
			}

			suggestionDB.updateOne({"messageID": messageID}, {$set: {"section": suggestion[0].section, "messageID": messageID, "description": suggestion[0].description, "user": suggestion[0].user, "status": "Approved"}})
			guidesDB.updateOne({"categoryTitle": categoryTitle}, {$set: {"embedMessage": embedMessage, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": categoryMsg[0].messageID, "category": categoryMsg[0].category}})
			message.channel.send("That suggestion has been approved!")
		})
	},
}