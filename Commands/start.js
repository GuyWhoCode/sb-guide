const globalFunctions = require("../globalfunctions.js")
module.exports = {
	name: 'start',
	execute(client, message, args) {
		message.channel.send('Bot has started!')
		
		message.react('⬅️').then(() => message.react('➡️'))
		
		const filter = (reaction, user) => {return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id}
		message.awaitReactions(filter, {max: 10, time: globalFunctions.timeToMS("1m"), errors: ['time']})
			.then(collected => {
				let reaction = collected.first()
				if (reaction.emoji.name === "⬅️") {
					message.channel.send("Turning the page to the left!")
				} else {
					message.channel.send("Turning the page to the right!")
				}
			})
			.catch(() => {
				message.reactions.removeAll().catch(error => console.log(error))
				//once the time limit has been reached, clear all reactions to prevent any confusion
			})
		console.log("When does this run?")
		
	},
}