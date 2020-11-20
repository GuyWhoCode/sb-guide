const suggestionSchema = {
    "title": "placeholder",
    "description": "placeholder",
    "user": "placeholder"
}
  
// const pingUser = id => {
//   return `<@${id}>`
// }
  
// const randomFunc = () => {
//   let smth = Object.create(suggestionSchema)
//   smth.title = "myTitle"
//   smth.description = "myDescription"
//   smth.user = pingUser(914534857345)
// }

var suggestEmbed = {
  color: 0xffba00,
  title: 'Suggestion',
  description: "Filler Suggestion",
  timestamp: new Date(),
  footer: {
    text: 'Skycomm Guide Bot',
    icon_url: "https://i.imgur.com/184jyne.png",
  },
}


module.exports = {
	name: 'suggest',
	description: "Adds a suggestion to update the Skyblock or Dungeons guide.",
	execute(message, args) {
    let userSuggestion = args.slice(1, args.length).join(" ")
    suggestEmbed.description = userSuggestion

    let user = message.author.tag

    if (args[0] == "sb") {
      suggestEmbed.title = `Skyblock Guide Suggestion made by ${user}`
    } else if (args[0] == "d") {
      suggestEmbed.title = `Dungeons Guide Suggestion made by ${user}`
    }
    
    let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
	  suggestionChannel.send({ embed: suggestEmbed })
	},
}