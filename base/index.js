const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
const config = require("../makeba.cfg.json");

var win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, icon: "./base/makeba.ico"});
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
}
  
app.on('ready', createWindow);
