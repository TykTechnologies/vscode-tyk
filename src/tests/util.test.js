const assert = require('assert');
const exp = require('constants');
const { combineDuplicates, updateUserSchemas } = require('../../src/util');
const TykSchemas = require("../tyk-schemas-data")

const schemaTykOSSURL = TykSchemas[0].url;
const schemaApiKeyURL = TykSchemas[1].url;
const schemaApiDefLeanURL = TykSchemas[2].url;
const schemaOASURL = TykSchemas[3].url;

describe('Combine duplicates', () => {
    it('Combine undefined json.schemas', () => {
        const data = combineDuplicates(undefined)

        assert.ifError(data)
    });

    it('Combine empty json.schemas', () => {
        const data = combineDuplicates([])

        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(0)
        expect(data).toEqual([])
    });

    it('Combine duplicated URL that contains one fileMatch', () => {
        let fileMatch1 = "tyk.*.conf"
        let fileMatch2 = "test_tyk.*.conf"
        let data = [
            {
                fileMatch: [
                    fileMatch1,
                ],
                url: schemaTykOSSURL
            },
            {
                fileMatch: [
                    fileMatch2,
                ],
                url: schemaTykOSSURL
            }
        ]

        data = combineDuplicates(data)

        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(1)

        expect(data[0]).toHaveProperty("url")
        expect(data[0]).toHaveProperty("fileMatch")
        expect(data[0]).toMatchObject({
            url: schemaTykOSSURL
        })

        expect(data[0].fileMatch).toBeInstanceOf(Array)
        expect(data[0].fileMatch.length).toEqual(2)
        expect(data[0].fileMatch).toEqual(expect.arrayContaining([fileMatch1, fileMatch2]))
    });

    it('Combine duplicated URL that contains multiple fileMatch types', () => {
        let fileMatch1 = "tyk.*.conf"
        let fileMatch2 = "test_tyk.*.conf"
        let fileMatch3 = "tyk_test.*.conf"
        let data = [
            {
                fileMatch: [
                    fileMatch1, fileMatch3, fileMatch2
                ],
                url: schemaTykOSSURL
            },
            {
                fileMatch: [
                    fileMatch2,
                ],
                url: schemaTykOSSURL
            }
        ]

        data = combineDuplicates(data)

        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(1)

        expect(data[0]).toHaveProperty("url")
        expect(data[0]).toHaveProperty("fileMatch")
        expect(data[0]).toMatchObject({
            url: schemaTykOSSURL
        })

        expect(data[0].fileMatch).toBeInstanceOf(Array)
        expect(data[0].fileMatch.length).toEqual(3)
        expect(data[0].fileMatch).toEqual(expect.arrayContaining([fileMatch1, fileMatch2, fileMatch3]))
    });

    it('Combine duplicated URL with one missing fileMatch', () => {
        let fileMatch1 = "tyk.*.conf"
        let data = [
            {
                url: schemaTykOSSURL
            },
            {
                fileMatch: [
                    fileMatch1,
                ],
                url: schemaTykOSSURL
            }
        ]

        data = combineDuplicates(data)

        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(1)

        expect(data[0]).toHaveProperty("url")
        expect(data[0]).toHaveProperty("fileMatch")
        expect(data[0]).toMatchObject({
            url: schemaTykOSSURL
        })

        expect(data[0].fileMatch).toBeInstanceOf(Array)
        expect(data[0].fileMatch.length).toEqual(1)
        expect(data[0].fileMatch).toEqual(expect.arrayContaining([fileMatch1]))
    });

    it('Combine duplicated URL with missing fileMatch for all', () => {
        let data = [
            {
                url: schemaTykOSSURL
            },
            {
                url: schemaTykOSSURL
            }
        ]

        data = combineDuplicates(data)

        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(1)

        expect(data[0]).toHaveProperty("url")
        expect(data[0]).toHaveProperty("fileMatch")
        expect(data[0]).toMatchObject({
            url: schemaTykOSSURL
        })

        expect(data[0].fileMatch).toBeInstanceOf(Array)
        expect(data[0].fileMatch.length).toEqual(1)
        expect(data[0].fileMatch).toEqual([])
    });

    it('Combine duplicated URLs with one missing fileMatch', () => {
        let fileMatch1 = "tyk.*.conf"
        let fileMatch2 = "test_tyk.*.conf"
        let fileMatch3 = "tyk_test.*.conf"

        let data = [
            {
                url: schemaTykOSSURL
            },
            {
                url: schemaTykOSSURL,
                fileMatch: [fileMatch1],
            },
            {
                url: schemaApiDefLeanURL,
                fileMatch: [fileMatch2, fileMatch3],
            },

        ]

        // after combining duplicates, the expected data is:
        // [{url: schemaTykOSSURL, fileMatch: [fileMatch1]}, {url: schemaApiDefLeanURL, fileMatch: [fileMatch2, fileMatch3]}]
        data = combineDuplicates(data)

        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(2)

        expect(data[0]).toHaveProperty("url")
        expect(data[0]).toHaveProperty("fileMatch")
        expect(data[0]).toMatchObject({
            url: schemaTykOSSURL
        })
        expect(data[0].fileMatch).toBeInstanceOf(Array)
        expect(data[0].fileMatch.length).toEqual(1)
        expect(data[0].fileMatch).toEqual(expect.arrayContaining([fileMatch1]))

        expect(data[1]).toHaveProperty("url")
        expect(data[1]).toHaveProperty("fileMatch")
        expect(data[1]).toMatchObject({
            url: schemaApiDefLeanURL,
        })
        expect(data[1].fileMatch).toBeInstanceOf(Array)
        expect(data[1].fileMatch.length).toEqual(2)
        expect(data[1].fileMatch).toEqual(expect.arrayContaining([fileMatch2, fileMatch3]))
    });
});

describe('Main execution', () => {
    const fileMap = ['tyk.*.conf', 'apikey.*.json', 'apidef.*.json', "oasapidef.*.json"]
    const URLMap = [schemaTykOSSURL, schemaApiKeyURL, schemaApiDefLeanURL, schemaOASURL]

    it('Update empty json.schemas', () => {
        let userSchemas = []
        let data, schemasUpdated = updateUserSchemas(userSchemas);
        data = combineDuplicates(userSchemas);

        expect(schemasUpdated).toEqual(true)
        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(4)

        for (let i = 0; i < fileMap.length; i++) {
            expect(data[i]).toHaveProperty("url")
            expect(data[i]).toHaveProperty("fileMatch")
            expect(data[i]).toMatchObject({
                url: URLMap[i],
            })

            expect(data[i].fileMatch).toBeInstanceOf(Array)
            expect(data[i].fileMatch).toEqual(expect.arrayContaining([fileMap[i]]))
        }
    });

    it('Update existing json.schemas', () => {
        let userSchemas = [
            {
                fileMatch: [
                    "temp.file"
                ],
                url: "temp.url"
            },
        ]
        let data, schemasUpdated = updateUserSchemas(userSchemas);
        data = combineDuplicates(userSchemas);

        expect(schemasUpdated).toEqual(true)
        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(5)

        let counter = 0;
        for (let i = 1; i < fileMap.length; i++) {
            expect(data[i]).toHaveProperty("url")
            expect(data[i]).toHaveProperty("fileMatch")
            expect(data[i]).toMatchObject({
                url: URLMap[counter],
            })

            expect(data[i].fileMatch).toBeInstanceOf(Array)
            expect(data[i].fileMatch).toEqual(expect.arrayContaining([fileMap[counter]]))
            counter += 1;
        }
    });
})