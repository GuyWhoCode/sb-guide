const suggestionSchema = {
    "title": "placeholder",
    "description": "placeholder",
    "user": "placeholder"
}
  
// const pingUser = id => {
//   return `<@${id}>`
// }
  
const createNewEntry = () => {
  let entry = Object.create(suggestionSchema)
  entry.title = "myTitle"
  entry.description = "myDescription"
  entry.user = pingUser(914534857345)
}

var suggestEmbed = {
  color: 0xffba00,
  title: 'Suggestion',
  description: "Filler Suggestion",
  fields: [
		{
			name: 'ID:',
			value: "",
		}],
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
    let category = args[0]

    if (category == "sb") {
      suggestEmbed.title = `Skyblock Guide Suggestion made by ${user}`
    } else if (category == "d") {
      suggestEmbed.title = `Dungeons Guide Suggestion made by ${user}`
    } else {
      message.channel.send("You are missing an argument! Please use the right format. `g!suggest [category] [suggestion]`")
      return;
    }
    
    suggestEmbed.fields[0].name = `ID: ${message.id}`



    let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
	  suggestionChannel.send({ embed: suggestEmbed })
	},
}