const {app, BrowserWindow, globalShortcut} = require("electron");
const path = require("path");
const url = require("url");
const config = require("../minty.cfg.json");
const exec = require("child_process").exec;

var win, splash;

function createWindow () {
    // Create the browser window.
    console.log(app.getAppPath());
    win = new BrowserWindow({width: 800, height: 600, icon: "./icon/minty.svg.png", useContentSize: true, show: false});
    splash = new BrowserWindow({width: 400, height: 400 , transparent: true, useContentSize:true, center: true, frame: false, alwaysOnTop:true});
    splash.setMenu(null);
    win.setMenu(null);
    // and load the index.html of the app.
    splash.loadFile("./base/splash.html");
    win.loadFile("./base/index.html");
    if (config.developer) {
        win.toggleDevTools();
        globalShortcut.register('F7', function() {
            win.toggleDevTools();
        });
    }
    //win.setResizable(false);
    globalShortcut.register('F5', function() {
        win.reload();
    });
    globalShortcut.register('F6', function() {
		exec("sh compile.sh", () => {console.log("Rebuilt the engine, press F5 to apply changes")});
    });
    win.once("ready-to-show", () => {
        splash.close();
        win.show();
    });
}

app.on('ready', createWindow);

