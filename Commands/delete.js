//Deletes, doubles as a bulk delete command for staff members.
module.exports = {
	name: 'delete',
	description: 'Deletes a suggestion or a section from the guide.',
	execute(message, args) {
		if (args.length == 0) return message.channel.send("You need to input a Message ID! See `g!delete <Message ID>`")
		
		let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
		suggestionChannel.messages.fetch({around: messageID, limit: 1})
			.then(msg => {
			  msg.first().edit("This fetched message was edited");
			})
		message.channel.send('Delete command!!')
	},

}