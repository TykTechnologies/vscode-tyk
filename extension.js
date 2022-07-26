// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tyk-schemas" is now active!');

	const TykSchemas = [
		{
			"fileMatch": [
				"tyk.*.conf"
			],
			"url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/v0.1/JSON/draft-07/schema_tyk.oss.conf",
			"addedBy": "tyk"
		},
		{
			"fileMatch": [
				"apikey.*.json"
			],
			"url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/v0.1/JSON/draft-07/schema_apikey.json",
			"addedBy": "tyk"
		},
		{
			"fileMatch": [
				"apidef.*.json",
				"TykAPIDef-*.json",
			],
			"url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/v0.1/JSON/draft-07/schema_apidef_lean.json",
			"addedBy": "tyk"
		},
		{
			"fileMatch": [
				"oasapidef.*.json",
				"TykOasApiDef-*.json"
			],
			"url": "https://raw.githubusercontent.com/TykTechnologies/tyk-schemas/v0.1/JSON/draft-04/schema_TykOasApiDef_3.0.x.json",
			"addedBy": "tyk"
		}
	]

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tyk-schemas.main', async function () {
		// The code you place here will be executed every time your command is executed

		// Set intellisense to work for Tyk's config files and update VSCode to recognice .conf 
		// extension as json.
		let filesConfiguration = vscode.workspace.getConfiguration("files");
		let associations = filesConfiguration.get("associations");

		associations["*.conf"] = "json";

		console.log("updating files.associations")
		try {
			await filesConfiguration.update("associations", associations, vscode.ConfigurationTarget.Global)
		} catch (error) {
			console.error(error)
			vscode.window.showErrorMessage(`Tyk: cannot update files.associations, err: ${error.message}`)
			return
		}
		console.log("done!")

		let JSONSettings = vscode.workspace.getConfiguration("json")
		let schemas = JSONSettings.get("schemas");

		for (let i = 0; i < TykSchemas.length; i++) {
			const currSchema = TykSchemas[i]
			const exists = schemas.some(schema => {
				// if user settings have a URL for Tyk-Schemas url.
				if (schema.url == currSchema.url) {
					// if user settings do not include the proper file matcher, include it.
					if (!schema.fileMatch.includes(currSchema.fileMatch[0])) {
						schema.fileMatch.push(currSchema.fileMatch[0])
					}
					return true
				}
				return false
			})

			if (!exists) {
				schemas.push(currSchema)
			}
		}

		console.log("updating json.schemas")
		try {
			await JSONSettings.update("schemas", schemas, vscode.ConfigurationTarget.Global)
		} catch (error) {
			vscode.window.showErrorMessage(`Tyk: cannot update json.schemas, err: ${error.message}`)
			return
		}
		console.log("done!")

		// Display a message box to the user
		vscode.window.showInformationMessage('Tyk: Tyk JSON schemas were added to your setting.json and will now validate and autocomplete your tyk files!');
	});

	context.subscriptions.push(disposable);
	vscode.commands.executeCommand("tyk-schemas.main");
}

// this method is called when your extension is deactivated
function deactivate() {
	let JSONSettings = vscode.workspace.getConfiguration("json")
	if (JSONSettings.has("schemas")) {
		let schemas = JSONSettings.get("schemas");
		schemas = schemas.filter(schema => schema.addedBy !== "tyk");
		JSONSettings.update("schemas", schemas, vscode.ConfigurationTarget.Global).then(() => {
			window.showInformationMessage('Uninstalled tyk validator');
			console.log("deactivated tyk extension!")
		})
	}
}

module.exports = {
	activate,
	deactivate
}
