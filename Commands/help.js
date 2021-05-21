module.exports = {
	name: 'help',
	alises: ["h", "Help", "H"],
	execute(message, args) {
		var helpEmbed = {
			color: 0x4ea8de,
			title: 'List of Commands',
			fields: [
				{
					name: '`g!help`',
					value: 'Brings up this help menu\n\u200b',
				},
				{
					name: '`g!listcategories <#Guide Channel>`',
					value: 'Lists all of the Guide Categories available.\n\u200b',
				},
				{
					name: '`g!search <Query>`',
					value: 'Searches the guides that best match your query.\n\u200b',
				},
				{
					name: '`g!sbsuggest <Suggestion>`',
					value: 'Adds a Skyblock Guide Suggestion to <#772944441643630602> to be approved by a Contributor.\n\u200b',		
				},
				{
					name: ' `g!dsuggest <Suggestion>`',
					value: 'Adds a Dungeon Guide Suggestion to <#772944441643630602> to be approved by a Contributor.\n\u200b',
				},
				{
					name: '`g!style`',
					value: 'Shows Style Guidelines for Contributors to follow and the editting commands they can use.',
				},
			],
			footer: {
				text: 'SkyBlock Guides',
				icon_url: "https://i.imgur.com/184jyne.png",
			},
		}
		if (message.guild.id != "587765474297905158") {
			helpEmbed.fields = helpEmbed.fields.slice(0,3)
		} else if (message.member.roles.cache.find(role => role.name == "Discord Staff" || role.name == "Contributor" || role.name == "Discord Management")) {
			//does nothing
		} else {
			helpEmbed.fields = helpEmbed.fields.slice(0,5)
		}
		
		helpEmbed.fields.push({name: "_ _", value: "**Powered by the [Skyblock Community](https://discord.gg/8tYAVEU)**"})
		helpEmbed.timestamp = new Date()
		message.channel.send({embed: helpEmbed})
	},
}