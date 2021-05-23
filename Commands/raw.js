const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const {yesAlias, noAlias, cancelAlias} = require("../constants.js")

const processFile = (file, oldGuideMsg) => {
	let fileLines = file.split("\n")
	let sectionHeaders = fileLines
		.map((val, index) => val.includes("Section:") || val.toLowerCase().trim().includes("Section:") ? val += "--" + index : undefined)
		.filter(val => val != undefined)

	for (var i=0; i<sectionHeaders.length; i++) {
		let rawContent, sectionName;
		if (sectionHeaders[i+1] == undefined) rawContent = fileLines.slice(parseInt(sectionHeaders[i].split("--")[1])+1, fileLines.length).join("\n")
		else rawContent = fileLines.slice(parseInt(sectionHeaders[i].split("--")[1])+1, sectionHeaders[i+1].split("--")[1]).join("\n")
		
		if (rawContent.length >= 1024) return undefined
		
		sectionName = sectionHeaders[i].split("--")[0].split("Section:")[1].trim()
		let field = {
			name: sectionName,
			value: rawContent
		}
		oldGuideMsg.fields.map((val, index) => val.name == sectionName ? oldGuideMsg.fields[index] = field : undefined).filter(val => val != undefined).length == 0 ? oldGuideMsg.fields.push(field) : undefined
		
	}
	if (globalFunctions.embedCharCount(oldGuideMsg) >= 6000) return undefined
	oldGuideMsg.timestamp = new Date()
	return oldGuideMsg
}


module.exports = {
	name: 'raw',
    alises: ["r"],
	execute(client, message, args) {
		let categoryMsg, categoryName, guideMsg, newMsg;
		message.channel.send("Enter raw file below. To cancel this process, type `no` or `cancel`. Follow this format or else the file will not parse correctly. You can add multiple sections but only have 1 Category.\n" + "```Category:\nSection:\n<Start Guide Message Here>```")

		const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
		const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("5m")})
		let received = false;
        collector.on('collect', async (msg) => {
			if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())){
				collector.stop()
				return message.channel.send("Process canceled.")
				//stops process if given no/cancel alias

			} else if (received && globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
				collector.stop()

				let guideChannel = ""
				categoryMsg[0].category === "Skyblock" ? guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide") : guideChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
				if (categoryMsg[0].category === "resource") guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-resources")
				
				guideChannel.messages.fetch({around: categoryMsg[0].messageID[message.guild.id], limit: 1}).then(m => {
					if (m.first().id != categoryMsg[0].messageID[message.guild.id])  {
						categoryMsg[0].messageID[message.guild.id] = m.first().id 
						//updates the ID if it does not match in the database
					}
					guidesDB.updateOne({"categoryTitle": { $regex: new RegExp(categoryName, "i") }}, {$set: {"embedMessage": guideMsg, "categoryTitle": categoryMsg[0].categoryTitle, "messageID": categoryMsg[0].messageID, "category": categoryMsg[0].category}})
					//replacement for post edit function	
					m.first().edit({embed: guideMsg}).then(me => {message.channel.send("ID: " + me.id)})
				})

				let logChannel = message.guild.channels.cache.find(ch => ch.name === "guide-log")
				logChannel.send({embed: globalFunctions.logAction(message.author.username, message.author.id, 'Edit', newMsg, categoryMsg[0].categoryTitle)})
				return message.channel.send("Message edited.")

			} else if (received) {
				return message.channel.send("Invalid response. Please confirm the new message with `yes`. If you want to quit/cancel, type in `no` or `cancel`.")
			
			} else if (!received && msg.content.trim().includes("Category:") && msg.content.trim().includes("Section:") && msg.content.trim().split("Section:").length != 1 && msg.content.trim().split("Category:").length != 1) {
				let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
				newMsg = msg.content.trim().split("\n").slice(1, msg.content.trim().split("\n").length).join("\n")
				categoryName = msg.content.trim().split("\n")[0].split("Category:")[1].trim()
				categoryMsg = await guidesDB.find({"categoryTitle": { $regex: new RegExp(categoryName, "i") } }).toArray()
				if (categoryMsg[0] == undefined) {
					collector.stop()
					return message.channel.send("The category name given did not match anything in the database. Process canceled.")
				}

				guideMsg = processFile(msg.content.trim(), categoryMsg[0].embedMessage)
				if (guideMsg == undefined) return message.channel.send("The file submitted exceeded Discord's embed character limit. See `g!style` for more info.")
				message.channel.send("Please confirm that the editted Guide message below is correct with `yes` or `no`.")
				return message.channel.send({embed: guideMsg})
			
			} else {
				return message.channel.send("Invalid formatting. Check to see if this format is followed:\n" +  "```Category:\nSection:\n<Start Guide Message Here>```")
			}
        })
	},
} 