const _ = require("lodash");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

// Gulp
const gulp = require("gulp");
const util = require("gulp-util");
const gulpif = require("gulp-if");

const sourcemaps = require("gulp-sourcemaps");

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

const browserSync = require("browser-sync");
const history = require("connect-history-api-fallback");

// CSS
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// JS/TS
const rollup = require("@rollup/stream");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const typescript = require("rollup-plugin-typescript2");
const rootImport = require("rollup-plugin-root-import");
const handlebars = require("rollup-plugin-handlebars-plus");
const globals = require("rollup-plugin-node-globals");
const builtins = require("rollup-plugin-node-builtins");
const conditional = require("rollup-plugin-conditional");
const { terser } = require("rollup-plugin-terser");

// Iconfont
const fontelloDownload = require("fontello-download");

let cache; // Rollup cache

gulp.task("html", () => gulp.src("src/index.html")
  .pipe(gulp.dest("dist")));

gulp.task("files", () => gulp.src("src/font/**/*.*")
  .pipe(gulp.dest("dist/font")));

gulp.task("sass", () => gulp.src("src/scss/**/*.scss")
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(sass())
  /**.pipe(postcss([
    autoprefixer(),
    util.env.production ? cssnano() : false
  ]))*/
  .on("error", sass.logError)
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest("dist/css"))
  .pipe(browserSync.stream()));
	
gulp.task("iconfont", async () => {
  const fontConfig = JSON.parse(fs.readFileSync("src/font/iconfont/config.json"));
  const fontZip = await promisify(fontelloDownload)(fontConfig);

  mkdirp.sync("dist/font/iconfont");

  // find non-directory files in a path like /fontello-(ID)/font/
  const fontFiles = _.filter(_.values(fontZip.files), o => !o.dir && o.name.match(/^fontello-\w+\/font\//));

  for (const file of fontFiles) {
    const data = await fontZip.file(file.name).async("uint8array");
    fs.writeFileSync(path.join("dist/font/iconfont/", path.basename(file.name)), new Buffer(data));
  }

  // find the /fontello-(ID)/css/(NAME).css file
  const fontName = fontConfig.name;
  const cssNameRegex = new RegExp("^fontello-\\w+\\/css\\/" + fontName + "\\.css$");
  const cssFile = _.find(_.values(fontZip.files), o => !o.dir && o.name.match(cssNameRegex));
  const cssFileData = await fontZip.file(cssFile.name).async("string");
  // prepend header and replace all relative font paths with absolute ones
  const newCSSFileData = "/* AUTO GENERATED FILE, DO NOT MODIFY */\n\n" +
		cssFileData.replace(/\.\.\/font\//g, "/font/iconfont/");

  fs.writeFileSync("src/scss/base/_iconfont.scss", newCSSFileData);
});

gulp.task("app", () => rollup({
  input: "./src/ts/app.ts",
  output: {
    sourcemap: !util.env.production,
    format: "umd",
    name: "kristweb"
  },
  cache,
  plugins: [
    //eslint({ // doesn't work in current version, switching to typescript anyway
    //  exclude: ["**/*.hbs", "**/*.json", "node_modules/**"]
    //}),
    builtins({
      crypto: false
    }),
    resolve({
      browser: true,
      extensions: [".js", ".json", ".ts", ".hbs"],
      preferBuiltins: false
    }),
    rootImport({
      root: [`${__dirname}/src/ts/`, `${__dirname}/src/ts/partials/`],
      extensions: [".js", ".ts", ".hbs"]
    }),
    handlebars({
      helpers: [`${__dirname}/src/ts/helpers/helpers.ts`],
      partialRoot: [`${__dirname}/src/ts/partials/`]
    }),
    json(),
    typescript({
      verbosity: 2
    }),
    commonjs({
      include: "node_modules/**",
      extensions: [".js", ".ts"],
      namedExports: {
        "./node_modules/backbone.marionette/lib/backbone.marionette.js": ["noConflict", "bindEvents", "unbindEvents", "bindRequests", "unbindRequests", "mergeOptions", "getOption", "normalizeMethods", "extend", "isNodeAttached", "deprecate", "triggerMethod", "triggerMethodOn", "isEnabled", "setEnabled", "monitorViewEvents", "Behaviors", "Application", "AppRouter", "Renderer", "TemplateCache", "View", "CollectionView", "NextCollectionView", "CompositeView", "Behavior", "Region", "Error", "Object", "DEV_MODE", "FEATURES", "VERSION", "DomApi", "setDomApi"],
        "./node_modules/backbone/": ["VERSION", "noConflict", "$", "emulateHTTP", "emulateJSON", "sync", "ajax", "history", "Model", "Collection", "Router", "View", "History"],
        "./node_modules/backbone.localstorage/build/backbone.localStorage.js": ["LocalStorage"]
      }
    }),
    globals(),
    conditional(!!util.env.production, [terser()])
  ],
  external: ["crypto"]
})
  .on("bundle", bundle => cache = bundle)
  .pipe(source("app.ts", "./src/ts"))
  .pipe(buffer())
  .pipe(gulpif(!util.env.production, sourcemaps.init({ loadMaps: true })))
  .pipe(gulpif(!util.env.production, sourcemaps.write({ includeContent: false, sourceRoot: "/js", largeFile: true })))
  .pipe(gulp.dest("./dist/js")));

gulp.task("browser-sync", () => browserSync({
  server: {
    baseDir: "dist",
    middleware: [
      history()
    ]
  }
}));

gulp.task("browser-sync-reload", done => {
  browserSync.reload();
  done();
});

gulp.task("build", gulp.parallel("html", "files", gulp.series("iconfont", "sass"), "app"));

gulp.task("watch", gulp.series("build", done => {
  gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
  gulp.watch("src/**/*.html", gulp.series("html", "browser-sync-reload"));
  gulp.watch(["src/**/*.hbs", "src/**/*.js", "src/**/*.ts"], gulp.series("app", "browser-sync-reload"));
  gulp.watch(["src/img/**/*.*", "src/font/**/*.*"], gulp.series("files", "browser-sync-reload"));
  done();
}));

gulp.task("default", gulp.parallel("browser-sync", "watch"));
