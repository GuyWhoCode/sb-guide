const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true })

const suggestionSchema = {
    "section": "placeholder",
    "description": "placeholder",
    "messageID": "placeholder",
    "user": "placeholder"
} 
  
const createNewEntry = (section, desc, msgID, user) => {
  let entry = Object.create(suggestionSchema)
  entry.section = section
  entry.description = desc
  entry.messageID = msgID
  entry.user = user
  return entry
}

var suggestEmbed = {
  color: 0xffba00,
  title: 'Suggestion',
  description: "Filler Suggestion",
  fields: [
		{
			name: 'ID:',
			value: "_ _",
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
    var category = args[0]
    if (category != "sb" && category != "d") return message.channel.send("You are missing an argument! Please use the right format. `g!suggest [category] [suggestion]`")

    let userSuggestion = args.slice(1, args.length).join(" ").trim()
    suggestEmbed.description = userSuggestion

    let user = message.author.tag
    var suggestID = ""

   

    if (category == "sb") {
      suggestEmbed.title = `Skyblock Guide Suggestion by ${user}`
      category = "skyblock"
    } else if (category == "d") {
      suggestEmbed.title = `Dungeons Guide Suggestion by ${user}`
      category = "dungeons"
    } 

    suggestEmbed.fields[0].name = `ID: ${message.id}`
    let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
    suggestionChannel.send({ embed: suggestEmbed }).then(msg => {
      suggestEmbed.fields[0].name = `ID: ${msg.id}`
      suggestID = msg.id
      msg.edit({ embed: suggestEmbed})
    })
    
    dbClient.connect( async(err)=> {
      let database = dbClient.db("skyblockGuide")
      let suggestionsDB = database.collection("suggestions")
      
      let newEntry = createNewEntry(category, userSuggestion, suggestID, message.author.id)
      suggestionsDB.insertOne(newEntry)
    })
	},
}