const {adEmbed} = require("../constants.js")
module.exports = {
    name: "ad",
    execute(message, args) {
        message.channel.send({embed: adEmbed})
    }
}