const adEmbed = {
	color: 0x4ea8de,
	title: 'Skyblock Community Guides',
	fields: [
		{
			name: 'Want to help improve the guide?',
			value: "Use `g!sbsuggest` to suggest a change to the Skyblock Guide\nUse `g!dsuggest` to suggest a change to the Dungeons Guide.",
        },
        {
            name: 'Using Bot:',
            value: "To see the list of all commands, do `g!help`"
        }
        ],
	footer: {
		text: 'Skycomm Guide Bot',
		icon_url: "https://i.imgur.com/184jyne.png",
	},
}
module.exports = {
    name: "ad",
    execute(message, args) {
        message.channel.send({embed: adEmbed})
    }
}