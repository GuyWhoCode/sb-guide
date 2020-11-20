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
	description: "",
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
    let userSuggestion = args.split(2, args.length).join(" ")
    suggestEmbed.description = userSuggestion

    // let user = message.author.username
    // suggestEmbed.title = `Suggestion made by ${user}`

    message.channel.send({ embed: suggestEmbed })
	},
}