module.exports = {
    translateCategoryName(name) {
        if (name.includes("_")) {
            return name.split("_").join(" ")
        } else if (name.includes("-")) {
            return name.split("-").join(" ")
        } else {
            return name
        }
    }
}