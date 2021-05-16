const {Client} = require("discord.js")
// const fs = require("fs")
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

// client.commands = new Discord.Collection()
// const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))

// for (const file of commandFiles) {
// 	const command = require(`./Commands/${file}`)
// 	client.commands.set(command.name, command)
// }

client.once('ready', () => {
	client.user.setActivity("g!help", {type: "WATCHING"})
})

client.on('message', async (message) => {
	if (message.author.bot) return;
	//weeds out messages that don't start with the prefix and the author of the message is a bot.
	const data = {
		name: 'echo',
		description: 'Replies with your input!',
		options: [{
			name: 'input',
			type: 'STRING',
			description: 'The input which should be echoed back',
			required: true,
		}],
	};

	const command = await client.application?.commands.create(data);
	console.log(command);
})

client.login(process.env.botToken)