const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const {yesAlias, noAlias, cancelAlias} = require("../constants.js")
const post = require("../post.js")

module.exports = {
	name: 'edit',
	alises: ["e"],
	async execute(client, message, args) {
		var categoryTitle, sectionTitle, categoryMsg, embedMessage, oldMessage, newMsg = ""
		var categoryConfirm, foundSection, sectionConfirm, received = false
		var oldMsgID = 0
		let guidesDB = dbClient.db("skyblockGuide").collection("Guides")

		if (args.length == 0) {
			const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
			const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("5m")})	

			message.channel.send("To cancel the Argument helper, type in `no` or `cancel`. Enter the Guide Category (the Bold title at the top of the Guide message) to add a new section.")
			collector.on('collect', async(msg) => {
				
				if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())){
					collector.stop()
					return message.channel.send("Process canceled.")
					//stops process if given no/cancel alias

				} else if (received && globalFunctions.checkAliases(yesAlias, msg.content.trim()) == false) {
					//returns error if does not match confirmation alises.
					return message.channel.send("Invalid response. Please confirm the new message with `yes`. If you want to quit/cancel, type in `no` or `cancel`.")
				
				} else if (received && globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
					// second collector for Confirmation. Edits the message.
					collector.stop()
					
					embedMessage.fields[oldMsgID].value = newMsg + "\n\u200b"
					if (globalFunctions.embedCharCount(categoryMsg[0]) >= 6000) return message.channel.send("Error. Editting the embed exceeds the embed character limit (6000). Shorten down the embed.")
					//edge case when embed exceeds limit

					var guideChannel = ""
					categoryMsg[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
					if (categoryMsg[0].category === "resource") guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-resources")

					embedMessage.timestamp = new Date()
					guideChannel.messages.fetch({around: categoryMsg[0].messageID[message.guild.id], limit: 1}).then(m => {
						if (m.first().id != categoryMsg[0].messageID[message.guild.id])  {
							categoryMsg[0].messageID[message.guild.id] = m.first().id 
							//updates the ID if it does not match in the database
						}
						m.first().edit({embed: embedMessage}).then(me => {message.channel.send("ID: " + me.id)})
						guidesDB.updateOne({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") }}, {$set: {"embedMessage": embedMessage, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": categoryMsg[0].messageID, "category": categoryMsg[0].category}})
						post.post(client, message, "", "Edit", embedMessage)
						// post function
					})

					let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
					logChannel.send({embed: globalFunctions.logAction(message.author.username, message.author.id, 'Edit', newMsg, categoryMsg[0].categoryTitle)})
					return message.channel.send("Message edited.")
				
				} else if (categoryConfirm && sectionConfirm && !received) {
					newMsg = msg.content
					if (msg.content.length >= 1024) {
						collector.stop()
						return message.channel.send("Your edited message is over the max character limit (1024). Please shorten the message.")
					} else  {
						received = true
						return message.channel.send("Please confirm the new message with `yes`. If you want to quit/cancel, type in `no` or `cancel`. " + "\n`" + newMsg + "`")
					}
					
				} else if (categoryConfirm && !sectionConfirm) {
					sectionTitle = globalFunctions.translateCategoryName(msg.content.trim())
					embedMessage = categoryMsg[0].embedMessage
					oldMessage = ""
					
					embedMessage.fields.map((val, index) => {
						val.name.toLowerCase() === sectionTitle.toLowerCase() ? (oldMessage = val.value, foundSection = true, oldMsgID = index) : undefined
					})
					//Loops through all the fields for matching Section name and recording original message
					if (!foundSection) return message.channel.send("The section that was given was incorrect. Remember to separate Section titles with more than 2 words with hyphens.")
					//returns an error if the provided Section Name did not match anything in the Guide message

					sectionConfirm = true
					return message.channel.send("Post the edited version below. This message will expire in 5 minutes. If you want to quit/cancel, type in `no` or `cancel`.\nHere is the original message as a reference:```" + oldMessage + "```")					
					//Since Discord.js does not like exitting out of the Message collector after ending it, the same code from lines 92-146 is merged due to requiring a Message collector as well.

				} else if (!categoryConfirm) {

					categoryMsg = await guidesDB.find({"categoryTitle": { $regex: new RegExp(globalFunctions.translateCategoryName(msg.content.trim()), "i") } }).toArray()
        			if (categoryMsg[0] == undefined) return message.channel.send("The Category Name provided did not match anything, please enter another one.")

					if (categoryMsg[0].embedMessage.fields.length == 0) {
						collector.stop()
						return message.channel.send("There is no section to edit. Add a section with `g!as`")
					}
					//Edge case when there is no section to choose from

					categoryConfirm = true
					categoryTitle = msg.content.trim()

					var sectionList = ""
					categoryMsg[0].embedMessage.fields.map(val => {
						if (val.name != "_ _") {
							sectionList += val.name + "\n"
						}
					})
					return message.channel.send("Enter the name of the Guide Section to edit. All of the sections are provided below:\n" + "```" + sectionList +"```")
					//if a valid alias of the guide channel is given, run this portion of the code
				} 
			})
			
			if (!categoryConfirm) return undefined
		} 
		//**Enable the Argument helper: Prompts the user for each argument of the command to make it more user-friendly
		//Exits out of the code to prevent the code below the argument parsing from returning an error


		else {
			if (args[0] == undefined || args[1] == undefined) return message.channel.send("See `g!edit <Category-Name> <Section-Name>`")
			//checks if there is any bad input
			if (args.length >= 3) return message.channel.send("I received more parameters (>2) than I can work with. If there are more than 2 words in the Category or Section name, please replace the space with a hyphen (-).")
			//checks if formatting on Category Title or Section Title is wrong
			
			categoryTitle = globalFunctions.translateCategoryName(args[0]) 
			sectionTitle = globalFunctions.translateCategoryName(args[1])
			categoryMsg = await guidesDB.find({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") } }).toArray()
			if (categoryMsg[0] == undefined) return message.channel.send("The Category Title that was given was incorrect. Remember to separate Category titles with more than 2 words with hyphens.")
			//returns an error if the Category Title did not match anything in the database
			
			embedMessage = categoryMsg[0].embedMessage
			foundSection = false
			oldMessage = ""
	
			if (embedMessage.fields.length == 0) return message.channel.send("There is no section to edit. Add a section with `g!as`")
			//Edge case when there is no section to choose from

			embedMessage.fields.map((val, index) => {
				val.name.toLowerCase() === sectionTitle.toLowerCase() ? (oldMessage = val.value, foundSection = true, oldMsgID = index) : undefined
			})
			//Loops through all the fields for matching Section name and recording original message
			if (!foundSection) return message.channel.send("The section that was given was incorrect. Remember to separate Section titles with more than 2 words with hyphens.")
			//returns an error if the provided Section Name did not match anything in the Guide message
		}
        //**Default command.** Format: g!as <Category-Name> <Section-Name>

		
		
		message.channel.send("Post the edited version below. This message will expire in 5 minutes. If you want to quit/cancel, type in `no` or `cancel`.\nHere is the original message as a reference: " + "```" + oldMessage + "```")
		
		const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
		const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("5m")})
		//awaits new message for edit
		collector.on('collect', msg => {
			if (received && globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
				// second collector for Confirmation. Edits the message.
				collector.stop()
				
				embedMessage.fields[oldMsgID].value = newMsg + "\n\u200b"
				if (globalFunctions.embedCharCount(categoryMsg[0]) >= 6000) return message.channel.send("Error. Editting the embed exceeds the embed character limit (6000). Shorten down the embed.")
				//edge case when embed exceeds limit

					var guideChannel = ""
					categoryMsg[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
					if (categoryMsg[0].category === "resource") guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-resources")

					embedMessage.timestamp = new Date()
		    		guideChannel.messages.fetch({around: categoryMsg[0].messageID[message.guild.id], limit: 1}).then(m => {
						if (m.first().id != categoryMsg[0].messageID[message.guild.id])  {
							categoryMsg[0].messageID[message.guild.id] = m.first().id 
							guidesDB.updateOne({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") }}, {$set: {"embedMessage": embedMessage, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": categoryMsg[0].messageID, "category": categoryMsg[0].category}})
							post.post(client, message, "", "Edit", embedMessage)
							// post function
							//updates the ID if it does not match in the database
						}
						m.first().edit({embed: embedMessage}).then(me => {message.channel.send("ID: " + me.id)})
					})

					let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
					logChannel.send({embed: globalFunctions.logAction(message.author.username, message.author.id, 'Edit', newMsg, categoryMsg[0].categoryTitle)})
					guidesDB.updateOne({"categoryTitle": { $regex: new RegExp(categoryTitle, "i") }}, {$set: {"embedMessage": embedMessage, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": categoryMsg[0].messageID, "category": categoryMsg[0].category}})
					// post.post(client, message, "", "edit", categoryMsg[0].categoryTitle)
					message.channel.send("Message edited.")
				
				} 
				else if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())) {
					//stops Edit process if given no/cancel alias
					collector.stop()
					message.channel.send("Process canceled.")
				
				} 
				else if (received && globalFunctions.checkAliases(yesAlias, msg.content.trim()) == false) {
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

		collector.on('end', () => {
			if (received == false) message.channel.send("The message has expired with no output.")
		})

	},
}