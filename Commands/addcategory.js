var categoryEmbed = {
  color: 0xffba00,
  title: 'Suggestion',
  description: "Filler Suggestion",
  fields: [
		{
			name: 'ID:',
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
      var categoryChannel = ""

      
      categoryEmbed.title = categoryName
        
      if (category == "sb") {
        category = "skyblock"
        categoryChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
      } else if (category == "d") {
        category = "dungeons"
        categoryChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
      } 
      
      categoryChannel.send({ embed: categoryEmbed })
      // dbClient.connect( async(err)=> {
      //   let database = dbClient.db("skyblockGuide")
      //   let suggestionsDB = database.collection("suggestions")
      
      //   let newEntry = createNewEntry(category, userSuggestion, message.author.id)
      //   suggestionsDB.insertOne(newEntry)
      // })
      //     message.content.send("yes adds new category")
      }
}
  