const {dbClient} = require("../mongodb.js")
const globalFunction = require("../globalfunctions.js")
const yesAlias = ["yes", "Yes", "YES", "y", 'Y']
const noAlias = ["no", "NO", "No", "n", "N"]
const cancelAlias = ["cancel", "Cancel", "CANCEL", "c", "C"]

module.exports = {
	name: 'edit',
	alises: ["e", "E", "Edit"],
	execute(message, args) {
		if (args.length == 0 || args[0] == undefined || args[1] == undefined) return message.channel.send("See `g!edit <Category-Name> <Section-Name>`")
		//checks if there is any bad input

		if (args.length >= 3) return message.channel.send("I received more parameters (>2) than I can work with. If there are more than 2 words in the Category or Section name, please replace the space with a hyphen (-).")
		//checks if formatting on Category Title or Section Title is wrong
		var categoryTitle = globalFunction.translateCategoryName(args[0]) 
		var sectionTitle = globalFunction.translateCategoryName(args[1])
		
		dbClient.connect( async(err) => {
			let guidesDB = dbClient.db("skyblockGuide").collection("Guides")

			let categoryMsg = await guidesDB.find({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") } }).toArray()
			if (categoryMsg[0] == undefined) return message.channel.send("The Category Title that was given was incorrect. Remember to separate Category titles with more than 2 words with hyphens.")
			//returns an error if the Category Title did not match anything in the database
			let embedMessage = categoryMsg[0].embedMessage
			var foundSection = false
			var oldMessage = ""
			var oldMsgID = 0

			embedMessage.fields.map((val, index) => {
				val.name.toLowerCase() === sectionTitle.toLowerCase() ? (oldMessage = val.value, foundSection = true, oldMsgID = index) : undefined
			})
			//Loops through all the fields for matching Section name and recording original message
			if (foundSection == false) return message.channel.send("The section that was given was incorrect. Remember to separate Section titles with more than 2 words with hyphens.")
			//returns an error if the provided Section Name did not match anything in the Guide message
			
			message.channel.send("Post the edited version below. This message will expire in 20 seconds. If you want to quit/cancel, type in `no` or `cancel`.\nHere is the original message as a reference: " + "```" + oldMessage + "```")
			
			const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
			const collector = message.channel.createMessageCollector(filter, {time: 20000})
			var received = false
			var newMsg = ""
			//awaits new message for edit
			collector.on('collect', msg => {
				if (received && globalFunction.checkAliases(yesAlias, msg.content.trim())) {
					//second collector for Confirmation. Edits the message.
					collector.stop()

					embedMessage.fields[oldMsgID].value = newMsg + "\n\u200b"
					var guideChannel = ""
					categoryMsg[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
			
					embedMessage.timestamp = new Date()
		    		guideChannel.messages.fetch({around: categoryMsg[0].messageID, limit: 1}).then(m => {
						m.first().edit({embed: embedMessage})
					})
					
					let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
					logChannel.send({embed: globalFunction.logAction(message.author.username, message.author.id, 'Edit', newMsg, categoryMsg[0].categoryTitle)})

					guidesDB.updateOne({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") }}, {$set: {"embedMessage": embedMessage, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": categoryMsg[0].messageID, "category": categoryMsg[0].category}})
					message.channel.send("Message edited.")
					dbClient.close()

				} else if (globalFunction.checkAliases(noAlias, msg.content.trim()) || globalFunction.checkAliases(cancelAlias, msg.content.trim())) {
					//stops Edit process if given no/cancel alias
					collector.stop()
					message.channel.send("Process canceled.")
				
				} else if (received && globalFunction.checkAliases(yesAlias, msg.content.trim()) == false) {
					//returns error if does not match confirmation alises.
					message.channel.send("Invalid response. Please confirm the new message with `yes`. If you want to quit/cancel, type in `no` or `cancel`.")
				
				} else {
					//Triggered when receives first editted message. Prompts for confirmation.
					received = true
					newMsg = msg.content
					if (msg.content.length >= 1024) {
						collector.stop()
						return message.channel.send("Your edited message is over the max character limit (1024). Please shorten the message.")
					} else message.channel.send("Please confirm the new message with `yes`. If you want to quit/cancel, type in `no` or `cancel`. " + "\n`" + newMsg + "`")
				}
					
			})

			collector.on('end', msg => {
				if (received == false) message.channel.send("The message has expired with no output.")
			})
		})

	},
}