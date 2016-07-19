var mongoose = require('mongoose');
var connection = mongoose.connection;

before(function(done) {
    // wait for database connection before starting our tests
    connection.on('error', console.error);
    connection.once('open', function() {
        done();
    });
});

after(function(done) {
    connection.close(done);
});

beforeEach(function(done) {
    mongoose.connection.db.dropDatabase(function() {
        done();
    });
});
