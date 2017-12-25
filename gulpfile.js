var gulp = require("gulp");
var del = require('del');
var less = require("gulp-less");
var browsersync = require('browser-sync').create();
var concat = require('gulp-concat');
var cssmin = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var fileinclude = require('gulp-file-include');
var uglify = require('gulp-uglify');   
var autoprefixer = require('gulp-autoprefixer');
var assetRev = require('gulp-asset-rev');
var htmlmin = require('gulp-htmlmin');
var Mock = require('mockjs');


//删除dist目录下文件
gulp.task('clean', function (cb) {
    return del(['dist/*'], cb);
})

// 压缩less文件
gulp.task("less", function () {
    gulp.src('src/assets/less/*.less')
        .pipe(less())
        //.pipe(concat('style.css'))//合并后的文件名
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browsersync.stream());
        // .pipe(gulp.dest("src/assets/css"));
});

gulp.task('css', function () {
    gulp.src('src/assets/css/*.css')
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(assetRev())
        //.pipe(uglify())
        .pipe(gulp.dest('dist/assets/css'))
});



// 压缩合并js文件
gulp.task('scripts', function () {
    gulp.src(['src/assets/js/*.js'])
        //.pipe(concat('all.js'))//合并后的文件名
        //.pipe(uglify())
        .pipe(assetRev())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browsersync.stream()); //文件有更新自动执行
});

// 压缩img
gulp.task('image', function () {
    gulp.src(['src/assets/images/*.{png,jpg,jpeg,gif}', 'src/assets/images/ymzx/*.jpg'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browsersync.stream());
});



// var htmlmin = require('gulp-htmlmin');      //html压缩插件
gulp.task('html', function () {
    var options = {
        removeComments: false,//清除HTML注释
        collapseWhitespace: false,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['src/views/*.html', '!src/views/common/*.*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin(options))
        .pipe(assetRev())
        .pipe(gulp.dest('dist/views'))
        .pipe(browsersync.stream());
});

gulp.task('serve', ['clean'], function () {
    gulp.start('less', 'css', 'scripts', 'image', 'html');
    browsersync.init({
        port: 3000,
        logConnections: true, //日志中记录连接
        logFileChanges: true, //日志信息有关更改的文件
        scrollProportionally: false, //视口同步到顶部位置
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        },
        server: {
            baseDir: './dist'
        }
    });

    //监控文件变化，自动更新
    gulp.watch('src/assets/js/*.js', ['scripts']);        
    gulp.watch(['src/assets/less/*.less'], ['less']);
    gulp.watch(['src/assets/css/*.css'], ['css']);
    gulp.watch('src/assets/images/*.*', ['image']);
    gulp.watch(['src/views/*.html'], ['html']);
});

gulp.task('default', ['serve']);




// //监视文件的变化
// gulp.task("watch", function () {
//     gulp.watch("src/assets/less/*.less", ['less']);
// });

// gulp.task('build', function () {
//     gulp.src(['index.html'])
//         .pipe(htmlbuild({
//             // build js with preprocessor 
//             js: htmlbuild.preprocess.js(function (block) {

//                 // read paths from the [block] stream and build them 
//                 // ... 

//                 // then write the build result path to it 
//                 block.write('buildresult.js');
//                 block.end();

//             })
//         }))
//         .pipe(gulp.dest('./build'));
// });


// gulp.task('default', ['less','watch']);