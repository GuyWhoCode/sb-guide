const {dbClient} = require("../mongodb.js")
const globalFunctions = require("../globalfuncions.js")

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
	description: "Adds a suggestion to update the Skyblock guide.",
	execute(message, args) {
    // if (category != "sb") return message.channel.send("You are missing an argument! Please use the right format. `g!suggest [category] [suggestion]`")
    if (args.length == 0) return message.channel.send("You need to input a suggestion! See `g!sbsuggest <Suggestion>`")
    return message.channel.send("Args: " + args)

    let userSuggestion = args.join(" ").trim()
    suggestEmbed.description = userSuggestion

    let user = message.author.tag
    var suggestID = ""
    suggestEmbed.title = `Skyblock Guide Suggestion by ${user}`
    suggestEmbed.timestamp = new Date()
    
    let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
    suggestionChannel.send({ embed: suggestEmbed }).then(msg => {
      suggestEmbed.fields[0].name = `ID: ${msg.id}`
      suggestID = msg.id
      msg.edit({ embed: suggestEmbed})
    })
    
    dbClient.connect( async(err)=> {
      let suggestionsDB = dbClient.db("skyblockGuide").collection("suggestions")
      
      let newEntry = globalFunctions.createNewEntry("Skyblock", userSuggestion, suggestID, message.author.id)
      suggestionsDB.insertOne(newEntry)
    })

    message.channel.send("Your suggestion has been submitted!")
	},
}