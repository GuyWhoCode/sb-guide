const globalFunctions = require("../globalfunctions.js")
module.exports = {
	name: 'start',
	execute(message, args) {
		// message.channel.send('Bot has started!')
		globalFunctions.tableOfContents("Skyblock", message.guild.id)
            .then(val => message.guild.channels.cache.find(ch => ch.id === "807321396829093909")
                    .send({embed: val}))
                    // .then(msg => findServer[0].sbTable = msg.id))
	},
}

