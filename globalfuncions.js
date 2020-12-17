const {categorySchema, suggestionSchema} = require("./constants.js")
  
module.exports = {
    translateCategoryName(name) {
        if (name.includes("_")) {
            return name.split("_").join(" ")
        } else if (name.includes("-")) {
            return name.split("-").join(" ")
        } else {
            return name
        }
    },
    createNewEntry(section, desc, msgID, user) {
        let entry = Object.create(suggestionSchema)
        entry.section = section
        entry.description = desc
        entry.messageID = msgID
        entry.user = user
        return entry
    },
    makeNewEntry(msg, title, id, category) {
        let entry = Object.create(categorySchema)
        entry.embedMessage = msg
        entry.categoryTitle = title
        entry.messageID = id
        entry.category = category
        return entry
    },
    checkAliases(para, input) {
        let returnVal = false
        para.map(val => val == input).filter(val => val == true)[0] ? (returnVal = true) : (returnVal = false)
        return returnVal
    }
}