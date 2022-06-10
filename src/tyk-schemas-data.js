// TykSchemas includes schema configurations for Tyk Products.
const TykSchemas = [
    {
        "fileMatch": [
            "tyk.*.conf"
        ],
        "url": "https://raw.githubusercontent.com/letzya/tyk-schemas/main/schema_tyk.oss.conf"
    },
    {
        "fileMatch": [
            "apikey.*.json"
        ],
        "url": "https://raw.githubusercontent.com/letzya/tyk-schemas/main/schema_apikey.json"
    },
    {
        "fileMatch": [
            "apidef.*.json"
        ],
        "url": "https://raw.githubusercontent.com/letzya/tyk-schemas/main/schema_apidef_lean.json"
    },
]

module.exports = TykSchemas