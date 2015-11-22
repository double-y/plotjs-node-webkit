/**
 * Created by yasudayousuke on 11/21/15.
 */

var child = app_test.createChildProcess({
    execPath: process.execPath,
    appPath: 'path_to_app',
    end: function(data, app) {
        if (data.ok) {
            done();
        } else {
            done('error');
        }
    }
});