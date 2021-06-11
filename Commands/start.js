const globalFunctions = require("../globalfunctions.js")
module.exports = {
	name: 'start',
	execute(client, message, args) {
		message.channel.send('Bot has started!')
		
		let testMsg = {
			color: 5155038,
			title: 'Master Mode',
			description: '',
			fields: [
			  { name: '_ _', value: '_ _' },
			  {
				name: 'Floor 1-4',
				value: "Floor 1- No dupes is good, but tank/healer aren't really needed.\n" +
				  'Floor 2- Again no dupes is good.\n' +
				  'Floor 3- No dupes works, but no healer is preferred. \n' +
				  'Floor 4- No dupes is ideal, but the 3 dps classes can all replace each other.\n'
			  },
			  {
				name: 'Floor 5',
				value: 'This is currently the most popular floor due to the huge amount of xp it gives. Standard setup: 1 tank, 3 mages, 1 berserker/archer. The tank, bers/arch, and 1 of the right click mages(rcm) bloodrush, while the mages clear. \n' +
				  'Another class setup for easier clear: 2 mages swapping for tank gives more ehp and gives solo mage more damage. The mages can solo clear much easier without dying.\n' +
				  'Healer is not really used in more experienced groups, however some people use them.\n' +
				  'In boss room the incredibly high damage of the lcms and bers/arch can generally kill the correct livid before the tank dies.\n'
			  },
			  {
				name: 'Floor 6',
				value: 'This is definetly the hardest floor as of yet. If you can run very efficient runs then it can give more xp and money then mm5. Standard setup is no dupes. Bloodrush and split is the same as MM5 (healer plays as a mage). In boss room generally LCM kills the golems while the rest of the group fights teracottas. Letting archer get a soul eater stack from a golem can let them 1 tap sadan.\n' +
				  'The berserker, tank, and healer spam Axe of the Shredded most of the time.'
			  }
			],
			footer: {
			  text: 'Skyblock Guides',
			  icon_url: 'https://i.imgur.com/184jyne.png'
			},
			timestamp: 1623424121410
		}
		let section = 0
		const scrollThruMsg = (msg, action) => {
			if (section < 0 || section > (msg.fields.length)) return undefined
			action == "forward" ? section += 1 : section -= 1
			return msg.fields[section]
		
		}
		
		message.react('➡️')
		const filter = (reaction, user) => {return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id}
		const collector = message.createReactionCollector(filter, {time: globalFunctions.timeToMS("1m")})
		collector.on('collect', (reaction, user) => {
			if (reaction.emoji.name === "⬅️") {
				message.channel.send("Turning the page to the left!")
				let guideSection = scrollThruMsg(testMsg, "back")
				guideSection != undefined ? message.channel.send({embed: guideSection}) : undefined
				message.reactions.removeAll()
				message.react('➡️').then(() => message.react('⬅️'))
			} else {
				message.channel.send("Turning the page to the right!")
				let guideSection = scrollThruMsg(testMsg, "forward")
				guideSection != undefined ? message.channel.send({embed: guideSection}) : undefined
				message.reactions.removeAll()
				message.react('➡️').then(() => message.react('⬅️'))
			}
		})
		
		collector.on('end', () => {
			message.reactions.removeAll().catch(error => console.log(error))
			//once the time limit has been reached, clear all reactions to prevent any confusion
		})
		
	},
}