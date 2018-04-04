var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var nodeResolve = require('resolve');
var _ = require("lodash");

gulp.task("html", function() {
	return gulp.src("./src/index.html")
		.pipe($.plumber())
		.pipe(gulp.dest("./dist"));
});

gulp.task("files", function() {
	gulp.src("./src/font/**/*.*").pipe(gulp.dest("./dist/font"));
	gulp.src("./src/img/**/*.*").pipe(gulp.dest("./dist/img"));
});

gulp.task("sass", function() {
	return gulp
		.src("./src/scss/**/*.scss")
		.pipe($.sass({ errLogToConsole: true, outputStyle: "compressed"	})
		.on("error", $.sass.logError))
		.pipe(gulp.dest("./dist/css"));
});

gulp.task("lint", function() {
	return gulp.src(["src/js/**/*.js", "!src/js/**/*.min.js", "!src/js/libs/**/*.js"])
		.pipe($.eslint({
			extends: "eslint:recommended",
			parser: "babel-eslint",
			parserOptions: {
				sourceType: "module",
				ecmaFeatures: {
					modules: true
				}
			},
			plugins: [
				"babel"
			],
			envs: [
				"browser",
				"es6",
				"commonjs"
			],
			ecmaFeatures: {
				sourceType: "module"
			},
			rules: {
				"no-unused-vars": 0,
				"no-console": 0,
				"quotes": ["error", "double"],
				"semi": ["error", "always"]
			}
		}))
		.pipe($.eslint.formatEach("compact", process.stderr));
});

var vendorBundler = _.memoize(function() {
	var b = browserify();

	getNPMPackageIds().forEach(function (id) {
		b.require(nodeResolve.sync(id), { expose: id });
	});

	return b;
});

var appBundler = _.memoize(function() {
	var b = browserify("./src/js/app.js");

	getNPMPackageIds().forEach(function (id) {
		b.external(id);
	});

	return b;
});

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
	delete args[0].stream;
	$.util.log.apply(null, args);
	this.emit("end");
}

function vendorBundle(cb) {
	return vendorBundler().bundle()
		.on("error", handleErrors)
		.pipe(source("vendor.js"))
		.pipe(buffer())
		// .pipe($.uglify())
		.pipe(gulp.dest("./dist/js"))
		.on("end", cb);
}

function appBundle(cb, watch) {
	return appBundler(watch).bundle()
		.on("error", handleErrors)
		.pipe(source("app.js"))
		.pipe(buffer())
		// .pipe($.uglify())
		.pipe(gulp.dest("./dist/js"))
		.on("end", cb);
}

function getNPMPackageIds() {
	return _.union(_.keys(require('./package.json').dependencies) || [], [
		"browserify-cryptojs/components/enc-base64",
		"browserify-cryptojs/components/md5",
		"browserify-cryptojs/components/evpkdf",
		"browserify-cryptojs/components/cipher-core",
		"browserify-cryptojs/components/aes",
		"browserify-cryptojs/components/sha256"
	]);
}

gulp.task("vendor", function(cb) {
	vendorBundle(cb);
});

gulp.task("app", function(cb) {
	appBundle(cb, true);
});

gulp.task("build", [
	"html",
	"sass",
	"lint",
	"vendor",
	"app",
	"files"
]);

gulp.task("watch", ["build"], function() {
	gulp.watch("./src/scss/**/*.scss", ["sass"]);
	gulp.watch("./src/**/*.html", ["html"]);
	gulp.watch(["./src/**/*.hbs", "./src/**/*.js"], ["app", "lint"]);
	gulp.watch(["./src/img/**/*.*", "./src/font/**/*.*"], ["files"]);
});

gulp.task("watchWithoutBuild", ["html", "sass", "app", "files", "lint"], function() {
	gulp.watch("./src/scss/**/*.scss", ["sass"]);
	gulp.watch("./src/**/*.html", ["html"]);
	gulp.watch(["./src/**/*.hbs", "./src/**/*.js"], ["app", "lint"]);
	gulp.watch(["./src/img/**/*.*", "./src/font/**/*.*"], ["files"]);
});

gulp.task("default", ["watch"]);