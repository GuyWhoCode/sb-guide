module.exports = {
	name: 'start',
	description: 'Starts up!',
	execute(message, args) {
		message.channel.send('Bot has started! With these args: ' + args.join(" ").trim())
	},
}