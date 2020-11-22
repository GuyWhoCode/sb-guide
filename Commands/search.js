//searches for a specific section in the guide and provides hyperlink.
//Parameters: keyword from list of categories.
module.exports = {
	name: 'search',
	description: 'Searches for a category in the guide',
	execute(message, args) {
		message.channel.send('Search command!')
	},
}