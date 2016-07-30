import * as passport from 'passport';
import { Strategy } from 'passport-local';

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, {email: 'test@test.com', firstName: 'testUser', id: 666, lastName: 'testUser'});
});

passport.use(new Strategy(
    function(username, password, done) {
        console.log('passport test');
        done(null, {email: 'test@test.com',
                    firstName: 'testUser',
                    id: 666,
                    lastName: 'testUser'
                   });
    }
));

module.exports = passport;
