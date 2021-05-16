const {adEmbed} = require("../constants.js")
module.exports = {
    name: "ad",
    execute(client, message, args) {
        message.channel.send({embed: adEmbed})
    }
}