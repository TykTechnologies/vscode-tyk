# VS Code Tyk extension

[Tyk Schemas VS Code extension](https://marketplace.visualstudio.com/items?itemName=TykTechnologiesLimited.tyk-schemas) validates Tyk JSON schemas for various JSON objects/files used by Tyk products.
This extension can help you write and validate api definition, keys and config files with [VS Code IntelliSense] (https://code.visualstudio.com/docs/editor/intellisense) which validates and autocomplete the required and optional fields and also provides default values and examples to make your work with Tyk faster and easier. This way you can avoid the back&forth copy+amend code snippet from the docs and start using Tyk natively as a language.

## Installing Tyk Schemas Extension
Click on the "install" button, like you would with any other extension

## Supported Tyk objects or file formats

For supported file formats and schemas list, check the "Feature Contribution" section in the VS Code extension

<img width="1244" alt="image" src="https://user-images.githubusercontent.com/3155222/194719459-2b023e04-18ab-4d03-b638-6dea15161d1c.png">

All the schemas used by Tyk Schemas extension are taken from [tyk-schemas](https://github.com/tykTechnologies/tyk-schemas) repository. Please refer to it for details on the provided schemas (or to suggest improvements and report bugs).

The repository that underlies this extention is [vscode-tyk](https://github.com/TykTechnologies/vscode-tyk) - please use it to report bugs or request features such as more file formats. 


## Using Tyk Schemas Extension

Once [Tyk Schemas extension](https://marketplace.visualstudio.com/items?itemName=TykTechnologiesLimited.tyk-schemas) is installed, you are ready to start using it. 
The only requiremnt is to name the file in the following format:
- `tyk*.conf` - For Tyk gateway config file
- `apikey*.json`	For tyk gateway keys files/payloads
- `apidef*.json`, `TykDefinition*.json` - For Tyk API definition files/payloads
- `oasapidef*.json`, `TykOasApiDef*.json` - For Tyk OAS API definition files/payloads

As you can see below, when you name the file in the right format you'll see a pop up window with suggestion to auto-complete just as it would with any programing language. If you can't see the pop up click `control`+`space`.

<img width="1371" alt="image" src="https://user-images.githubusercontent.com/3155222/194720523-6c6655f7-a12b-4dbe-876b-7d3f8ebd780c.png">


### Creating and testing new schemas

In some cases, you'd want to add your own schemas or maybe add schemas from our schemas repo that have not been published to the VS Code extension just yet.
In this case, you can add the URL to the `setting.json` file in VS Code (in MacOS open via `Preferences`), reload the window and start using the schema.
Example of the code you need to add to the `setting.json` file

```json
"json.schemas": [
        {
            "fileMatch": [
                "tyk.*.conf"
            ],
            "url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/v0.1/JSON/draft-07/schema_tyk.oss.conf",
        },
```

Cases for which you might need to do that:
1. A new schema in tyk-schemas repo that has not yet been published to the Tyk VS Code extension
2. An existing schema in tyk-schemas repo that is not planned to be published to the Tyk VS Code extension, since it's a special use case but you are interested in using it to validate your Tyk objects/files.
3. A schema that you forked and want to test.


## Community

This project is taking it's first steps in the world. If you find any defects, please raise an [issue](https://github.com/TykTechnologies/vscode-tyk/issues). If you need support for more file formats, please raise an issue as well.
We welcome code contributions as well, both in this repo and in [tyk-schemas](https://github.com/tykTechnologies/tyk-schemas) project.

## Local development

Please see the [quickstart](./vsc-extension-quickstart.md) guideline.
