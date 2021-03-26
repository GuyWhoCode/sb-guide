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
    checkAliases(aliasList, input) {
        let returnVal = false
        aliasList.map(val => val == input).filter(val => val == true)[0] ? (returnVal = true) : (returnVal = false)
        return returnVal
    },
    linkEmbedConstructor(msg) {
        var objURL = ""
        msg.map(val => val.includes("https://") && val.includes("attachments") ? objURL = val : undefined)
        return {url: objURL}
    },
    timeToMS(time){
        switch(time.split("")[time.length-1]){
            case "h":
                return parseInt(time.split("h")[0]) * 360 * 1000
            case "m":
                return parseInt(time.split("m")[0]) * 60 * 1000
            default:
                return parseInt(time.split("s")[0]) * 1000
        }
    },
    logAction(user, id, action, msg, category){
        let logEntry = {
            color: 0x33998c,
            title: action + " Action",
            fields: [
                {
                    name: user + " (" + id + ") has made a change in `" + category + "`",
                    value: '**Message:**\n ```' + msg + "```",
                },
                ],
            footer: {
                text: 'Skyblock Guides',
                icon_url: "https://i.imgur.com/184jyne.png",
            },
            timestamp: new Date()
        }
        return logEntry
    },
    embedCharCount(embed) {
        let msg = embed.embedMessage
        var charCount = msg.title.length
        msg.fields.map(val => {
            charCount += (val.name.length + val.value.length)
        })
        return charCount
    },
    channelID(channel){
        return channel.split("").slice(2,channel.length-1).join("")
    },
    commandHelpEmbed(name, alias, time, example, result) {
        return {
            color: 0x4ea8de,
            title: `${name}`,
            fields: [
                {
                    name: 'Aliases',
                    value: `${alias.join(", ")}`,
                },
                {
                    name: 'Example',
                    value: `${example}\n\u200b${result}`
                },
                ],
            footer: {
                text: 'Skyblock Guides',
                icon_url: "https://i.imgur.com/184jyne.png",
            },
            timestamp: time
        }
    }
}