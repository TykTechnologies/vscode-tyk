const TykSchemas = require("./tyk-schemas-data")

// ref: https://stackoverflow.com/a/30026006
function combineDuplicates(data) {
    if (!Array.isArray(data)) {
        return undefined
    }

    let seen = {};
    data = data.filter((userSchema) => {
        if (seen.hasOwnProperty(userSchema.url)) {
            let prev = seen[userSchema.url]
            prev.fileMatch.concat(userSchema.fileMatch)

            return false;
        }

        if (!Array.isArray(userSchema.fileMatch) && userSchema.url) {
            userSchema.fileMatch = [];
        }

        seen[userSchema.url] = userSchema;
        return true;
    })

    return data
}

// updateUserSchemas updates given userSchemas, returns updated userSchema and 
// 'updated' boolean that is true in case of userSchemas is updated. If user has already
// a valid Tyk Schemas configuration set in their json.schemas, return same userSchema and 
// 'updated' with its initial value.
function updateUserSchemas(userSchemas, updated) {
    for (let i = 0; i < TykSchemas.length; i++) {
        const tykSchema = TykSchemas[i]
        const exists = userSchemas.some(schema => {
            // if user settings have a URL for Tyk-Schemas url.
            if (schema.url == tykSchema.url) {
                // if user settings do not include the proper file matcher, include it.
                if (!schema.fileMatch.includes(tykSchema.fileMatch[0])) {
                    schema.fileMatch.push(tykSchema.fileMatch[0])
                }

                return true
            }

            return false
        })

        if (!exists) {
            userSchemas.push(tykSchema)
            updated = true;
        }
    }

    return userSchemas, updated
}

module.exports = { combineDuplicates, updateUserSchemas }