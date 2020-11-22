//Dynamic help command. See https://discordjs.guide/command-handling/adding-features.html#a-dynamic-help-command
module.exports = {
	name: 'help',
	description: 'Provides help menu',
	execute(message, args) {
		message.channel.send('Help command!')
	},
}