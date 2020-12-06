const {dbClient} = require("../mongodb.js")


module.exports = {
    name: "addsection",
    description: "Adds a section to either a Skyblock Guide or a Dungeons Guide",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("`g!addsection <Message ID> <Category Name>`")
        
        let sectionName = args.slice(1, args.length).join(" ").trim()
        if (sectionName.length == 0) return message.channel.send("You need to input a Section Name! See `g!addsection <Message ID> <Category Name>`")
        

		// dbClient.connect(async (err) => {
		// 	let categoryCollection = dbClient.db("skyblockGuide").collection(category)
		// 	var categoryList = await categoryCollection.find({"identifier": section}).toArray()
		// 	var categoryMsg = ""

		// 	categoryList[0].categoriesList.map(val => categoryMsg += "`" + val + "`" + "\n")
		// 	message.channel.send("List of categories for " + section + ":\n" + categoryMsg)
		// })
        message.channel.send("Your section has been added!")
    }
}