module.exports = function (grunt) {
    var debug = (process.env.PG_CONFIG || 'dev') === 'dev';

    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    includePaths: ['stylesheets']
                },
                files: [{
                    expand: true,
                    cwd: 'stylesheets',
                    src: ['*.scss'],
                    dest: 'static',
                    ext: '.css'
                }]
            }
        },
        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ],
                browserifyOptions: {debug: debug}
            },
            index: {
                src: 'javascripts/index.jsx',
                dest: 'static/index.js'
            },
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', [
        'browserify',
        'sass'
    ]);
};
