// Parameters: (MESSAGE ID, guide Name (SB / Dungeons), Category name)
const {dbClient} = require("../mongodb.js")

const sbAlias = ["sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock']
const dAlias = ["d", "dungeons", "dung", "Dungeons", "D", "dungeon", "Dungeon", "Dung"]

const checkAliases = (para, input) => {
    let returnVal = false
    para.map(val => val == input).filter(val => val == true)[0] ? (returnVal = true) : (returnVal = false)
    return returnVal
}

const getAllSectionNames = msg => {
    let returnArr = []
    msg.embedMessage.fields.filter(val => val.name != "_ _").map(val => returnArr.push(val.name))
    return returnArr
}
module.exports = {
	name: 'approve',
	description: 'Approves a suggestion.',
	execute(message, args) {
		if (args.length == 0) return message.channel.send("Please use the right format. `g!approve <Suggestion ID> <Section Name>`")
		//Weeds out all bad commands

		var messageID = args[0] 
		var sectionTitle = args[1] 		


		dbClient.connect( async(err) => {
			let suggestionDB = dbClient.db("skyblockGuide").collection("suggestions")
			let guidesDB = dbClient.db("skyblockGuide").collection("Guides")
			let suggestion = await suggestionDB.find({"messageID": messageID}).toArray()

			if (suggestion.length == 0) return message.channel.send("The given message ID was copied wrong. Please use the right format. `g!approve  <Suggestion ID> <Section Name>`")

			let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
			suggestionChannel.messages.fetch({around: messageID, limit: 1})
				.then(msg => {
				  msg.first().edit("This suggestion has been approved!");
				})
			// message.channel.send("This is what I got back from my database! Suggestion: " + suggestion[0].description)

			if (suggestion[0].section === "skyblock" || suggestion[0].section === "Skyblock") {
				let allGuideMsgs = await guidesDB.find({"category": "Skyblock"}).toArray()
				// allGuideMsgs.map()

			} else if (suggestion[0].section === "dungeons" || suggestion[0].section === "Dungeons") {
				let allGuideMsgs = await guidesDB.find({"category": "Skyblock"}).toArray()
			}
		})

		message.channel.send('Approve command!')
	},
}