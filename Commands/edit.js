//Changes something on the guide.
// Flow: Brings the original message in a code block, along with the message id. Then awaits message from user. Must confirm change like Interwoven.
module.exports = {
	name: 'edit',
	description: 'Edits something on the guide',
	execute(message, args) {
		if (args.length == 0 || args[0] == undefined || args[1] == undefined) return message.channel.send("Please use the right format. `g!edit <Category-Name> <Section-Name>`")
		//Weeds out all bad commands

		var categoryTitle = translateCategoryName(args[0]) 
		var sectionTitle = translateCategoryName(args[1])
		if (args.length >= 3) return message.channel.send("I received more parameters (>2) than I can work with. If there are more than 2 words in the Category or Section name, please replace the space with a hyphen (-), but keep the Capitalization. It's CaSe SeNsItIvE")

		dbClient.connect( async(err) => {
			let guidesDB = dbClient.db("skyblockGuide").collection("Guides")

			let categoryMsg = await guidesDB.find({"categoryTitle": categoryTitle}).toArray()
			let embedMessage = categoryMsg[0].embedMessage
			if (categoryMsg[0] == undefined) return message.channel.send("The Category Title that was given was incorrect. Remember to separate Category titles with more than 2 words with hyphens. It is CaSe SeNsItIvE.")
			
			var foundSection = false
			embedMessage.fields.map(val => {
				val.name === sectionTitle ? (val.value === "_ _" ? val.value = suggestion[0].description + "\n\u200b": val.value += "\n\u200b" + suggestion[0].description + "\n\u200b", foundSection = true): undefined
			})
			if (foundSection == false) return message.channel.send("The section that was given was incorrect. Remember to separate Section titles with more than 2 words with hyphens. It is CaSe SeNsItIvE.")

			
		})

	},
}