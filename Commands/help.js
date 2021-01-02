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
					name: '`g!sbsuggest <Suggestion>`',
					value: 'Adds a Skyblock Guide Suggestion to <#772944441643630602> to be approved by a Contributor.\n\u200b',		
				},
				{
					name: ' `g!dsuggest <Suggestion>`',
					value: 'Adds a Dungeon Guide Suggestion to <#772944441643630602> to be approved by a Contributor.\n\u200b',
				},
				// {
				// 	name: '`g!update <Update Tips>`',
				// 	value: 'Posts an update tip in <#779467383604772874> whenever a new Skyblock Update is out.\n\u200b',
				// },
				{
					name: '`g!listcategories <#Guide Channel>`',
					value: 'Lists all of the Guide Categories available.\n\u200b',
				},
				{
					name: '`g!search <Query>`',
					value: 'Searches the guides that best match your query. **Recommended** to do `g!listcategories <#Guide Channel>` first to narrow search.\n\u200b',
				},
				{
					name: '`g!addcategory <#Guide Channel> <Category Name>`',
					value: 'Adds an embed for people to add changes in their respective channels.\n<#772942075301068820>`\n\u200b',
				},
				{
					name: '`g!addsection <Category-Name> <Section Name>`',
					value: 'Adds a new subtitle to a Category Message. See Guide alises above.\n\u200b',
				},
				{
					name: '`g!approve <Suggestion Message ID> <Category-Name> <Section Name>`',
					value: 'Approves a suggestion made in <#772944441643630602> and edits the message in the Skyblock or Dungeons Guide.\n\u200b',
				},
				{
					name: '`g!delete <Message ID> <#Channel>`',
					value: 'Deletes suggestions from <#772944441643630602> and deletes specific sections from any of the Guides.\n\u200b',
				},
				{
					name: '`g!edit <Message ID> <#Channel>`',
					value: 'Edits a Section of the Guide based on the Message ID supplied.',
				},
			],
			footer: {
				text: 'Skycomm Guide Bot',
				icon_url: "https://i.imgur.com/184jyne.png",
			},
		}
		helpEmbed.timestamp = new Date()
		
		if (message.member.roles.cache.find(role => role.name == "Discord Staff" || role.name == "Contributor" || role.name == "Discord Management")) {
			//manual check for specific role perms
			message.channel.send({embed: helpEmbed})
		} else {
			helpEmbed.fields = helpEmbed.fields.slice(0,5)
			message.channel.send({embed: helpEmbed})
		}
	},
}