const Discord = require("discord.js")
const client = new Discord.Client()
const prefix = 'g!'
const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true });


// skyblock: 
// dungeons: cc0000
// updates: ffba00

const exampleEmbed = {
	color: 0x87d8fa,
	title: 'Skyblock!',
	author: {
		name: 'Mason',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
	},
	description: 'Testing out description placement',
	thumbnail: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	fields: [
		{
			name: 'Farming',
			value: 'is absolutely very cool',
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: 'WOAH THE SAME MESSAGE',
			value: 'Absolutely POGGERS',
		},
		{
			name: 'WOAH THE SAME MESSAGE',
			value: 'Absolutely POGGERS',
		},
		{
			name: 'WOAH THE SAME MESSAGE',
			value: 'Absolutely POGGERS',
		},
	],
	timestamp: new Date(),
	footer: {
		text: 'Some footer text here',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
	},
};






client.once('ready', () => {
  console.log("Ready!")
})

client.on('message', (message) => {
  if (message.content.startsWith(`${prefix}start`)) {
    message.channel.send("Bot has started!")
  } else if (message.content.startsWith(`${prefix}addcategory`)) {
    let userSuggestion = message.content.split(`${prefix}addcategory`)[1].trim()
    message.channel.send(`This is your suggestion: ${userSuggestion}`)
    
    dbClient.connect( async(err, clientDB)=> {
      let database = dbClient.db("skyblockGuide")
      const updateTips = database.collection("Skyblock")
      updateTips.insertOne({
        "newCategory": userSuggestion
      })
    });

    // let skyblockGuide = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
    // skyblockGuide.send(`New category created. ${userSuggestion}`)
  } else if (message.content.startsWith(`${prefix}embed`)) {
    message.channel.send({ embed: exampleEmbed });
  }

})

client.login(process.env.botToken)




