const {adEmbed} = require("../constants.js")
module.exports = {
    name: "ad",
    execute(message, args) {
        let ad = adEmbed
        ad.fields.push({name: "_ _", value: "**Powered by the [Skyblock Community](https://discord.com/invite/hysky)**"})
        message.channel.send({embed: ad})
    }
}