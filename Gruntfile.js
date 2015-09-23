module.exports = function (grunt)
{
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig(
    {
        
        sass: {
            dist: {
                files: {
                    'css/styles.css' : 'css/styles.scss'
                }
            }
        },
        connect:
        {
            server:
            {
                options:
                {
                    livereload: true,
                    port: 80,
                    base: './',
                }
            }
        },
        watch: {
            html: {
                files: ['**/*.html', '**/*.scss','js/*.js'],
                tasks: ['sass'],
                options: {
                    livereload: true,
                }

            }
        }
    });


    // Default task.
    grunt.registerTask('serve', ['connect:server', 'watch']);


};