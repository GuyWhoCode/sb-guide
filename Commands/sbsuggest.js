const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfunctions.js")
const aliasList = ["Sbsuggest", "suggestsb", "skyblockSuggestion", "skyblockSuggest", "sbsug", "sbs"]
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
		text: 'Skyblock Guides',
		icon_url: "https://i.imgur.com/184jyne.png",
	},
}

module.exports = {
	name: 'sbsuggest',
	alises: aliasList,
	execute(message, args) {
		if (args.length == 0) return message.channel.send({embed: globalFunctions.commandHelpEmbed("Sb Guide Suggestion", aliasList, Date.now(), "g!sbsuggest My suggestion!", "Suggests 'my suggestion' to be considered for change on the Skyblock Guide")})
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

		let suggestionsDB = dbClient.db("skyblockGuide").collection("suggestions")
		suggestionChannel.send({ embed: suggestEmbed }).then(msg => {
			suggestEmbed.fields[0].name = `ID: ${msg.id}`
			suggestionsDB.insertOne(globalFunctions.createNewEntry("Skyblock", userSuggestion, msg.id, message.author.id))
			msg.edit({ embed: suggestEmbed})
		})

		message.channel.send("Your suggestion has been submitted!")
	},
}