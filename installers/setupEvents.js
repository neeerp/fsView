const electron = require('electron')
const app = electron.app
const WinShell = require('./windows/winshell.js');

module.exports = {
    handleSquirrelEvent: function() {
        if (process.argv.length === 1) {
            return false;
        }

        const squirrelEvent = process.argv[1];
        switch (squirrelEvent) {
            case '--squirrel-install':
            case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus
            WinShell.folderBackgroundContextMenu.register(app.quit);

            return true;

            case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
 
            WinShell.folderBackgroundContextMenu.deregister(app.quit);

            return true;

            case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
        }
    }
}

