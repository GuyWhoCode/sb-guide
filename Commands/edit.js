const {dbClient} = require("../mongodb.js")
const globalFunction = require("../globalfuncions.js")
//Changes something on the guide.
// Flow: Brings the original message in a code block, along with the message id. Then awaits message from user. Must confirm change like Interwoven.
const yesAlias = ["yes", "Yes", "YES", "y", 'Y']
module.exports = {
	name: 'edit',
	alises: ["e", "E", "Edit"],
	execute(message, args) {
		if (args.length == 0 || args[0] == undefined || args[1] == undefined) return message.channel.send("Please use the right format. `g!edit <Category-Name> <Section-Name>`")
		//Weeds out all bad commands

		var categoryTitle = globalFunction.translateCategoryName(args[0]) 
		var sectionTitle = globalFunction.translateCategoryName(args[1])
		if (args.length >= 3) return message.channel.send("I received more parameters (>2) than I can work with. If there are more than 2 words in the Category or Section name, please replace the space with a hyphen (-), but keep the Capitalization. It's CaSe SeNsItIvE")

		dbClient.connect( async(err) => {
			let guidesDB = dbClient.db("skyblockGuide").collection("Guides")

			let categoryMsg = await guidesDB.find({"categoryTitle": categoryTitle}).toArray()
			let embedMessage = categoryMsg[0].embedMessage
			if (categoryMsg[0] == undefined) return message.channel.send("The Category Title that was given was incorrect. Remember to separate Category titles with more than 2 words with hyphens. It is CaSe SeNsItIvE.")
			
			var foundSection = false
			var oldMessage = ""

			embedMessage.fields.map(val => {
				val.name === sectionTitle ? (oldMessage = val.value , foundSection = true) : undefined
			})
			if (foundSection == false) return message.channel.send("The section that was given was incorrect. Remember to separate Section titles with more than 2 words with hyphens. It is CaSe SeNsItIvE.")

			message.channel.send("Please post the edited version below. This message will expire in 20 seconds. Run the command again if you run out of time.\nHere is the original message as a reference: " + "```" + oldMessage + "```")
			
			const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
			const collector = message.channel.createMessageCollector(filter, {time: 20000})
			var received = false

			collector.on('collect', msg => {
				received = true
				var newMsg = msg
				message.channel.send("Please confirm the new message with `yes`.\n" + "`" + newMsg + "`")
				
				const confirmFilter = m => m.author.id === message.author.id && m.content.length != 0 && globalFunction.checkAliases(yesAlias, m)
				const confirmCollector = message.channel.createMessageCollector(confirmFilter, {time: 10000})
				
				var guideChannel = ""
				confirmCollector.on('collect', confirmMsg => {
					// if (categoryMsg[0].category === "Skyblock") {
					// 	guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
					// } else if (categoryMsg[0].category === "Dungeons") {
					// 	guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
					// }

					// embedMessage.timestamp = new Date()
		    		// guideChannel.messages.fetch({around: categoryMsg[0].messageID, limit: 1}).then(m => {
					//   m.first().edit({embed: embedMessage})
					// })
					message.channel.send("I got this for the final change:\n" + "`" + newMsg + "`")
				})	
			})

			collector.on('end', msg => {
				if (received == false) message.channel.send("The message has expired and I have received no output.")
			})
		})

	},
}