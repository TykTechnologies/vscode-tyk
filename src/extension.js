const vscode = require('vscode');
const { combineDuplicates, updateUserSchemas } = require('./util');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('tyk-schemas.main', async function () {
		// Set intellisense to work for Tyk's config files and update VSCode to recognize .conf extension as JSON.
		let filesConfiguration = vscode.workspace.getConfiguration("files");
		let associations = filesConfiguration.get("associations");

		if (associations["*.conf"] != "json") {
			try {
				associations["*.conf"] = "json";
				await filesConfiguration.update("associations", associations, vscode.ConfigurationTarget.Global)
			} catch (error) {
				console.error(error)
				vscode.window.showErrorMessage(`Tyk: cannot update files.associations, err: ${error.message}`)
				return
			}
		}

		let JSONSettings = vscode.workspace.getConfiguration("json")
		let userSchemas = JSONSettings.get("schemas")
		if (!userSchemas) {
			vscode.window.showErrorMessage(`Tyk: cannot obtain json.schemas`)
			return
		}

		let schemasUpdated = false;
		userSchemas, schemasUpdated = updateUserSchemas(userSchemas, schemasUpdated)
		userSchemas = combineDuplicates(userSchemas)

		try {
			await JSONSettings.update("schemas", userSchemas, vscode.ConfigurationTarget.Global)
			if (schemasUpdated) {
				vscode.window.showInformationMessage('Tyk: Tyk JSON schemas were added to your setting.json and will now validate and autocomplete your tyk files!');
			}
		} catch (error) {
			console.error(error)
			vscode.window.showErrorMessage(`Tyk: cannot update json.schemas, err: ${error.message}`)
			return
		}
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
	deactivate,
}
