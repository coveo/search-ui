const { parallel, series } = require('gulp');
const { buildLegacy } = require('./gulpTasks/legacy');
const { doc } = require('./gulpTasks/doc');
const { setNodeProdEnv } = require('./gulpTasks/nodeEnv');
const { fileTypes } = require('./gulpTasks/filetypes');
const { iconList } = require('./gulpTasks/iconList');
const { buildStrings, testString } = require('./gulpTasks/strings');
const { setup } = require('./gulpTasks/setup');
const { templates } = require('./gulpTasks/templates');
const { compile, compileTSOnly, minimize, analyze } = require('./gulpTasks/compile');
const { definitions, validateDefs } = require('./gulpTasks/definition');
const { dev, devTest, devAccessibilityTest } = require('./gulpTasks/dev');
const { zipForGitReleases, zipForVeracode } = require('./gulpTasks/zip');
const { coverage, uploadCoverage, unitTests, accessibilityTests } = require('./gulpTasks/test');
const { docsitemap } = require('./gulpTasks/docsitemap');
const { injectVersion } = require('./gulpTasks/injectVersion');

const src = series(compile, definitions);

const build = series(setNodeProdEnv, parallel(fileTypes, iconList, setup, templates), buildStrings, src);

const defaultTask = parallel(buildLegacy, build, doc);

exports.default = defaultTask;
exports.compileTSOnly = compileTSOnly;
exports.minimize = minimize;
exports.analyze = analyze;
exports.validateDefs = validateDefs;
exports.dev = dev;
exports.devTest = devTest;
exports.devAccessibilityTest = devAccessibilityTest;
exports.zipForGitReleases = zipForGitReleases;
exports.zipForVeracode = zipForVeracode;
exports.coverage = coverage;
exports.uploadCoverage = uploadCoverage;
exports.docsitemap = docsitemap;
exports.doc = doc;
exports.injectVersion = injectVersion;
exports.testString = testString;
exports.unitTests = unitTests;
exports.accessibilityTests = accessibilityTests;
exports.templates = templates;
