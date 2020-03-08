let gulp = require('gulp');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let browserSync = require('browser-sync').create();

function sassInCss(done) {
    gulp.src('src/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error',console.error.bind(console))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());

    done();
}

function sync(done) {                               // Подключение плагина browser-sync
    browserSync.init({
        server: {
            baseDir: 'build/'
        },
        port: 3000
    });

    done();
}
function browserReload(done) {                      //Функция перезагрузки browser-sync
    browserSync.reload();
    done();
}

function watchSass() {                              //Отслеживание изменений во всех фалах SCSS проекта
    gulp.watch('src/**/*.scss', sassInCss);
}
function watchFiles() {
    gulp.watch('./**/*.html', browserReload);       //Отслеживание изменений во всех фалах HTML проекта
}


gulp.task('start',gulp.parallel(sync, watchFiles, watchSass));        //Создание общей задачи для последующей активации через терминал



//========================================= Инструкция по подключению Gulp к проекту ========================================
// ___________Перенести файлы gulpfile.js и package.json в корневую папку нового проекта______________
// ??? ___________ Создать новый package.json => npm init  в терминале  ___________ ????
// ___________ Установить все зависимости => npm install  ___________
// ___________ Начать работу, прописав в терминале gulp start  ___________