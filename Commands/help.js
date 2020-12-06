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
			name: 'Dungeons Guide Suggestion `g!dsuggestion <Suggestion>`',
			value: 'Adds your suggestion to <#772944441643630602> to be approved by a Contributor.',
		},
		{
			name: 'Update Tips `g!update <Update Tips>`',
			value: 'Post tips in <#779467383604772874> whenever a new Skyblock Update is out.',
		},
		{
			name: 'Add Category `g!addcategory <Category> <Category Name>`',
			value: 'Adds an embed for people to add changes in their respective channels.\n<#772942075301068820> Category Alises: `sb, skyblock, Skyblock, SB, SkyBlock`\n<#772944394542121031> Category Alises: `d, dungeons, dung, Dungeons, D, dungeon, Dungeon, Dung`\n<#779467383604772874> Category Alises: `u, update, U, Update, UPDATE`',
		}
		// ,
		// {
		// 	name: ' `g!`',
		// 	value: '',
		// },
		// {
		// 	name: ' `g!`',
		// 	value: '',
		// },
		// {
		// 	name: ' `g!`',
		// 	value: '',
		// },
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