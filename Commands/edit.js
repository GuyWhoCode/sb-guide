//Changes something on the guide.
// Flow: Brings the original message in a code block, along with the message id. Then awaits message from user. Must confirm change like Interwoven.
module.exports = {
	name: 'edit',
	description: 'Changes something on the guide',
	execute(message, args) {
		message.channel.send('Change command!')
	},
}