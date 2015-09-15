module.exports = function (grunt)
{
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig(
    {
        
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
                files: ['**/*.html', 'css/**/*.css'],
                options: {
                    livereload: true,
                }
            }
        }
    });


    // Default task.
    grunt.registerTask('serve', ['connect:server', 'watch']);


};