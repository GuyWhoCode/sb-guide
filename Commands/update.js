module.exports = {
    name: "update",
    description: "The latest and greatest for updates coming out!",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("You need to input something! See `g!update <Update Tip>`")
        
        let updateSuggestion = args.join(" ").trim()

        
        message.channel.send("User output: " + updateSuggestion)
    }
}