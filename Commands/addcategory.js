module.exports = {
    name: "addcategory",
    description: "Adds a new category to <#772942075301068820> or <#772944394542121031>",
    execute(message, args) {
        let userSuggestion = args.slice(1, args.length).join(" ").trim()
        suggestEmbed.description = userSuggestion

        let user = message.author.tag
        var category = args[0]

        if (category != "sb" && category != "d") {
          message.channel.send("You are missing an argument! Please use the right format. `g!addcategory [category] [Category Name]`")
          return;
        }

        if (category == "sb") {
          suggestEmbed.title = `Skyblock Guide Suggestion by ${user}`
          category = "skyblock"
        } else if (category == "d") {
          suggestEmbed.title = `Dungeons Guide Suggestion by ${user}`
          category = "dungeons"
        } 

        suggestEmbed.fields[0].name = `ID: ${message.id}`
        // let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === "suggested-guide-changes")
        // suggestionChannel.send({ embed: suggestEmbed })

        // dbClient.connect( async(err)=> {
        //   let database = dbClient.db("skyblockGuide")
        //   let suggestionsDB = database.collection("suggestions")
        
        //   let newEntry = createNewEntry(category, userSuggestion, message.author.id)
        //   suggestionsDB.insertOne(newEntry)
        // })
        //     message.content.send("yes adds new category")
        }
}