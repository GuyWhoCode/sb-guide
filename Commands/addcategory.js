const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbADMIN:"+ process.env.password + "@guide-info.e5dr4.mongodb.net/skyblockGuide?retryWrites=true&w=majority";
const dbClient = new mongoClient(uri, { useNewUrlParser: true })


const sbAlias = ["sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock']
const dAlias = ["d", "dungeons", "dung", "Dungeons", "D"]

const categorySchema = {
  "embedMessage": {},
  "categoryTitle": "placeholder",
  "messageID": "placeholder"
}

const makeNewEntry = (msg, title, id) => {
  let entry = Object.create(categorySchema)
  entry.embedMessage = msg
  entry.categoryTitle = title
  entry.messageID = id
  return entry
}

const checkAliases = (para, input) => {
    let returnVal = false
    para.map(val => val == input).filter(val => val == true)[0] ? (returnVal = true) : (returnVal = false)
    return returnVal
}

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
      var categoryChannel = ""
      var msgID = ""
      var category = args[0]
      if (category != "sb" && category != "d") return message.channel.send("You are missing an argument! Please use the right format. `g!addcategory [category] [Category Name]`")
      
      let categoryName = args.slice(1, args.length).join(" ").trim()
      if (categoryName.length == 0) return message.channel.send("You need to input a Category Name! See `g!addcategory  [Category Name]`")
      

      categoryEmbed.title = categoryName
  
      if (checkAliases(sbAlias, category)) {
        category = "Skyblock"
        categoryChannel = message.guild.channels.cache.find(ch => ch.name === "skyblock-guide")
        categoryEmbed.color = 0x87d8fa
        categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!sbsuggest <Suggestion>`!"
      } else if (checkAliases(dAlias, category)) {
        category = "Dungeons"
        categoryChannel = message.guild.channels.cache.find(ch => ch.name === "dungeons-guide-n-tips")
        categoryEmbed.color = 0xcc0000
        categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!dsuggest <Suggestion>`!"
      } else if (category == "u") {
        category = "Update Tips"
        
      }
      
      categoryChannel.send({ embed: categoryEmbed }).then(msg => msgID = msg.id)

      dbClient.connect( async(err)=> {
        let database = dbClient.db("skyblockGuide")
        let categoryDB = database.collection(category)
        
        let newEntry = makeNewEntry(categoryEmbed, categoryName, msgID)
        categoryDB.insertOne(newEntry)

        let categoryList = await categoryDB.find({"identifier": category}).toArray()
        let identifierName = category+"Categories"
        let oldCategoryList = categoryList[0][identifier]
        
        categoryDB.updateOne({"identifier": category}, {#set: {"identifier": category, identifierName: [... oldCategoryList, categoryName]}})
      })

      message.channel.send("Your category has been created!")
      }
}