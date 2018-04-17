const _ = require("lodash");
const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

const eslint = require("rollup-plugin-eslint");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const rootImport = require("rollup-plugin-root-import");
const handlebars = require("rollup-plugin-handlebars-plus");
const json = require("rollup-plugin-json");
const globals = require("rollup-plugin-node-globals");
const builtins = require("rollup-plugin-node-builtins");
const uglify = require("rollup-plugin-uglify");

gulp.task("html", () => gulp.src("./src/index.html")
		.pipe(gulp.dest("./dist")));

gulp.task("files", () => {
	gulp.src("./src/font/**/*.*").pipe(gulp.dest("./dist/font"));
	gulp.src("./src/img/**/*.*").pipe(gulp.dest("./dist/img"));
});

gulp.task("sass", () => gulp
	.src("./src/scss/**/*.scss")
	.pipe($.sass({ errLogToConsole: true, outputStyle: "compressed"	})
	.on("error", $.sass.logError))
	.pipe(gulp.dest("./dist/css")));

gulp.task("js", () => gulp
	.src("./src/js/app.js")
	.pipe($.sourcemaps.init({ loadMaps: true }))
	.pipe($.betterRollup({
		plugins: [
			eslint({
				exclude: [ "**/*.hbs", "**/*.json" ]
			}),
			resolve({
				browser: true,
				extensions: [ ".js", ".json" ],
				preferBuiltins: false
			}),
			rootImport({
				root: [`${__dirname}/src/js/partials/`]
			}),
			handlebars({
				helpers: [`${__dirname}/src/js/helpers/helpers.js`],
				partialRoot: [`${__dirname}/src/js/partials/`]
			}),
			commonjs({
				include: "node_modules/**",
				namedExports: {
					"./node_modules/backbone.marionette/lib/core/backbone.marionette.js": ["VERSION", "noConflict", "Deferred", "extend", "isNodeAttached", "mergeOptions", "getOption", "proxyGetOption", "_getValue", "normalizeMethods", "normalizeUIString", "normalizeUIKeys", "normalizeUIValues", "actAsCollection", "_triggerMethod", "triggerMethod", "triggerMethodOn", "MonitorDOMRefresh", "Error", "Callbacks", "Controller", "Object", "Region", "RegionManager", "TemplateCache", "Renderer", "View", "ItemView", "CollectionView", "CompositeView", "LayoutView", "Behavior", "Behaviors", "AppRouter", "Application", "Module", ],
					"./node_modules/backbone/": ["VERSION", "noConflict", "$", "emulateHTTP", "emulateJSON", "sync", "ajax", "history", "Model", "Collection", "Router", "View", "History"]
				}
			}),
			json(),
			globals(),
			builtins(),
			// uglify()
		]
	}, "umd"))
	.on("error", console.error)
	.pipe($.sourcemaps.write("."))
	.pipe(gulp.dest("./dist/js")));

gulp.task("build", [
	"html",
	"sass",
	"js",
	"files"
]);

gulp.task("watch", ["build"], () => {
	gulp.watch("./src/scss/**/*.scss", ["sass"]);
	gulp.watch("./src/**/*.html", ["html"]);
	gulp.watch(["./src/**/*.hbs", "./src/**/*.js"], ["js"]);
	gulp.watch(["./src/img/**/*.*", "./src/font/**/*.*"], ["files"]);
});

gulp.task("watchWithoutBuild", ["html", "sass", "js", "files"], () => {
	gulp.watch("./src/scss/**/*.scss", ["sass"]);
	gulp.watch("./src/**/*.html", ["html"]);
	gulp.watch(["./src/**/*.hbs", "./src/**/*.js"], ["js"]);
	gulp.watch(["./src/img/**/*.*", "./src/font/**/*.*"], ["files"]);
});

gulp.task("default", ["watch"]);
