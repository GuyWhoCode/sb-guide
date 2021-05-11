module.exports = {
	name: 'start',
	execute(message, args) {
		var guideChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
		guideChannel.messages.fetch({around: 799806929110302730, limit: 1}).then(m => {
			console.log(m)
		})
		message.channel.send('Bot has started!')
	},
}

