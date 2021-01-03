const {dbClient} = require("../mongodb.js")
const {sbAlias, dAlias, uAlias} = require("../constants.js")
const globalFunctions = require("../globalfunctions.js")

var categoryEmbed = {
  	color: 0xffba00,
  	title: 'Suggestion',
  	description: "This is an empty section of the guide. Add some changes to this guide using!",
  	fields: [
		{
			name: '_ _',
			value: "_ _",
		}],
  	footer: {
  	  text: 'Skycomm Guide Bot',
  	  icon_url: "https://i.imgur.com/184jyne.png",
  	},
}

module.exports = {
	name: "addcategory",
	alises: ["ac", "addc", "AC", "Ac", "addC", "Addcategory", "AddCategory"],
	execute(message, args) {
	  	var categoryChannel = ""
	  	var msgID = ""
		var category = args[0]
		let categoryName = args.slice(1, args.length).join(" ").trim()
	  	if (args.length == 0 || category.length == 0 || categoryName.length == 0) return message.channel.send("See `g!addcategory <#Guide Channel> <Category Name>`")
	  	//checks if there is any bad input

	  	if (globalFunctions.checkAliases(sbAlias, category) == false && globalFunctions.checkAliases(dAlias, category) == false && globalFunctions.checkAliases(uAlias, category) == false) return message.channel.send("You are missing an argument! Please use the right format. `g!addcategory <#Guide Channel> <Category Name>`")
	  	//checks if provided alias does not match list of alises
		
	  	categoryEmbed.title = categoryName
	  	categoryEmbed.timestamp = new Date()
		
	  	if (globalFunctions.checkAliases(sbAlias, category)) {
	  		category = "Skyblock"
	  		categoryChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
	  		categoryEmbed.color = 0x87d8fa
	  		categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!sbsuggest <Suggestion>`!"
		
	  	} else if (globalFunctions.checkAliases(dAlias, category)) {
	  		category = "Dungeons"
	  		categoryChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
	  		categoryEmbed.color = 0xcc0000
	  		categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!dsuggest <Suggestion>`!"
		
	  	} else if (globalFunctions.checkAliases(uAlias, category)) {
	  		category = "Update Tips"
	  		categoryChannel = message.guild.channels.cache.find(ch => ch.name === "update-tips")
	  		categoryEmbed.color = 0xffba00
	  		categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!update <Update Tip>`!"
	  	}
	  
	  	categoryChannel.send({ embed: categoryEmbed }).then(msg => msgID = msg.id)

	  	dbClient.connect( async(err)=> {
	  		let database = dbClient.db("skyblockGuide")
	  	  	let guideDB = database.collection("Guides")
	  	  	let updateDB = database.collection("Update Tips")

	  	  	let newEntry = globalFunctions.makeNewEntry(categoryEmbed, categoryName, msgID, category)

	  	  	if (category == "Update Tips") {
	  			updateDB.insertOne(newEntry)
	  	  		await updateDB.updateOne({"identifier": category}, {$set: {"identifier": category, "currentMsgId": msgID, "msgObject": categoryEmbed}})
	  	  	} else {
	  	  		guideDB.insertOne(newEntry)
			}
	  	})

	  	message.channel.send("Your category has been created!")
	  	}
}