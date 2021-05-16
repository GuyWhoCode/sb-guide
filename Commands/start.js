const post = require("../post.js")
module.exports = {
	name: 'start',
	execute(client, message, args) {
		message.channel.send('Bot has started!')
		post.post(client, message, "", "edit", "Skills Guide")
	},
}