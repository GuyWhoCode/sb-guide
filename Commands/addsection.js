const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true })


const sbAlias = ["sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock']
const dAlias = ["d", "dungeons", "dung", "Dungeons", "D", "dungeon", "Dungeon", "Dung"]

const checkAliases = (para, input) => {
    let returnVal = false
    para.map(val => val == input).filter(val => val == true)[0] ? (returnVal = true) : (returnVal = false)
    return returnVal
}

module.exports = {
    name: "addsection",
    description: "Adds a section to either a Skyblock Guide or a Dungeons Guide",
    execute(message, args) {
        if (args.length == 0) return message.channel.send("`g!addsection <Category> <Section Name>`")
        
        var category = args[0]
        if (checkAliases(sbAlias, category) == false && checkAliases(dAlias, category) == false) return message.channel.send("Please specify the category. `g!addsection <Category> <Section Name>`")
        
        let sectionName = args.slice(1, args.length).join(" ").trim()
        if (sectionName.length == 0) return message.channel.send("You need to input a Category Name! See `g!addcategory <Category> <Category Name>`")
        
        if (checkAliases(sbAlias, section)) section = "Skyblock"
		if (checkAliases(dAlias, section)) section = "Dungeons"

		// dbClient.connect(async (err) => {
		// 	let categoryCollection = dbClient.db("skyblockGuide").collection(section)
		// 	var categoryList = await categoryCollection.find({"identifier": section}).toArray()
		// 	var categoryMsg = ""

		// 	categoryList[0].categoriesList.map(val => categoryMsg += "`" + val + "`" + "\n")
		// 	message.channel.send("List of categories for " + section + ":\n" + categoryMsg)
		// })
        message.channel.send("Your section has been added!")
    }
}