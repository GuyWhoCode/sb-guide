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
	title: 'Common Money Making Methods',
	author: {
		name: 'Skyblock Guide'
	},
	fields: [
		{
			name: 'Zealots',
			value: "No one likes it, but we all gotta do this at some point. Self explanatory. Head down to the Dragon's Den at the bottom of the End and start stabbing zealots. Zealots drop summoning eyes, which are big money makers. Don't be angry that you haven't gotten a summoning eye in 600 zealots. People have gone 2,000 without one. Warning: You have at least 10 seconds after your Special Zealot spawns until drop protection for the Summoning Eye is gone. ",
		},
		{
			name: 'Building a Farm',
			value: "With the Builder's Wand (12k bits from the Community Shop), building a farm has never been easier! Even if you do buy one from the AH instead of the Community Shop, it's a worthwhile investment. ",
		},
		{
			name: 'Bazaar and AH Flipping',
			value: "You buy low, sell high. Look for items that fit this basic description, or have a mod do this for you. Bazaar Analyse (found in #skyblock-resources) will help with bazaar flipping. There is also a bazaar bot in Skyblock Simplified (#partners).",
		},
		{
			name: 'Participating in Events',
			value: "Do `$cal` in #bot-commands to see when the next event is. ",
		},
	],
	timestamp: new Date(),
	// footer: {
	// 	text: 'Skycomm Guide Bot',
	// 	icon_url: "./GuidePFP.png",
	// },
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




