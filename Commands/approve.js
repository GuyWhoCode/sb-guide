//Takes a user suggestion from #suggested-guide-changes and approves it.
// Parameters: (MESSAGE ID, guide Name (SB / Dungeons), Category name)
module.exports = {
	name: 'approve',
	description: 'Approves a suggestion.',
	execute(message, args) {
		message.channel.send('Approve command!')
		// message.channel.messages.fetch({around: "352292052538753025", limit: 1})
		// .then(messages => {
		//   messages.first().edit("This fetched message was edited");
		// });
	},
}