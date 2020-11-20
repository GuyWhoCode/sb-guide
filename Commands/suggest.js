const suggestionSchema = {
    "title": "placeholder",
    "description": "placeholder",
    "user": "placeholder"
  }
  
  const pingUser = id => {
    return `<@${id}>`
  }
  
  const randomFunc = () => {
    let smth = Object.create(suggestionSchema)
    smth.title = "myTitle"
    smth.description = "myDescription"
    smth.user = pingUser(914534857345)
    console.log(smth)
  }

// module.exports = {
//     name: "suggest",
//     description: "Adds a suggestion"
// }