module.exports = function (grunt) {

   grunt.initConfig({
      jshint: {
         config: {
            src: [
               'app/app-config/*.js'
            ]
         },
         rules: {
            src: [
               'app/app-controller/*.js'
            ]
         }
      },
      concat: {
         libs: {
            src: [
               'app/js/jquery.min.js',
               'app/js/jquery-ui.min.js',
               'app/js/bootstrap.min.js',
               'app/js/angular.min.js',
               'app/js/angular-locale_pt-br.min.js',
               'app/js/angular-route.min.js',
               'app/js/angular-resource.min.js',
               'app/js/angular-animate.min.js',
               'app/js/angular-sanitize.min.js'
            ],
            dest: 'dist/app/js/tmp/libs.js'
         },
         plugins: {
            src: [
               'app/js/jquery.inputmask.min.js',
               'app/js/fancybox/jquery.fancybox.pack.js',
               'app/js/toaster.min.js',
               'app/js/ui-bootstrap-tpls.min.js',
               'app/js/jquery.data-tables.min.js',
               'app/js/data-tables.bootstrap.min.js',
               'app/js/chosen.min.js',
               'app/js/masks.min.js',
               'app/js/select2.min.js',
               'app/js/bootstrap-datepicker.min.js',
               'app/js/angular-bootstrap-lightbox.min.js',
               'app/js/jquery.jcarousel.min.js',
               'app/js/jcarousel.responsive.min.js',
               'app/js/angular-file-upload.min.js',
               'app/js/jquery.inputmask.regex.extensions.min.js'
            ],
            dest: 'dist/app/js/tmp/plugins.js'
         },
         config: {
            src: [
               'app/app-config/extension.js',
               'app/app-config/customFilters.js',
               'app/app-config/rotas.js',
               'app/app-config/httpInterceptor.js',
               'app/app-config/api.js',
               'app/app-config/app.js',
               'app/app-config/service-model.js',
               'app/app-config/menu.js',
               'app/app-config/usuario.js'
            ],
            dest: 'dist/app/js/tmp/config.js'
         },
         rules: {
            files: [{
                  src: 'app/app-controller/*.js',
                  dest: 'dist/app/js/tmp/rules.js'
               }]
         },
         all: {
            src: [
               'dist/app/js/tmp/libs.min.js',
               'dist/app/js/tmp/plugins.min.js',
               'dist/app/js/tmp/config.min.js',
               'dist/app/js/tmp/rules.min.js'

            ],
            dest: 'dist/app/js/scripts.js'
         }
      },
      uglify: {
         libs: {
            src: [
               'dist/app/js/tmp/libs.js'
            ],
            dest: 'dist/app/js/tmp/libs.min.js'
         },
         plugins: {
            src: [
               'dist/app/js/tmp/plugins.js'
            ],
            dest: 'dist/app/js/tmp/plugins.min.js'
         },
         config: {
            src: ['dist/app/js/tmp/config.js'],
            dest: 'dist/app/js/tmp/config.min.js'
         },
         rules: {
            files: [{
                  src: 'dist/app/js/tmp/rules.js',
                  dest: 'dist/app/js/tmp/rules.min.js'
               }]
         }
      },
      cssmin: {
         all: {
            src: [
               'app/css/jquery-ui.min.css',
               'app/css/bootstrap.min.css',
               'app/css/toaster.min.css',
               'app/css/chosen.min.css',
               'app/css/select2.min.css',
               'app/css/dataTables.bootstrap.min.css',
               'app/css/datepicker3.min.css',
               'app/css/jcarousel.responsive.min.css',
               'app/js/fancybox/jquery.fancybox.min.css',
               'app/css/site.css'
            ],
            dest: 'dist/app/css/styles.css'
         }
      },
      htmlmin: {
         options: {
            removeComments: true,
            collapseWhitespace: true
         },
         view: {
            expand: true,
            cwd: 'app/view-partial/',
            src: ['*.html'],
            dest: 'dist/app/view-partial'
         },
         template: {
            expand: true,
            cwd: 'app/app-config/template',
            src: ['*.html'],
            dest: 'dist/app/app-config/template'
         }
      },
      copy: {
         app: {
            expand: true,
            cwd: 'app/arquivos-producao',
            src: ['.htaccess', '*.html'],
            dest: 'dist/app'
         },
         sistem: {
            src: ['index.html'],
            dest: 'dist/'
         },
         server: {
            expand: true,
            cwd: 'server',
            src: ['**'],
            dest: 'dist/server'
         },
         img: {
            expand: true,
            cwd: 'app/img',
            src: ['**'],
            dest: 'dist/app/img'
         },
         font: {
            expand: true,
            cwd: 'app/fonts',
            src: ['**'],
            dest: 'dist/app/fonts'
         },
         prod: {
            expand: true,
            cwd: 'server/server-prod',
            src: ['.htaccess'],
            dest: 'dist/server'
         }
      },
      clean: {
         tmp: 'dist/app/js/tmp/',
         dist: 'dist/',
         server: 'dist/server/server-prod'
      },
      mkdir: {
         all: {
            options: {
               mode: 0700,
               create: ['dist/media']
            }
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-htmlmin');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-mkdir');

   grunt.registerTask('sisco', ['clean:dist', 'jshint', 'concat:libs', 'concat:plugins', 'concat:config', 'concat:rules', 'uglify', 'concat:all', 'cssmin', 'htmlmin', 'copy', 'mkdir']); //'clean:tmp'
};