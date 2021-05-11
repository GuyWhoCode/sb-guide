module.exports = {
	name: 'start',
	execute(message, args) {
		var guideChannel = message.guild.channels.cache.find(ch => ch.name === "general")
		guideChannel.messages.fetch({around: 841527319860740136, limit: 1}).then(m => {
			console.log(m)
		})
		message.channel.send('Bot has started!')
	},
}