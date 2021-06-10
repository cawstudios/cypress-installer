const readlineSync = require('readline-sync');
const {
	copyDirectory,
	deleteFile,
	readFile,
	writeFile,
	getMainProjectPath,
} = require('./fileOperations');

const fs = require('fs');

const { executeCommand, normalizePath } = require('./utility.js');
const PATH = getMainProjectPath();

const configJson = require('./config.json');
const ANGULARJSON_PATH = normalizePath(PATH + '/angular.json');
const PACKGEJSON_PATH = normalizePath(PATH + '/package.json');
const CYPRESSJSON_PATH = normalizePath(PATH + '/cypress.json');

const promptInstallCoverageAngular = () => {
	const reply = readlineSync.question(configJson['question']['promptCoverage']);
	if (reply === 'y') {
		const packageJson = readFile(PACKGEJSON_PATH);
		const angularJson = readFile(ANGULARJSON_PATH);

		executeCommand(configJson['commands']['installNgx-build-plus']);
		executeCommand(configJson['commands']['installIstanbul']);
		executeCommand(configJson['commands']['installCoverage']);

		angularJson['projects'][packageJson['name']]['architect']['serve'][
			'builder'
		] = configJson['serve']['builder'];
		angularJson['projects'][packageJson['name']]['architect']['serve'][
			'options'
		] = configJson['serve']['options'];
		writeFile(ANGULARJSON_PATH, angularJson);

		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'coverage.webpack.js'
			),
			normalizePath(PATH, 'cypress/coverage.webpack.js')
		);
		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'cy-ts-preprocessor.js'
			),
			normalizePath(PATH, 'cypress/plugins/cy-ts-preprocessor.js')
		);
		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'plugins/index.ts'
			),
			normalizePath(PATH, 'cypress/plugins/index.ts')
		);
		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'support/index.ts'
			),
			normalizePath(PATH, 'cypress/support/index.ts')
		);
	}
};

const promptUninstallKarma = () => {
	const replyKarma = readlineSync.question(
		'Do you want to uninstall karma(y/N):'
	);
	if (replyKarma.toLocaleLowerCase() === 'y') {
		const angularJson = readFile(ANGULARJSON_PATH);
		const packageJson = readFile(PACKGEJSON_PATH);

		//Uninstall karma
		executeCommand(configJson['commands']['uninstallKarma']);
		deleteFile(`${PATH}${configJson['filePath']['karmaConf']}`);
		deleteFile(`${PATH}${configJson['filePath']['test.ts']}`);

		//remove test config in angular Json
		delete angularJson['projects'][packageJson['name']]['architect']['test'];
		writeFile(ANGULARJSON_PATH, angularJson);
	}
};

const promptUninstallProtractor = () => {
	const reply = readlineSync.question(
		configJson['question']['angularProtractorPrompt']
	);
	if (reply.toLowerCase() === 'y') {
		executeCommand('npm uninstall protractor');
		deleteFile(normalizePath(PATH, 'protractor.conf.js'));
	}
};

const promptInstallConcurrently = (framework) => {
	const concurrentlyReply = readlineSync.question(
		configJson['question']['promptConcurrently']
	);

	if (concurrentlyReply.toLocaleLowerCase() === 'y') {
		executeCommand(configJson['commands']['installConcurrently']);
		const packageJson = readFile(PACKGEJSON_PATH);
		packageJson['scripts']['cypress'] =
			'concurrently "ng serve" "cypress open"';
		if (framework === 'React') {
			packageJson['scripts']['cypress'] =
				'concurrently "npm start" "cypress open"';
		}
		writeFile(PACKGEJSON_PATH, packageJson);
	}
};

const promptInstallCoverageReact = () => {
	const reply = readlineSync.question(configJson['question']['promptCoverage']);
	if (reply === 'y') {
		executeCommand(configJson['commands']['installCypressIntrumentation']);
		executeCommand(configJson['commands']['installEslintCypress']);
		executeCommand(configJson['commands']['installNpmRunAll']);
		executeCommand(configJson['commands']['installCodeCoverageReact']);
		const packageJson = readFile(PACKGEJSON_PATH);
		packageJson['scripts']['start'] = configJson['reactScripts']['start'];
		packageJson['scripts']['start-intr'] =
			configJson['reactScripts']['start-intr'];
		packageJson['scripts']['dev'] = configJson['reactScripts']['dev'];
		packageJson['scripts']['cypress'] =
			'concurrently "npm start" "cypress open"';
		packageJson['eslintConfig'] = configJson['reactEslintConfig'];

		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'support/index.ts'
			),
			normalizePath(PATH, 'cypress/support/index.ts')
		);
		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'react/plugins/index.ts'
			),
			normalizePath(PATH, 'cypress/plugins/index.ts')
		);
		writeFile(PACKGEJSON_PATH, packageJson);
	}
};

