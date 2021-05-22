const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const {yesAlias, noAlias, cancelAlias} = require("../constants.js")

const processFile = file => {
	let fileLines = file.split("\n")
	let newGuideEmbed = {
		color: 0x4ea8de,
		title: fileLines[0].split("Category:")[1].trim(),
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
	
	let sectionHeaders = fileLines
		.map((val, index) => val.includes("Section:") || val.toLowerCase().trim().includes("Section:") ? val += "--" + index : undefined)
		.filter(val => val != undefined)

	for (var i=0; i<sectionHeaders.length; i++) {
		let rawContent;
		if (sectionHeaders[i+1] == undefined) rawContent = fileLines.slice(parseInt(sectionHeaders[i].split("--")[1])+1, fileLines.length-1).join("\n")
		else rawContent = fileLines.slice(parseInt(sectionHeaders[i].split("--")[1])+1, sectionHeaders[i+1].split("--")[1]).join("\n")
		
		let field = {
			name: sectionHeaders[i].split("--")[0],
			value: rawContent
		}
		newGuideEmbed.fields.push(field)
	}
	newGuideEmbed.timestamp = new Date()
	return newGuideEmbed
}

module.exports = {
	name: 'raw',
    alises: ["r"],
	execute(client, message, args) {
		
		message.channel.send("Enter raw file below. Follow this format or else the file will not parse correctly. You can add multiple sections but only have 1 Category.\n" + "```Category:\nSection:\n<Start Guide Message Here>```")

		const filter = msg => msg.author.id === message.author.id && msg.content.length != 0
		const collector = message.channel.createMessageCollector(filter, {time: globalFunctions.timeToMS("5m")})
		let received = false;
        collector.on('collect', (msg) => {
			if (globalFunctions.checkAliases(noAlias, msg.content.trim()) || globalFunctions.checkAliases(cancelAlias, msg.content.trim())){
				collector.stop()
				return message.channel.send("Process canceled.")
				//stops process if given no/cancel alias

			} else if (received && globalFunctions.checkAliases(yesAlias, msg.content.trim())) {
				return message.channel.send("Invalid response. Please confirm the new message with `yes`. If you want to quit/cancel, type in `no` or `cancel`.")
			
			} else if (!received) {
				collector.stop()
				return message.channel.send({embed: processFile(msg.content.trim())})
			} 
			// else {
			// 	return message.channel.send("Invalid formatting.")
					
			// }
        })
	},
}