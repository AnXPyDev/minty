const {app, BrowserWindow, globalShortcut} = require("electron");
const path = require("path");
const url = require("url");
const config = require("../minty.cfg.json");
const exec = require("child_process").exec;

var win;

function createWindow () {
    // Create the browser window.
    console.log(app.getAppPath());
    win = new BrowserWindow({width: 800, height: 600, icon: "./icon/minty.svg.png", useContentSize: true});
    win.setMenu(null);
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    if (config.developer) {
        win.toggleDevTools();
    }
    win.setResizable(false);
    globalShortcut.register('F5', function() {
		win.reload();
    });
    globalShortcut.register('F6', function() {
		exec("sh build.sh", () => {console.log("Rebuilt the engine, press F5 to apply changes")});
    });
}

app.on('ready', createWindow);
