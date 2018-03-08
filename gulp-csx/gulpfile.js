var gulp = require('gulp')
var concat = require('gulp-concat')
var cleanCss = require('gulp-clean-css')
var del = require('del')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var imagemin = require('gulp-imagemin')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload;
var runSequence = require('run-sequence')
// 生产环境 路径配置
var build = {
	basePath:'./build/',
	css:'./build/css/',
	images:'./build/images/',
	js:'./build/js/'
};

// 开发环境，路径配置
var src = {
	basePath: './src/',
	css: './src/css/',
	images: './src/images/',
	js: './src/js/',
};

/*********** 开发模式 *****************/
gulp.task('dev',function(){
	browserSync.init({
		server:{
			baseDir: src.basePath, // 监控的目录
			index: 'index.html'    // 入口文件
		},
		port:8080  // 默认的是3000端口
	});

	gulp.watch("src/*.html",["html:dev"]);
	gulp.watch("src/css/*.css",["css:dev"]);
	gulp.watch("src/js/*.js",["js:dev"]);
	runSequence(['css:dev','js:dev'])
});

// html的自动刷新
gulp.task('html:dev',function(){
	gulp.src([
		    src.basePath+'*.html'
	   ])
		.pipe(gulp.dest(src.basePath))
		.pipe(reload({
			stream:true
		}))
});

// css的自动刷新
gulp.task('css:dev', function(){
     gulp.src([src.css + '*.css'])
          .pipe(gulp.dest(src.css))
          .pipe(reload({
              stream: true
          }))
});

// js的自动刷新
gulp.task('js:dev',function(){
	gulp.src([src.js + '*.js'])
		.pipe(gulp.dest(src.js))
		.pipe(reload({
			stream:true
		}))
});


/************** 生产环境build **********************/
gulp.task('product', function() {
     runSequence(['imagemin', 'publish:html', 'publish:css', 'publish:js']);
})

// 对图片进行压缩
gulp.task('imagemin', function(){
     gulp.src(src.images + '*.*')
         .pipe(imagemin())
         .pipe(gulp.dest(build.images))
});

// 复制对应的html文件
gulp.task('publish:html', function(){
     gulp.src(src.basePath + '*.html')
         .pipe(gulp.dest(build.basePath))
});

// 将css进行合并压缩
gulp.task('publish:css', function(){
    gulp.src([src.css + '*.css', '!'+ src.css + 'all.min.css', '!' + src.css + 'all.css'])
          .pipe(concat('all.css'))
          .pipe(cleanCss())
          .pipe(rename('./all.min.css'))
          .pipe(gulp.dest(build.css))
});

// 将js进行合并压缩
gulp.task('publish:js', function(){
    gulp.src([src.js + '*.js', '!' + src.js + 'all.js', '!' + src.js + 'all.min.js'])
        .pipe(babel({
          presets:['env']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename('./all.min.js'))
        .pipe(gulp.dest(build.js))  
});

// 删除 build目录下所有文件
gulp.task('del:build', function(){
     del([
         build.basePath
     ]);
});
