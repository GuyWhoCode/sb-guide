const {dbClient} = require("../mongodb.js")
const {sbAlias, dAlias, noAlias, cancelAlias} = require("../constants.js")
const globalFunctions = require("../globalfunctions.js")

var categoryEmbed = {
  	color: 0xffba00,
  	title: 'Suggestion',
  	description: "This is an empty section of the guide.",
  	fields: [
		{
			name: '_ _',
			value: "_ _",
		}],
  	footer: {
  	  text: 'Skyblock Guides',
  	  icon_url: "https://i.imgur.com/184jyne.png",
  	},
}

module.exports = {
	name: "addcategory",
	alises: ["ac", "addc"],
	execute(client, message, args) {
	  	var categoryChannel, msgID, category, categoryName = ""
		var channelConfirm = false
		let guideDB = dbClient.db("skyblockGuide").collection("Guides")
		

		if (args.length == 0) {
			const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
			const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("3m")})	

			message.channel.send("To cancel the Argument helper, type in `no` or `cancel`. Enter the Channel to put the new Guide in: `skyblock` or `dungeons`")
			collector.on('collect', async(msg) => {
				if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())){
					collector.stop()
					return message.channel.send("Process canceled.")
					//stops process if given no/cancel alias

				} else if (channelConfirm) {
					categoryName = globalFunctions.translateCategoryName(msg.content.trim())
					
					collector.stop()
					//Stops prompting the user
					
					categoryEmbed.title = categoryName
	  				categoryEmbed.timestamp = new Date()

	  				if (globalFunctions.checkAliases(sbAlias, category)) {
	  					category = "Skyblock"
	  					categoryChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
	  					categoryEmbed.color = 0x87d8fa
	  					categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!sbsuggest <Suggestion>`!"
					
	  				} else if (globalFunctions.checkAliases(dAlias, category)) {
	  					category = "Dungeons"
	  					categoryChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
	  					categoryEmbed.color = 0xcc0000
	  					categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!dsuggest <Suggestion>`!"

	  				}

					categoryChannel.send({ embed: categoryEmbed }).then(msg => msgID = msg.id)

					let newEntry = globalFunctions.makeNewEntry(categoryEmbed, categoryName, msgID, category, message.guild.id)
					guideDB.insertOne(newEntry)
					//Since Discord.js does not like exitting out of the Message collector after ending it, the same code from lines 98-118 is copied and pasted here.
					return message.channel.send("Your category has been created!")

				} else if (!channelConfirm) {
					if (globalFunctions.checkAliases(sbAlias, msg.content.trim()) == false && globalFunctions.checkAliases(dAlias, msg.content.trim()) == false) return message.channel.send("Incorrect input. Type in a Guide Channel or its corresponding Alias.")
	  				//checks if provided alias does not match list of alises

					channelConfirm = true
					category = msg.content.trim()
					return message.channel.send("Enter the name of the new Guide (Category).")
					//if a valid alias of the guide channel is given, run this portion of the code
				} 
			})
			
			if (!channelConfirm) return undefined
		} 
		//**Enable the Argument helper: Prompts the user for each argument of the command to make it more user-friendly
		//Exits out of the code to prevent the code below the argument parsing from returning an error
		
		else {
			category = args[0]
			categoryName = args.slice(1, args.length).join(" ").trim()
			if (globalFunctions.checkAliases(sbAlias, category) == false && globalFunctions.checkAliases(dAlias, category) == false) return message.channel.send("You are missing an argument! Please use the right format. `g!addcategory <#Guide Channel> <Category Name>`")
	  		//checks if provided alias does not match list of aliases
			
		}
		//**Default command.** Format: g!ac <#Guide-Channel> <Category-Name>

		
		categoryEmbed.title = categoryName
	  	categoryEmbed.timestamp = new Date()
		
	  	if (globalFunctions.checkAliases(sbAlias, category)) {
	  		category = "Skyblock"
	  		categoryChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
	  		categoryEmbed.color = 0x87d8fa
	  		categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!sbsuggest <Suggestion>`!"
		
	  	} else if (globalFunctions.checkAliases(dAlias, category)) {
	  		category = "Dungeons"
	  		categoryChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
	  		categoryEmbed.color = 0xcc0000
	  		categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!dsuggest <Suggestion>`!"
			
	  	} 

		categoryChannel.send({ embed: categoryEmbed }).then(msg => msgID = msg.id)

	  	let newEntry = globalFunctions.makeNewEntry(categoryEmbed, categoryName, msgID, category)
	  	guideDB.insertOne(newEntry)

		message.channel.send("Your category has been created!")
	}
}