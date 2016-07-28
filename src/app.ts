
'use strict';

// include dependencies
import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
//import * as favicon from 'serve-favicon';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
const helmet = require('helmet');
import {logger} from './commons/logger/logger';

/* tslint:disable */
require ('./modules/session/logic/strategy/passport');
/* tslint:enable */

import * as configFile from './config/env/config';

// modular Route definitions

import {UserRouteProvider, UserSecureRouteProvider} from './modules/user/routes/user.route.provider';
import {AuthRouteProvider} from './modules/session/routes/session.route.provider';
import {AccountRouteProvider} from './modules/account/routes/account.route.provider';

// error handler service
import {
    development as DevelopmentErrorHandler,
    production as ProductionErrorHandler,
} from './commons/services/error.handler';

// main app
const app = express();
app.use(helmet());

import * as mongoose from 'mongoose';
if (process.env.NODE_ENV === 'testing') {
    mongoose.connect(configFile.TestConfig.fixtureDb.uri, configFile.TestConfig.fixtureDb.options);
} else {
    mongoose.connect(configFile.TestConfig.db.uri, configFile.TestConfig.db.options);
}

// use the passport package in our application
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(morgan(configFile.TestConfig.log.morganLogFormat, { stream: logger.writeStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('frontend', 'dist'))); // serve public files

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// register routes (as middleware layer through express.Router())
app.use(new AuthRouteProvider().getRouter());
app.use(new AccountRouteProvider().getRouter());
app.use(new UserRouteProvider().getRouter());
app.use(new UserSecureRouteProvider().getRouter());

if (app.get('env') === 'development') {
    app.use('/swagger', express.static('./swagger-ui/dist'));
    app.use('/specs', express.static('./swagger-ui/specs'));
}

app.get('*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: Function) => {
    let err = new Error('Not Found');
    res.status(404);
    console.log('catching 404 error');
    return next(err);
});

// error handlers

// development error handler - will print stacktrace
// production error handler - no stacktraces leaked to user
if (app.get('env') === 'development') {
    app.use(DevelopmentErrorHandler);
} else {
    app.use(ProductionErrorHandler);
}

export default app;
