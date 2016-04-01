var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-rimraf');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var preprocess = require('gulp-preprocess');

gulp.task('cleanCSS', function() {
	return gulp.src(['./style/app.css', './dist/prod/app.css'])
	.pipe(clean())
});

gulp.task('cleanJS', function() {
	return gulp.src(['./dist/build.js', './dist/prod/build.js'])
	.pipe(clean())
});

gulp.task('cleanHTMLDEV', function() {
	return gulp.src('./index.html')
	.pipe(clean())
});

gulp.task('cleanHTMLPROD', function() {
	return gulp.src('./dist/prod/index.html')
	.pipe(clean())
});

gulp.task('less', ['cleanCSS'], function() {
	return gulp.src('./style/*.less')
		.pipe(less())
		.pipe(gulp.dest('./style'))
});

gulp.task('autoprefixer', ['less'], function() {
	return gulp.src('./style/app.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/'))
});

gulp.task('concatCSS', ['autoprefixer'], function() {
	return gulp.src([
		'./style/libs/bootstrap.min.css',
		'./style/app.css'
		])
	.pipe(concat('app.css'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('minify-css', ['concatCSS'], function() {
	return gulp.src('./dist/app.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/prod'))
});

gulp.task('concatJS', ['cleanJS'], function() {
	return gulp.src([
		'./app.js',
		'./config.js',
		'./components/auth/auth.js',
		'./components/angular-slideables/angularSlideables.js',
		'./components/firebase.utils/firebase.utils.js',
		'./components/ngcloak/ngcloak-decorator.js',
		'./components/security/security.js',
		'./components/reverse/reverse-filter.js',
		'./components/dataSrv/dataSrv.js',
		'./views/**/*.js'
		]).pipe(concat('build.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('uglify', ['concatJS'], function() {
	return gulp.src('./dist/build.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/prod'))
});

gulp.task('processHtmlDev', ['cleanHTMLDEV'], function() {
	gulp.src('./index/index.html')
		.pipe(preprocess({context:{ NODE_ENV: 'development' }}))
		.pipe(gulp.dest('./'))
});

gulp.task('processHtmlProd', ['cleanHTMLPROD'], function() {
	gulp.src('./index/index.html')
		.pipe(preprocess({context: { NODE_ENV: 'production' }}))
		.pipe(gulp.dest('dist/prod'))
});

gulp.task('default', ['concatCSS', 'concatJS', 'processHtmlDev'], function() {
	livereload.listen();
	gulp.watch('style/*.less', ['concatCSS']);
	gulp.watch(['*.js', 'components/**/*.js', 'views/**/*.js'], ['concatJS']);
	gulp.watch(['index/index.html', 'views/**/*.html'], ['processHtmlDev']);
});

gulp.task('prod', ['minify-css', 'uglify', 'processHtmlProd'], function() {});
