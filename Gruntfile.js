module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        clean: ['dist/**/*'],

        copy: {
            build: {
                expand: true,
                cwd: 'src/js/vendor/',
                src: '**',
                dest: 'dist/',
                flatten: true,
                filter: 'isFile',
            }
        },

        sass: {
            dist: {
                files: {
                    'src/css/styles.css': 'src/css/styles.scss'
                }
            }
        },

        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 5 versions', 'ie 8', 'ie 9']
                    }),
                    require('postcss-opacity')(),
                    require('cssnano')() 
                ]

            },
            dist: {
                files: {
                    'dist/styles.min.css': 'src/css/styles.css'
                }
            }
        },

        connect: {
            server: {
                options: {
                    livereload: true,
                    port: 80,
                    base: './',
                }
            }
        },
        
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    mangle: false
                },
                files: {
                    'dist/reporte.min.js': 'src/js/reporte.js',
                }
            }
        },

        watch: {
            html: {
                files: ['**/*.html', '**/*.scss', 'src/js/*.js'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                    livereload: true,
                }

            }
        }
    });


    // Default task.
    grunt.registerTask('serve', ['connect:server', 'watch']);
    grunt.registerTask('build', ['clean', 'copy:build', 'sass', 'postcss', 'uglify']);


};
