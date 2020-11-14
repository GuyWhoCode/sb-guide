const Discord = require("discord.js")
const client = new Discord.Client()
const prefix = 'g!'


client.once('ready', () => {
  console.log("Ready!")
})

client.on('message', messsage => {
  if (message.content.startsWith(`${prefix}start`)) {
    message.content.send("Bot has started!")
  }
})

client.login(process.env.botToken)


//Example of Embed Below
// const exampleEmbed = {
// 	color: 0x0099ff,
// 	title: 'Some title',
// 	url: 'https://discord.js.org',
// 	author: {
// 		name: 'Some name',
// 		icon_url: 'https://i.imgur.com/wSTFkRM.png',
// 		url: 'https://discord.js.org',
// 	},
// 	description: 'Some description here',
// 	thumbnail: {
// 		url: 'https://i.imgur.com/wSTFkRM.png',
// 	},
// 	fields: [
// 		{
// 			name: 'Regular field title',
// 			value: 'Some value here',
// 		},
// 		{
// 			name: '\u200b',
// 			value: '\u200b',
// 			inline: false,
// 		},
// 		{
// 			name: 'Inline field title',
// 			value: 'Some value here',
// 			inline: true,
// 		},
// 		{
// 			name: 'Inline field title',
// 			value: 'Some value here',
// 			inline: true,
// 		},
// 		{
// 			name: 'Inline field title',
// 			value: 'Some value here',
// 			inline: true,
// 		},
// 	],
// 	image: {
// 		url: 'https://i.imgur.com/wSTFkRM.png',
// 	},
// 	timestamp: new Date(),
// 	footer: {
// 		text: 'Some footer text here',
// 		icon_url: 'https://i.imgur.com/wSTFkRM.png',
// 	},
// };

// channel.send({ embed: exampleEmbed });



const pingUser = id => {
  return `<@${id}>`
}

const randomFunc = () => {
  let smth = Object.create(suggestionSchema)
  smth.title = "myTitle"
  smth.description = "myDescription"
  smth.user = pingUser(914534857345)
  console.log(smth)
}
