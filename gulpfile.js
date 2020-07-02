const { parallel, series } = require('gulp');
const requireDir = require('require-dir');
const runsequence = require('run-sequence');
const { buildLegacy } = require('./gulpTasks/legacy');
const { doc } = require('./gulpTasks/doc');
const { linkGitHooks } = require('./gulpTasks/linkGitHooks');
const { setNodeProdEnv } = require('./gulpTasks/nodeEnv');
const { fileTypes } = require('./gulpTasks/filetypes');
const { iconList } = require('./gulpTasks/iconList');
const { buildStrings } = require('./gulpTasks/strings');
const { setup } = require('./gulpTasks/setup');
const { templates } = require('./gulpTasks/templates');
const { compile, compileTSOnly, minimize, analyze } = require('./gulpTasks/compile');
const { definitions, validateDefs } = require('./gulpTasks/definition');

requireDir('./gulpTasks');

const src = series(compile, definitions);

const build = series(parallel(linkGitHooks, setNodeProdEnv), parallel(fileTypes, iconList, setup, templates), buildStrings, src);

const defaultTask = parallel(buildLegacy, build, doc);

exports.default = defaultTask;
exports.compileTSOnly = compileTSOnly;
exports.minimize = minimize;
exports.analyze = analyze;
exports.validateDefs = validateDefs;
