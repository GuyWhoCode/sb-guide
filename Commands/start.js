const post = require("../post.js")
module.exports = {
	name: 'start',
	execute(message, args) {
		message.channel.send('Bot has started!')
		post.post(message, message.guild.id, "edit", "Skills Guide")
	},
}