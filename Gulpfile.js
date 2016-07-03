var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var browserify = require("browserify");
var watchify = require("watchify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
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
		.pipe($.sourcemaps.init())
		.pipe($.sass({ errLogToConsole: true, outputStyle: "compressed"	})
		.on("error", $.sass.logError))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest("./dist/css"));
});

gulp.task("lint", function() {
	return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
		.pipe($.eslint({
			extends: 'eslint:recommended',
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
				"quotes": ["error", "double"],
				"semi": ["error", "always"]
			}
		}))
		.pipe($.eslint.formatEach('compact', process.stderr));
});

var bundler = _.memoize(function(watch) {
	var options = { debug: true };

	if (watch) {
		_.extend(options, watchify.args);
	}

	var b = browserify("./src/js/app.js", options);

	if (watch) {
		b = watchify(b);
	}

	return b;
});

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
	delete args[0].stream;
	$.util.log.apply(null, args);
	this.emit("end");
}

function bundle(cb, watch) {
	return bundler(watch).bundle()
		.on("error", handleErrors)
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe($.sourcemaps.init({ loadMaps: true }))
		// .pipe($.uglify())
		.pipe($.sourcemaps.write("./"))
		.pipe(gulp.dest("./dist/js"))
		.on("end", cb);
}

gulp.task("js", function(cb) {
	bundle(cb, true);
});

gulp.task("build", [
	"html",
	"sass",
	"lint",
	"js",
	"files"
]);

gulp.task("watch", ["build"], function() {
	bundler(true).on("update", function() {
		gulp.start("lint");
		gulp.start("js");
	});

	gulp.watch("./src/scss/**/*.scss", ["sass"]);
	gulp.watch("./src/**/*.html", ["html"]);
	gulp.watch("./src/**/*.hbs", ["js"]);
	gulp.watch(["./src/img/**/*.*", "./src/font/**/*.*"], ["files"]);
});

gulp.task("default", ["watch"]);