const promptComponentTestReact = () => {
	const reply = readlineSync.question(
		configJson['question']['promptComponentTestReact']
	);
	if (reply === 'y') {
		executeCommand(configJson['commands']['installComponentTestReact']);

		const cypressJson = readFile(CYPRESSJSON_PATH);
		cypressJson['componentFolder'] = 'src';
		cypressJson['testFiles'] = '**/*.spec.{js,ts,jsx,tsx}';
		writeFile(CYPRESSJSON_PATH, cypressJson);

		const packageJson = readFile(PACKGEJSON_PATH);
		packageJson['scripts']['ct:open'] = 'cypress open-ct';
		packageJson['scripts']['ct:run'] = 'cypress run-ct';
		writeFile(PACKGEJSON_PATH, packageJson);

		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'react/componentIndex.ts'
			),
			normalizePath(PATH, 'cypress/plugins/index.ts')
		);

		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'react/App.spec.js'
			),
			normalizePath(PATH, 'src/App.spec.js')
		);
	}
};

const promptInstallCoverageVue = () => {
	const reply = readlineSync.question(configJson['question']['promptCoverage']);

	if (reply === 'y') {
		executeCommand(configJson['commands']['installBabelIstanbul']);
		executeCommand(configJson['commands']['installCodeCoverageVue']);

		const babelconfig = require(normalizePath(PATH, 'babel.config.js'));
		if (babelconfig['plugins'])
			babelconfig['plugins'].push('babel-plugin-istanbul');
		else babelconfig['plugins'] = ['babel-plugin-istanbul'];

		fs.writeFileSync(
			normalizePath(PATH, 'babel.config.js'),
			'module.exports=' + JSON.stringify(babelconfig) + ';'
		);

		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'vue/plugins/index.ts'
			),
			normalizePath(PATH, 'cypress/plugins/index.ts')
		);
		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-coverage'],
				'support/index.ts'
			),
			normalizePath(PATH, 'cypress/support/index.ts')
		);
	}
};

const promptInstallMochaReport = () => {
	const reply = readlineSync.question(
		configJson['question']['promptMochaReport']
	);

	if (reply === 'y') {
		executeCommand(configJson['commands']['installMochaReport']);
		const packageJson = readFile(PACKGEJSON_PATH);

		packageJson['scripts']['remove-reports'] =
			configJson['mochaReportScripts']['remove-reports'];
		packageJson['scripts']['merge:reports'] =
			configJson['mochaReportScripts']['merge:reports'];
		packageJson['scripts']['create:html:report'] =
			configJson['mochaReportScripts']['create:html:report'];
		packageJson['scripts']['generate:html:report'] =
			configJson['mochaReportScripts']['generate:html:report'];
		writeFile(PACKGEJSON_PATH, packageJson);
		copyDirectory(
			normalizePath(
				PATH,
				configJson['filePath']['cypress-installer'],
				'mocha-report/index.ts'
			),
			normalizePath(PATH, 'cypress/support/index.ts')
		);

		const cypressJson = readFile(CYPRESSJSON_PATH);
		cypressJson['screenshotsFolder'] = 'test-reports/assets';
		cypressJson['videosFolder'] = 'test-reports/assets';
		cypressJson['reporter'] = '../node_modules/mochawesome/src/mochawesome.js';
		cypressJson['reporterOptions'] = {
			overwrite: false,
			html: false,
			json: true,
		};
		writeFile(CYPRESSJSON_PATH, cypressJson);
	}
};

exports.promptInstallCoverageAngular = promptInstallCoverageAngular;
exports.promptUninstallProtractor = promptUninstallProtractor;
exports.promptInstallConcurrently = promptInstallConcurrently;

exports.promptInstallCoverageReact = promptInstallCoverageReact;
exports.promptComponentTestReact = promptComponentTestReact;

exports.promptInstallCoverageVue = promptInstallCoverageVue;

exports.promptInstallMochaReport = promptInstallMochaReport;
exports.ANGULARJSON_PATH = ANGULARJSON_PATH;
exports.PACKGEJSON_PATH = PACKGEJSON_PATH;
exports.CYPRESSJSON_PATH = CYPRESSJSON_PATH;
