# VS Code Tyk extension

[Tyk Schemas](https://marketplace.visualstudio.com/items?itemName=TykTechnologiesLimited.tyk-schemas) VS Code extension validates Tyk JSON schemas for various JSON file types used by Tyk products.
This extension can help you write and validate api definition, keys and config files in VS Code with IntelliSense which validates and autocomplete the required and optional fields and also provide default values and examples that are part of the JSON schema standard. This way you can avoid copy+amend code snippt from the docs and start using Tyk natively as a language.

## JSON Schemas

For supported file formats and schemas list, check the "Feature Contribution" section in the VS Code extension

All the schemas used by Tyk Schemas extension are taken from [tyk-schemas](https://github.com/tykTechnologies/tyk-schemas) repository. Please refer to it for details on the provided schemas (or to suggest improvements).



## Running Tyk Schemas Extension

Once [Tyk Schemas](https://marketplace.visualstudio.com/items?itemName=TykTechnologiesLimited.tyk-schemas) extension is installed, you are ready to start using it. 
Tyk Schemas will automatically update the JSON schema preferences of your VS Code.

If you want to run Tyk Schemas manually:
- Open the command palette by pressing (`Ctrl+Shift+P` or `Cmd+Shift+P`),
- Type `Tyk Schemas` and run.

## Community

This project is taking it's first steps in the world. If you find any defects, please raise an [issue](https://github.com/TykTechnologies/vscode-tyk/issues). If you need support for more file formats, please raise an issue as well.
We welcome code contributions as well, both in this repo and in [tyk-schemas](https://github.com/tykTechnologies/tyk-schemas) project.

## Local development

Please see the [quickstart](./vsc-extension-quickstart.md) guideline.
