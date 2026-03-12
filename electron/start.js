const {app, BrowserWindow} = require('electron');
const {join} = require('path');

app.whenReady().then(main);
function main(){
    const window = new BrowserWindow({
        height: 736,
        width: 1000,
        autoHideMenuBar: true,
    });

    window.loadFile(join(__dirname, "../dist/index.html"));
}