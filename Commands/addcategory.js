var categoryEmbed = {
  color: 0xffba00,
  title: 'Suggestion',
  description: "This is an empty section of the guide. Add some changes to this guide using!",
  fields: [
		{
			name: '_ _',
			value: "_ _",
		}],
  timestamp: new Date(),
  footer: {
    text: 'Skycomm Guide Bot',
    icon_url: "https://i.imgur.com/184jyne.png",
  },
}

module.exports = {
    name: "addcategory",
    description: "Adds a new category to <#772942075301068820> or <#772944394542121031>",
    execute(message, args) {
      var category = args[0]
      if (category != "sb" && category != "d") return message.channel.send("You are missing an argument! Please use the right format. `g!addcategory [category] [Category Name]`")
      
      let categoryName = args.slice(1, args.length).join(" ").trim()
      if (categoryName.length == 0) return message.channel.send("You need to input a Category Name! See `g!addcategory  [Category Name]`")
      
      var categoryChannel = ""

      categoryEmbed.title = categoryName
        
      if (category == "sb") {
        category = "Skyblock"
        categoryChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
        categoryEmbed.color = 0x87d8fa
        categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!sbsuggest <Suggestion>`!"
      } else if (category == "d") {
        category = "Dungeons"
        categoryChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
        categoryEmbed.color = 0xcc0000
        categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!dsuggest <Suggestion>`!"
      } else if (category == "u") {
        category = "Update Tips"
        
      }
      
      categoryChannel.send({ embed: categoryEmbed })
      // dbClient.connect( async(err)=> {
      //   let database = dbClient.db("skyblockGuide")
      //   let categoryDB = database.collection(category)
        

      //   suggestionsDB.insertOne(newEntry)
      // })
      message.channel.send("Your category has been created!")
      }
}