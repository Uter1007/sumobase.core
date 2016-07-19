'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'pm2', 'run-sequence']
    }),
    environment = require('./lib/environment.js'),
    nodemonConfiguration = {
        script: './dist/server.js',
        ext: 'ts', // js reload when any of these file extensions changes -> watch will trigger compileing of ts to js,
        // new js will restart server
        watch: ['dist'], //
        ignore: ['dist/public', 'dist/src'], // 'node_modules', 'frontend', 'gulp'
        exec: 'node',
        env: {
            'NODE_ENV': 'development'
        }
    };

/**
 * Debug
 */

gulp.task('inspect', 'Debug via NodeInspector', () => {
    gulp.src([])
        .pipe($.nodeInspector({
            debugPort: 5858,
            webHost: '0.0.0.0',
            webPort: 8080,
            saveLiveEdit: false,
            preload: false,
            inject: true,
            hidden: [],
            stackTraceLimit: 50,
            sslKey: '',
            sslCert: ''
        }));
});

gulp.task('dbg', 'Launch the server on development mode, autoreloads it when there are code changes',
    ['build', 'inspect', 'swagger-ui'], () => {

        var cfg = JSON.parse(JSON.stringify(nodemonConfiguration));
        cfg.exec = 'node --debug';

        // Add port to configuration if specified, otherwise leave out so dotenv .env file can be potentially used
        if (environment.get('port', false)) {
            cfg.env.PORT = environment.get('port');
        }

        $.nodemon(cfg)
            .on('restart', function () {
                console.log('restarted!')
            });

    }, {
        options: {
            'port': 'The port # the server should listen to. ' +
            'Defaults to value specified in .env file under PORT, or 3000 if .env not present'
        }
});

gulp.task('serve', 'Launch the server on development mode, autoreloads it when there are code changes', [], () => {

    var cfg = JSON.parse(JSON.stringify(nodemonConfiguration));

    // Add port to configuration if specified, otherwise leave out so dotenv .env file can be potentially used
    if (environment.get('port', false)) {
        cfg.env.PORT = environment.get('port');
    }


    $.nodemon(cfg)
        .on('restart', function () {
            console.log('restarted!')
        });

});


/*
gulp.task('serve', 'Launch the server on development mode, autoreloads it when there are code changes', ['build'], (cb) => {

    $.runSequence('serveDev', cb);

}, {
    options: {
        'port': 'The port # the server should listen to. Defaults to value specified in .env file under PORT, or 3000 if .env not present'
    }
});
*/

gulp.task('serveCluster', 'Launches clusterized server (for production). ' +
          'CURRENTLY FAILING, use serverCluser.sh bash CLI', ['build'], () => {
    $.pm2.connect(() => {
        $.pm2.start({
            // Script to be run
            script: './dist/server.js',
            env: {
                "NODE_ENV": "development",
            },
            env_production: {
                "NODE_ENV": "production",
            },
            // Allow your app to be clustered
            exec_mode: environment.get('exec_mode', 'cluster'),
            // Optional: Scale your app by 4
            instances: environment.get('instances', 1),
            // Optional: Restart your app if it reaches 100Mo
            max_memory_restart: environment.get('max_memory_restart', '100M'),

        }, (err, apps) => {
            $.pm2.disconnect();
        });
    });

}, {
    options: {
        'exec_mode': 'PM2 exec mode',
        'instances': 'PM2 # instances in cluster',
        'max_memory_restart': 'PM2 Restart your app if it reaches this'
    }
});
