const Discord = require("discord.js")
const client = new Discord.Client()
const prefix = 'g!'
const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:"+ process.env.password + "@scoutingapp.pblik.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true });




//Reload Command
client.once('ready', () => {
  console.log("Ready!")
})

client.on('message', (message) => {
  if (message.content.startsWith(`${prefix}start`)) {
    message.channel.send("Bot has started!")
  } else if (message.content.startsWith(`${prefix}addcategory`)) {
    let userSuggestion = message.content.split(`${prefix}addcategory`)[1]
    message.channel.send(`This is your suggestion: ${userSuggestion}`)
    
    dbClient.connect( async(err, mongoDB)=> {
      let database = dbClient.db("skyblockGuide")
      const updateTips = database.collection("Skyblock")
      message.channel.send("Database output: " + updateTips)
      // updateTips.insertOne({
      //   newCategory: "testing out insertion"   
      // })
    });

    // let skyblockGuide = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
    // skyblockGuide.send(`New category created. ${userSuggestion}`)

  }

})

client.login(process.env.botToken)


//Example of Embed Below
// const exampleEmbed = {
// 	color: 0x0099ff,
// 	title: 'Some title',
// 	url: 'https://discord.js.org',
// 	author: {
// 		name: 'Some name',
// 		icon_url: 'https://i.imgur.com/wSTFkRM.png',
// 		url: 'https://discord.js.org',
// 	},
// 	description: 'Some description here',
// 	thumbnail: {
// 		url: 'https://i.imgur.com/wSTFkRM.png',
// 	},
// 	fields: [
// 		{
// 			name: 'Regular field title',
// 			value: 'Some value here',
// 		},
// 		{
// 			name: '\u200b',
// 			value: '\u200b',
// 			inline: false,
// 		},
// 		{
// 			name: 'Inline field title',
// 			value: 'Some value here',
// 			inline: true,
// 		},
// 		{
// 			name: 'Inline field title',
// 			value: 'Some value here',
// 			inline: true,
// 		},
// 		{
// 			name: 'Inline field title',
// 			value: 'Some value here',
// 			inline: true,
// 		},
// 	],
// 	image: {
// 		url: 'https://i.imgur.com/wSTFkRM.png',
// 	},
// 	timestamp: new Date(),
// 	footer: {
// 		text: 'Some footer text here',
// 		icon_url: 'https://i.imgur.com/wSTFkRM.png',
// 	},
// };

// channel.send({ embed: exampleEmbed });



const pingUser = id => {
  return `<@${id}>`
}

const randomFunc = () => {
  let smth = Object.create(suggestionSchema)
  smth.title = "myTitle"
  smth.description = "myDescription"
  smth.user = pingUser(914534857345)
  console.log(smth)
}
