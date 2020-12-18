var helpEmbed = {
	color: 0x4ea8de,
	title: 'List of Commands',
	fields: [
		{
			name: 'Help `g!help`',
			value: 'Brings up this help list\n\u200b',
		},
		{
			name: 'Skyblock Guide Suggestion `g!sbsuggest <Suggestion>`',
			value: 'Adds your suggestion to <#772944441643630602> to be approved by a Contributor.\n\u200b',		
		},
		{
			name: 'Dungeons Guide Suggestion `g!dsuggest <Suggestion>`',
			value: 'Adds your suggestion to <#772944441643630602> to be approved by a Contributor.\n\u200b',
		},
		{
			name: 'Update Tips `g!update <Update Tips>`',
			value: 'Post tips in <#779467383604772874> whenever a new Skyblock Update is out.\n\u200b',
		},
		{
			name: 'List Categories `g!listcategories <Guide>`',
			value: 'Lists all of the Guide Categories available based on the given general category. See Add Category for Guide Alises.\n\u200b',
		},
		{
			name: 'Search `g!search <Query>`',
			value: 'Searches the guides that best match your query. **Recommended** to do `g!listcategories <Guide>` first to narrow search.\n\u200b',
		},
		{
			name: 'Add Category `g!addcategory <Guide> <Category Name>`',
			value: 'Adds an embed for people to add changes in their respective channels.\n<#772942075301068820> **Guide Alises:** `sb, skyblock, Skyblock, SB, SkyBlock`\n<#772944394542121031> **Guide Alises:** `d, dungeons, dung, Dungeons, D, dungeon, Dungeon, Dung`\n<#779467383604772874> **Guide Alises:** `u, update, U, Update, UPDATE`\n\u200b',
		},
		{
			name: 'Add Section `g!addsection <Category-Name> <Section Name>`',
			value: 'Adds a new subtitle to a Category Message. See Guide alises above.\n\u200b',
		},
		{
			name: 'Approve `g!approve <Suggestion Message ID> <Category-Name> <Section Name>`',
			value: 'Approves any suggestion made in <#772944441643630602> and edits the message in the Skyblock or Dungeons Guide.\n\u200b',
		},
		{
			name: 'Delete `g!delete <Message ID> <#Channel>`',
			value: 'Deletes suggestions from <#772944441643630602> and deletes specific sections from any of the Guides.\n\u200b',
		},
		{
			name: 'Edit `g!edit <Message ID> <#Channel>`',
			value: 'Edits a Section of the Guide based on the Message ID supplied.\n\u200b',
		},

	],
	footer: {
		text: 'Skycomm Guide Bot',
		icon_url: "https://i.imgur.com/184jyne.png",
	},
}

module.exports = {
	name: 'help',
	alises: ["h", "Help", "H"],
	execute(message, args) {
		helpEmbed.timestamp = new Date()
		var foundRole = false
		message.member.roles.cache.find(role => role.name === "Discord Management" ? foundRole = true : role)
		if (foundRole) message.channel.send({embed: helpEmbed})
	},
}