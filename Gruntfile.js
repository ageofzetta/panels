module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        sass: {
            dist: {
                files: {
                    'css/styles.css': 'css/styles.scss'
                }
            }
        },

        postcss: {
            options: {
                map: true,
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
                    'css/styles.min.css': 'css/styles.css'
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
        watch: {
            html: {
                files: ['**/*.html', '**/*.scss', 'js/*.js'],
                tasks: ['sass'],
                options: {
                    livereload: true,
                }

            }
        }
    });


    // Default task.
    grunt.registerTask('serve', ['connect:server', 'watch']);
    grunt.registerTask('build', ['sass', 'postcss']);


};
