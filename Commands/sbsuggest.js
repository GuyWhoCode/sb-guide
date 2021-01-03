const {database} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")

var suggestEmbed = {
	color: 0xffba00,
	title: 'Suggestion',
	description: "Filler Suggestion",
	fields: [
		{
			name: 'ID:',
			value: "_ _",
		}],
	footer: {
		text: 'Skycomm Guide Bot',
		icon_url: "https://i.imgur.com/184jyne.png",
	},
}

module.exports = {
	name: 'sbsuggest',
	alises: ["Sbsuggest", "suggestsb", "SkyblockSuggestion", "skyblockSuggestion", "skyblockSuggest", "SkyblockSuggest", "skyblocksuggest", "sbsug", "sbs"],
	execute(message, args) {
		if (args.length == 0) return message.channel.send("You need to input a suggestion! See `g!sbsuggest <Suggestion>`")
		//checks if there is any bad input
		let userSuggestion = args.join(" ").trim()
		if (userSuggestion.length >= 1024) return message.channel.send("Your suggestion has hit the max character limit (1024). Shorten the suggestion or break up the suggestion into smaller suggestions.")
		suggestEmbed.description = userSuggestion

		let user = message.author.tag
		suggestEmbed.title = `Skyblock Guide Suggestion by ${user}`
		suggestEmbed.timestamp = new Date()
		
		suggestEmbed.image = globalFunctions.linkEmbedConstructor(args)
		//supports images

		let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")

		// database.connect(async(err)=> {
		let suggestionsDB = database.collection("suggestions")
		suggestionChannel.send({ embed: suggestEmbed }).then(msg => {
			suggestEmbed.fields[0].name = `ID: ${msg.id}`
			suggestionsDB.insertOne(globalFunctions.createNewEntry("Skyblock", userSuggestion, msg.id, message.author.id))
			msg.edit({ embed: suggestEmbed})
		})
		// })

		message.channel.send("Your suggestion has been submitted!")
	},
}