const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
const prefix = 'g!'

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./Commands/${file}`)
	client.commands.set(command.name, command)
}

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
	footer: {
		text: 'Skycomm Guide Bot',
		icon_url: "https://i.imgur.com/184jyne.png",
	},
};






client.once('ready', () => {
  console.log("Ready!")
})

client.on('message', (message) => {
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (message.channel.name != "guide-discussion" && message.channel.name != "bot-commands") return message.channel.send("Wrong channel. Please use <#772948480972161044> or <#587815634641879076>!")
	
	// let lockedRole = message.guild.roles.find("name", "Guide Locked")
	if (message.guild.roles.fetch(779947579248214047)) return message.channel.send("You have been locked from suggesting anything.")

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	message.channel.send("Args: " + args + "\nCommand: " + command)

	try {
		client.commands.get(command).execute(message, args)
	} catch (error) {
		message.channel.send("There was an error in excuting that command.")
	}
	// else if (message.content.startsWith(`${prefix}addcategory`)) {
    // 	let userSuggestion = message.content.split(`${prefix}addcategory`)[1].trim()
    // 	message.channel.send(`This is your suggestion: ${userSuggestion}`)
    
    // dbClient.connect( async(err, clientDB)=> {
    //   let database = dbClient.db("skyblockGuide")
    //   const updateTips = database.collection("Skyblock")
    //   updateTips.insertOne({
    //     "newCategory": userSuggestion
    //   })
    // });

})

client.login(process.env.botToken)