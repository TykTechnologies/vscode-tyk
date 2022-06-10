const vscode = require('vscode');

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
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
