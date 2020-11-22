//Fetches values from database and lists it to users.
module.exports = {
	name: 'listcategories',
	description: 'Lists categories',
	execute(message, args) {
		message.channel.send('Lists categories command!')
	},
}