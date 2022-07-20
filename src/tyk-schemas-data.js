// TykSchemas includes schema configurations for Tyk Products.
const TykSchemas = [
    {
        "fileMatch": [
            "tyk.*.conf"
        ],
        "url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/main/JSON/draft-07/schema_tyk.oss.conf",
        "addedBy": "tyk"
    },
    {
        "fileMatch": [
            "apikey.*.json"
        ],
        "url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/main/JSON/draft-07/schema_apikey.json",
        "addedBy": "tyk"
    },
    {
        "fileMatch": [
            "apidef.*.json",
            "TykDefinition-*.json"
        ],
        "url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/main/JSON/draft-07/schema_apidef_lean.json",
        "addedBy": "tyk"
    },
    {
        "fileMatch": [
            "oasapidef.*.json",
            "TykOasApiDef-*.json"
        ],
        "url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/main/JSON/draft-04/schema_apidefoas.json",
        "addedBy": "tyk"
    }
]

module.exports = TykSchemas