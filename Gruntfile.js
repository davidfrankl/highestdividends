module.exports = function (grunt) {
    var debug = (process.env.PG_CONFIG || 'dev') === 'dev';

    grunt.initConfig({
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

    grunt.registerTask('default', 'browserify');
};
