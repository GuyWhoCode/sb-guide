const {dbClient} = require("../mongodb.js")
module.exports = {
    name: "vote",
    async execute(message, args) {
        if (args.length == 0 || args[0] == undefined || args[1] == undefined) return message.channel.send("`g!vote <Candidate Number> <Secret Code>`")
        message.delete()
        if (args[1].trim() != "mayor") return message.channel.send("You have the wrong secret word!")
        if (parseInt(args[0].trim()) < 0 || parseInt(args[0].trim()) > 3) return message.channel.send("That Candidate doesn't exist!")
        let voteDB = dbClient.db("skyblockGuide").collection("voting")
        let findUser = await voteDB.find({"user": message.author.id}).toArray()
        let user = findUser[0]
        if (user != undefined) return message.channel.send("You have already voted!")

        let userEntry = {
            "user": message.author.id,
            "vote": args[0].trim()
        }
        voteDB.insertOne(userEntry)
        message.channel.send("Your vote has been recorded.")
    }
}