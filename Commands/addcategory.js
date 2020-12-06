const {dbClient} = require("../mongodb.js")


const sbAlias = ["sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock']
const dAlias = ["d", "dungeons", "dung", "Dungeons", "D", "dungeon", "Dungeon", "Dung"]
const uAlias = ["u", "update", "UPDATE", "Update", "U"]

const categorySchema = {
  "embedMessage": {},
  "categoryTitle": "placeholder",
  "messageID": "placeholder",
  "category": "placeholder"
}

const makeNewEntry = (msg, title, id, category) => {
  let entry = Object.create(categorySchema)
  entry.embedMessage = msg
  entry.categoryTitle = title
  entry.messageID = id
  entry.category = category
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
      if (checkAliases(sbAlias, category) == false && checkAliases(dAlias, category) == false && checkAliases(uAlias, category) == false) return message.channel.send("You are missing an argument! Please use the right format. `g!addcategory <Guide> <Category Name>`")
      
      //Limit the category name / Inform the user to do `g!sbsuggest / g!dsuggest`
      let categoryName = args.slice(1, args.length).join(" ").trim()
      if (categoryName.length == 0) return message.channel.send("You need to input a Guide Name! See `g!addcategory <Guide> <Category Name>`")
      

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
      
      } else if (checkAliases(uAlias, category)) {
        category = "Update Tips"
        categoryChannel = message.guild.channels.cache.find(ch => ch.name === "update-tips")
        categoryEmbed.color = 0xffba00
        categoryEmbed.description = "This is an empty section of the guide. Add some changes to this guide using `g!update <Update Tip>`!"
      }
      
      categoryChannel.send({ embed: categoryEmbed }).then(msg => msgID = msg.id)

      dbClient.connect( async(err)=> {
        let database = dbClient.db("skyblockGuide")
        let guideDB = database.collection("Guides")
        let updateDB = database.collection("Update Tips")

        let newEntry = makeNewEntry(categoryEmbed, categoryName, msgID, category)

        if (category == "Update Tips") {
          updateDB.insertOne(newEntry)
          await updateDB.updateOne({"identifier": category}, {$set: {"identifier": category, "currentMsgId": msgID, "msgObject": categoryEmbed}})
        } else {
          guideDB.insertOne(newEntry)
        }
      })

      message.channel.send("Your category has been created!")
      }
}