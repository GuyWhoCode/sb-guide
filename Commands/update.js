const {dbClient} = require("../mongodb.js")

module.exports = {
    name: "update",
    description: "The latest and greatest for updates coming out!",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("You need to input something! See `g!update <Update Tip>`")
        
        let updateSuggestion = args.join(" ").trim()

        dbClient.connect(async (err) => {
            let updateDB = dbClient.db("skyblockGuide").collection("Update Tips")
            let findUpdateMsg = await updateDB.find({"identifier": "Update Tips"}).toArray()

            let updateMsg = findUpdateMsg[0].msgObject
            message.channel.send({embed: updateMsg})
        })

        message.channel.send("User output: " + updateSuggestion)
    }
}