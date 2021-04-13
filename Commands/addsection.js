const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const {noAlias, cancelAlias} = require("../constants.js")
const entrySchema = {
    "name": "_ _",
    "value": "_ _"
}

module.exports = {
    name: "addsection",
    alises: ["as", "adds"],
    async execute(message, args) {
		var sectionName, categoryName, categoryMsg = ""
		let guideCollection = dbClient.db("skyblockGuide").collection("Guides")
        var categoryConfirm = false
        
        if (args.length == 0) {
			const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
			const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("3m")})	

			message.channel.send("To cancel the Argument helper, type in `no` or `cancel`. Enter the Guide Category to add a new section.")
			collector.on('collect', async(msg) => {
				if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())){
					collector.stop()
					message.channel.send("Process canceled.")
					return undefined
					//stops process if given no/cancel alias

				} else if (categoryConfirm) {
					sectionName = globalFunctions.translateCategoryName(msg.content.trim())
					
					collector.stop()
					//Stops prompting the user

					let msgEmbed = categoryMsg[0].embedMessage
					msgEmbed.timestamp = new Date()
					// include edge case here to remove default value
					
					var newEntry = Object.create(entrySchema)
					newEntry.name = sectionName
					msgEmbed.fields.push(newEntry)
					
					delete msgEmbed.description
					let channelName = categoryMsg[0].category
					guideCollection.updateOne({"categoryTitle": { $regex: new RegExp(categoryName, "i") }}, {$set: {"category": channelName, "messageID": categoryMsg[0].messageID, "categoryTitle": categoryMsg[0].categoryTitle, "embedMessage": msgEmbed}})
					
					var guideChannel = ""
					channelName === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
					if (categoryMsg[0].category === "resource") guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-resources")
					
					guideChannel.messages.fetch({around: categoryMsg[0].messageID, limit: 1})
					.then(msg => {
						msg.first().edit({embed: msgEmbed})
					})

					return message.channel.send("Your section has been added!")					
					//Since Discord.js does not like exitting out of the Message collector after ending it, the same code from lines 95-112 is copied and pasted here.

				} else if (!categoryConfirm) {

					categoryMsg = await guideCollection.find({"categoryTitle": { $regex: new RegExp(globalFunctions.translateCategoryName(msg.content.trim()), "i") } }).toArray()
        			if (categoryMsg[0] == undefined || categoryMsg.length > 1) return message.channel.send("The Category Name provided did not match anything, please enter another one.")

					categoryConfirm = true
					categoryName = msg.content.trim()
					message.channel.send("Enter the name of the new Guide Section.")
					return undefined
					//if a valid alias of the guide channel is given, run this portion of the code
				} 
			})
			
			if (!categoryConfirm) return undefined
		} 
		//**Enable the Argument helper: Prompts the user for each argument of the command to make it more user-friendly
		//Exits out of the code to prevent the code below the argument parsing from returning an error
        
        
        else {
			if (args[0] == undefined || sectionName.length == 0) return message.channel.send("See `g!addsection <Category-Name> <Section Name>`")
			//checks if there is any bad input

			categoryName = globalFunctions.translateCategoryName(args[0])
			sectionName = args.slice(1, args.length).join(" ").trim()
        	categoryMsg = await guideCollection.find({"categoryTitle": { $regex: new RegExp(categoryName, "i") } }).toArray()
        	if (categoryMsg[0] == undefined || categoryMsg.length > 1) return message.channel.send("The Category Name provided did not match anything. Did you make sure to include hyphens?")
        	//If the provided category does not exist in the database, give the user an error saying so.
		}
        //**Default command.** Format: g!as <Category-Name> <Section-Name>


        let msgEmbed = categoryMsg[0].embedMessage
        msgEmbed.timestamp = new Date()
        // include edge case here to remove default value
        
        var newEntry = Object.create(entrySchema)
        newEntry.name = sectionName
        msgEmbed.fields.push(newEntry)
        
        delete msgEmbed.description
        let channelName = categoryMsg[0].category
        guideCollection.updateOne({"categoryTitle": { $regex: new RegExp(categoryName, "i") }}, {$set: {"category": channelName, "messageID": categoryMsg[0].messageID, "categoryTitle": categoryMsg[0].categoryTitle, "embedMessage": msgEmbed}})
        
        var guideChannel = ""
        channelName === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
        if (categoryMsg[0].category === "resource") guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-resources")
        
        guideChannel.messages.fetch({around: categoryMsg[0].messageID, limit: 1})
		.then(msg => {
			msg.first().edit({embed: msgEmbed})
        })
            
        message.channel.send("Your section has been added!")
        
    }
}