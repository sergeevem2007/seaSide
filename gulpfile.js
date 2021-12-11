'use strict';

const fs = require('fs');
const path = require('path');

/* подключаем gulp и плагины */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cache = require('gulp-cache');
const rimraf = require('gulp-rimraf');
const rename = require('gulp-rename');
const stripCssComments = require('gulp-strip-css-comments');
const twig = require('gulp-twig');
const htmlbeautify = require('gulp-html-beautify');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const webpack = require('webpack-stream');
const version = require('gulp-version-number');
const notifier = require('node-notifier');
const rsync = require('gulp-rsync');
const confirm = require('gulp-confirm');

const argv = require('yargs').argv;
const developer = !!argv.developer;
const production = !developer;

const isMode = developer ? 'dev' : 'prod';
const dataMode = require(`./src/data/${isMode}.json`);
const dataSite = require(`./src/data/site.json`);
const webpackConfig = require('./webpack.config.js');
const versionConfig = {
	'value': '%DT%',
	'append': {
		'key': 'v',
		'to': ['css', 'js'],
	},
};

/* пути */
const dirRoot = __dirname;
const dirDist = 'dist';
const dirAssets = 'assets';
const dirSrc = 'src';
const dirStatic = 'static';

const paths = {
	root: path.join(dirRoot, dirDist),
	clean: path.join(dirRoot, dirDist, '*'),
	dist: {
		static: path.join(dirRoot, dirDist),
		html: path.join(dirRoot, dirDist),
		js: path.join(dirRoot, dirDist, dirAssets, 'js'),
		css: path.join(dirRoot, dirDist, dirAssets, 'css'),
		img: path.join(dirRoot, dirDist, dirAssets, 'img'),
		fonts: path.join(dirRoot, dirDist, dirAssets, 'fonts')
	},
	src: {
		static: path.join(dirRoot, dirStatic, '**/*.*'),
		twig: path.join(dirRoot, dirSrc, 'views', '*.twig'),
		script: path.join(dirRoot, dirSrc, dirAssets, 'js', 'index.js'),
		style: path.join(dirRoot, dirSrc, dirAssets, 'scss', 'index.scss'),
		img: path.join(dirRoot, dirSrc, dirAssets, 'img', '**/*.*'),
		fonts: path.join(dirRoot, dirSrc, dirAssets, 'fonts', '**/*.*')
	},
	watch: {
		static: `./${dirStatic}/'**/*.*`,
		twig: `./${dirSrc}/views/**/*.twig`,
		js: `./${dirSrc}/${dirAssets}/js/**/*.js`,
		scss: `./${dirSrc}/${dirAssets}/scss/**/*.scss`,
		img: `./${dirSrc}/${dirAssets}/img/**/*.*`,
		fonts: `./${dirSrc}/${dirAssets}/fonts/**/*.*`
	}
};

/* задачи */

// слежка
function watch() {
	gulp.watch(paths.watch.static, moveStatic);
	gulp.watch(paths.watch.scss, styles);
	gulp.watch(paths.watch.twig, templates);
	gulp.watch(paths.watch.js, scripts);
	gulp.watch(paths.watch.fonts, fonts);
	gulp.watch(paths.watch.img, images);
}

// следим за dist и релоадим браузер
function server() {
	browserSync.init({
		server: {
			baseDir: dirDist,
			index: "index.html"
		}
	});
	browserSync.watch(path.join('.', dirDist, '**/*.*'), browserSync.reload);
}

// очистка
function clean() {
	return gulp.src(paths.clean, { read: false })
		.pipe(rimraf());
}

// templates
function templates() {
	return gulp.src(paths.src.twig)
		.pipe(twig({
			data: {
				mode: dataMode,
				site: dataSite
			}
	}))
		.pipe(gulpif(production, htmlbeautify()))
		.pipe(gulpif(production, version(versionConfig)))
		.pipe(gulp.dest(paths.dist.html));
}

// scss
function styles() {
	return gulp.src(paths.src.style)
		.pipe(gulpif(developer, sourcemaps.init({loadMaps: true, largeFile: true})))
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'compressed', includePaths: ['node_modules'] })
			.on('error', function(err) {
				console.error(err.message);
				notifier.notify({ title: 'Ошибка в SCSS файле!', message: err.message });
				this.emit('end');
			})
		)
		.pipe(plumber.stop())
		.pipe(autoprefixer())
		.pipe(gulpif(developer, sourcemaps.write()))
		.pipe(rename({ basename: 'main.min' }))
		.pipe(gulp.dest(paths.dist.css));
}

// js
function scripts() {
	return webpack(webpackConfig)
		.pipe(gulp.dest(paths.dist.js));
}

// fonts
function fonts() {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dist.fonts));
}

// static
function moveStatic() {
	return gulp.src(paths.src.static)
		.pipe(gulp.dest(paths.dist.static));
}

// обработка картинок
function images() {
	return gulp.src(paths.src.img)
		.pipe(gulp.dest(paths.dist.img));
}




// инициализируем задачи
exports.moveStatic = moveStatic;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.clean = clean;

gulp.task('default', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates),
	gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates)
));
