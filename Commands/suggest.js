module.exports = {
    name: "suggest",
    execute(message, args) {
            // if (category != "sb") return message.channel.send("You are missing an argument! Please use the right format. `g!suggest [category] [suggestion]`")
        message.channel.send("This command has been removed due to not being user friendly. Please use the following commands as a substitute.\n`g!sbsuggest <Suggestion>`- Skyblock Guide Suggestion\n`g!dsuggest <Suggestion>` - Dungeon Guide Suggestion")
    }
}