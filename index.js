#!/usr/bin/env node

const readlineSync = require('readline-sync');
const {
	promptInstallCoverageAngular,
	promptUninstallProtractor,
	promptInstallConcurrently,
	promptInstallCoverageReact,
	promptComponentTestReact,
	promptInstallCoverageVue,
	promptInstallMochaReport,
} = require('./src/prompt');

const { executeCommand } = require('./src/utility.js');

const {
	addCypressScripts,
	configCypressDirectory,
} = require('./src/cypressConfig.js');
const config = require('./src/config.json');

const FRAMEWORKS = ['Angular', 'React', 'Vue'];

try {
	const reply = readlineSync.question(config['question']['cypressPrompt']);

	if (reply === 'y') {
		executeCommand(config['commands']['installCypress']);
		const index = readlineSync.keyInSelect(FRAMEWORKS, 'Which framework?');
		switch (index) {
			case 0:
				configCypressDirectory('Angular');
				addCypressScripts();
				promptUninstallProtractor();
				promptInstallConcurrently();
				promptInstallCoverageAngular();
				promptInstallMochaReport();
				break;
			case 1:
				configCypressDirectory('React');
				addCypressScripts();
				promptInstallConcurrently('React');
				promptInstallCoverageReact();
				promptComponentTestReact();
				promptInstallMochaReport();
				break;
			case 2:
				configCypressDirectory('Vue');
				addCypressScripts();
				promptInstallCoverageVue();
				promptInstallMochaReport();
				break;
			default:
				process.exit(0);
		}
	} else process.exit(0);
} catch (error) {
	console.log(error);
}
