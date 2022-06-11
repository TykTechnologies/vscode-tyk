const assert = require('assert');
const { combineDuplicates } = require('../../src/util');

describe('Combine duplicates', () => {
    const schemaTykOSSURL = "https://raw.githubusercontent.com/letzya/tyk-schemas/main/schema_tyk.oss.conf"
    const schemaApiDefLeanURL = "https://raw.githubusercontent.com/letzya/tyk-schemas/main/schema_apidef_lean.json"
    const schemaApiKeyURL = "https://raw.githubusercontent.com/letzya/tyk-schemas/main/schema_apikey.json"

    it('Undefined json.schemas', () => {
        const data = combineDuplicates(undefined)

        assert.ifError(data)
    });

    it('Empty json.schemas', () => {
        const data = combineDuplicates([])

        expect(data).toBeInstanceOf(Array)
        expect(data.length).toEqual(0)
        expect(data).toEqual([])
    });

    it('Duplicated URL that contains one fileMatch', () => {
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

    it('Duplicated URL that contains more than a fileMatch', () => {
        let fileMatch1 = "tyk.*.conf"
        let fileMatch2 = "test_tyk.*.conf"
        let fileMatch3 = "tyk_test.*.conf"
        let data = [
            {
                fileMatch: [
                    fileMatch1, fileMatch3
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

    it('Duplicated URL that contains more than a same fileMatch', () => {
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

    it('Duplicated URL that contains an invalid fileMatch', () => {
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

    it('Duplicated URL that contains more than one invalid fileMatch', () => {
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

    it('Duplicated URL with different URLs, that contains more than one invalid fileMatch', () => {
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
