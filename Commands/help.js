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
					name: '`g!addcategory <#Guide Channel> <Category Name>`',
					value: 'Adds a new Guide message to their respective channels. If the Command Arguments are too difficult, use the Argument helper with `g!ac`\n\u200b',
				},
				{
					name: '`g!addsection <Category-Name> <Section Name>`',
					value: 'Adds a new Guide Section to a Category Message. If the Command Arguments are too difficult, use the Argument helper with `g!as` \n\u200b',
				},
				{
					name: '`g!approve <Suggestion Message ID> <Category-Name> <Section-Name>`',
					value: 'Approves a suggestion made in <#772944441643630602> by editing the Skyblock or Dungeons Guide message. If the Command Arguments are too difficult, use the Argument helper with `g!a` \n\u200b',
				},
				{
					name: '`g!delete <Message ID> <#Channel>`',
					value: 'Deletes suggestions from <#772944441643630602> and specific sections from any of the Guides.\n\u200b',
				},
				{
					name: '`g!edit <Category-Name> <Section-Name>`',
					value: 'Edits a Section of the Guide based on the Message ID supplied. If the Command Arguments are too difficult, use the Argument helper with `g!e`',
				}
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