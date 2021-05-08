# Skyblock Guides
<p align="center"> <img src="https://i.imgur.com/184jyne.png" alt="Guides Logo"/> </p>

Hypixel Skyblock Guides that updates with the help of the community using a Discord Bot. Unlike a typical game wikipedia, which include everything, only the essentials are included. There is no rigid structure. Not every part can be modeled in simple steps; there are many different ways to play the game. YouTube videos are convenient in providing visuals but can have inaccuracies in the information provided or be outdated. Combining the broad editting tools of Wikipedias and user-reviewed content creates high-quality resources for the community.

# Test it out!
Website coming Soon TM...

# Features:
## -- Safety Built in Mind
Originating on a Discord server with over 19,000 people, safety is important to prevent bad actors and raiders. This bot utilizes the **Manage Messages Permission** to [delete messages in the wrong channel](https://github.com/GuyWhoCode/sb-guide/blob/33728f9b6b201ecbb0c0d021171fcbac94f9b6e3/server.js#L35) and to update guides by deleting the respective guide message if necessary (when channel guides are enabled). An optional role called `Guide Locked` can be used to lock users from accessing any aspect of the bot. This role is not included with the bot but must be manually created.

## -- Editting Commands
Anyone can suggest changes to the Guides and can be approved by a Contributor. Contributors have access to a wide variety of editting commands like [edit](https://github.com/GuyWhoCode/sb-guide/blob/main/Commands/edit.js), [approve](https://github.com/GuyWhoCode/sb-guide/blob/main/Commands/approve.js), and [delete](https://github.com/GuyWhoCode/sb-guide/blob/main/Commands/delete.js). Changes can only be made on the hub server of the Skyblock Community (Skycomm).

## -- Configurability
A multitude of settings are available for server owners. See the command `g!config` upon inviting the bot. Options are available for larger servers that see a large demand for this bot.


### Dependencies:
- Node JS
- Discord JS
- File System (Node JS)
- MongoDB
