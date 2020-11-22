//Takes a user suggestion from #suggested-guide-changes and approves it.
// Parameters: (MESSAGE ID, guide Name (SB / Dungeons), Category name)
module.exports = {
	name: 'approve',
	description: 'Approves a suggestion.',
	execute(message, args) {
		message.channel.send('Approve command!')
	},
}