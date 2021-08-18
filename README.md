# Skyblock Guides
Combines the broad editing tools of game wikipedias and user-reviewed content to create high-quality guides integrated with Discord.
<p align="center"> <img src="https://i.imgur.com/184jyne.png" alt="Guides Logo"/> </p>

# Test it out!
Mock Discord client to show the bot without installing Discord. [Go there](https://sb-guide-site.glitch.me/)
<p align="center"> <img src="https://i.imgur.com/Vxl9BFb.png" alt="Guides Showcase"/> </p>


# Features:
## -- Safety Built in Mind
Originating on a Discord server with over 20,000 people, safety is highly regarded. This repository was made publicly open-source to provide transparency to server-owners and warn of potential risks. This bot utilizes the **Manage Messages Permission** to [delete messages in the wrong channel](https://github.com/GuyWhoCode/sb-guide/blob/33728f9b6b201ecbb0c0d021171fcbac94f9b6e3/server.js#L35) and to update guides by [deleting the respective guide message](https://github.com/GuyWhoCode/sb-guide/blob/b02a33e300de00c46570b7674145e66d8cee118f/post.js#L124)  if necessary (when channel guides are enabled). An optional role called `Guide Locked` can be used to lock users from accessing any aspect of the bot. This role is not included with the bot and must be manually created.

## -- Editing Commands
Anyone can suggest changes to the Guides but must be approved by a Contributor. Contributors have access to a wide variety of editing commands like [edit](https://github.com/GuyWhoCode/sb-guide/blob/main/Commands/edit.js), [approve](https://github.com/GuyWhoCode/sb-guide/blob/main/Commands/approve.js), and [delete](https://github.com/GuyWhoCode/sb-guide/blob/main/Commands/delete.js). Changes can only be made on the hub server of the Skyblock Community (Skycomm). Checks are put into place to prevent Contributors from griefing the guides.

## -- Configurability
A multitude of settings are available for server owners. See the command `g!config` upon inviting the bot. Options are available for larger servers that see a large demand for this bot.
<p align="center"> <img src="https://i.imgur.com/FRmKzOh.png" alt="Guides Logo"/> </p>


### Dependencies:
- Node JS
- Discord JS (Version 12.4)
- File System (Node JS)
- MongoDB 4
- Jaro-Winkler
- Nodemon (local environment testing)
