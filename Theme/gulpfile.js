/*jshint esversion: 6 */
'use strict';

const fs = require('fs');
const path = require('path');
const HelpDisplay = require('./gulp/extension-mechanism/HelpDisplay');
const gulp = require('gulp');
const nsArgs = require('ns-args');

nsArgs.addHiddenParam('product', 'gulp');
const configurations = require('./gulp/extension-mechanism/configurations');

process.gulp_init_cwd = process.env.INIT_CWD || process.cwd();
process.gulp_dest = process.gulp_init_cwd;

const config = configurations.getConfigs();

const themeInitTasks = ['theme:update-manifest', 'theme:local', 'theme:deploy'];
const extInitTasks = ['extension:update-manifest', 'extension:local', 'extension:deploy'];
const initTasks = ['update-manifest', 'check-dart-sass', ...(config.extensionMode ? extInitTasks : themeInitTasks)];

if (initTasks.indexOf(process.argv[2]) !== -1)
{
	require('./gulp/extension-mechanism/init')();
}

// evaluate all gulp tasks files
var baseTaskDir = path.resolve(__dirname, './gulp/tasks');
fs.readdirSync(baseTaskDir).forEach(function(task_name)
{
	if (/\.js/.test(task_name))
	{
		require(path.join(baseTaskDir, task_name.replace('.js', '')));
	}
});

/**
 * This simply defines help task which would produce usage
 * display for this gulpfile.
 */
gulp.task('help', async function()
{
	return new HelpDisplay();
});
gulp.task('default', gulp.parallel('help'));
