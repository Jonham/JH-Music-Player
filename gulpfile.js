var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
// var beautify = require('gulp-beautify');
// // var watcher =
// var eslint = require('gulp-eslint');
// var jsdoc = require('gulp-jsdoc');
// var csslint = require('gulp-csslint');

gulp.task('default', function(){
    return gulp.src(['js/$getter.js','js/app.js','js/time-range.js','js/file-load.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(beautify({intentSize: 4}))
        .pipe(gulp.dest('js'));
});
//
// gulp.task('csslint', function() {
//     gulp.src('style/*.css')
//         .pipe(csslint())
//         .pipe(csslint.reporter());
// });
//
// gulp.task('eslint', function() {
//     return gulp.src('js/*.js')
//         .pipe(eslint())
//         .pipe(eslint.format())
//         .pipe(eslint.failAfterError());
// });
//
// gulp.task('srctest', ['eslint', 'csslint'], function(){
//
// });
//
// gulp.task('jsdoc', function() {
//     gulp.src('js/*.js')
//         .pipe(jsdoc('./document-ouput'));
// });
//
// var react = require('gulp-react');
//
// gulp.task('react', function () {
// 	return gulp.src('template.jsx')
// 		.pipe(react())
// 		.pipe(gulp.dest('dist'));
// });
//
//
// var uglify = require('gulp-uglify');
//
// gulp.task('compress', function() {
//   return gulp.src('lib/*.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('dist'));
// });
//
// gulp.watch('js/*.js', function(e) {
//     console.log('File' + e.path + ' was ' + e.type + ', running task...');
// });
