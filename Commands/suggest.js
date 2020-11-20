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




module.exports = {
	name: 'suggest',
	description: "Adds a suggestion to update the Skyblock or Dungeons guide.",
	execute(message, args) {
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

    // let userSuggestion = args.split(2, args.length).join(" ")
    // suggestEmbed.description = userSuggestion

    // let user = message.author.username

    // if (args[1] == "sb") {
    //   suggestEmbed.title = `Skyblock Guide Suggestion made by ${user}`
    // } else if (args[1] == "d") {
    //   suggestEmbed.title = `Dungeons Suggestion made by ${user}`
    // }
    
    message.channel.send({ embed: suggestEmbed })
    // message.channel.send("This command works!")
	},
}