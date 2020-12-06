var helpEmbed = {
	color: 0x07f276,
	title: 'List of Commands',
	fields: [
		{
			name: 'Help `g!help`',
			value: 'Brings up this help list',
		},
		{
			name: 'Skyblock Guide Suggestion `g!sbsuggest <Suggestion>`',
			value: 'Adds your suggestion to <#772944441643630602> to be approved by a Contributor.',		
		},
		{
			name: 'Dungeons Guide Suggestion `g!dsuggest <Suggestion>`',
			value: 'Adds your suggestion to <#772944441643630602> to be approved by a Contributor.',
		},
		{
			name: 'Update Tips `g!update <Update Tips>`',
			value: 'Post tips in <#779467383604772874> whenever a new Skyblock Update is out.',
		},
		{
			name: 'List Categories `g!listcategories <Category>`',
			value: 'Lists all of the Guide Categories available based on the given general category. See Add Category for Category Alises.',
		},
		{
			name: 'Search `g!search <Query>`',
			value: 'Searches the guides that best match your query. Recommend to do `g!listcategories <Category>` first to narrow search.',
		},
		{
			name: 'Add Category `g!addcategory <Category> <Category Name>`',
			value: 'Adds an embed for people to add changes in their respective channels.\n<#772942075301068820> Category Alises: `sb, skyblock, Skyblock, SB, SkyBlock`\n<#772944394542121031> Category Alises: `d, dungeons, dung, Dungeons, D, dungeon, Dungeon, Dung`\n<#779467383604772874> Category Alises: `u, update, U, Update, UPDATE`',
		},
		{
			name: 'Add Section `g!addsection <Category> <Message ID>`',
			value: 'Adds a new subtitle to a Category Message. See Category alises above.',
		},
		{
			name: 'Approve `g!approve <Suggestion Message ID>`',
			value: 'Approves any suggestion made in <#772944441643630602> and edits the message in the Skyblock or Dungeons Guide.',
		},
		{
			name: 'Delete `g!delete <Message ID> <#Channel>`',
			value: 'Deletes suggestions from <#772944441643630602> and deletes specific sections from any of the Guides.',
		},
		{
			name: 'Edit `g!edit <Message ID> <#Channel>`',
			value: 'Edits a Section of the Guide based on the Message ID supplied.',
		},

	],
	timestamp: new Date(),
	footer: {
		text: 'Skycomm Guide Bot',
		icon_url: "https://i.imgur.com/184jyne.png",
	},
}

module.exports = {
	name: 'help',
	description: 'Provides help menu embed',
	execute(message, args) {
		message.channel.send({embed: helpEmbed})
	},
}