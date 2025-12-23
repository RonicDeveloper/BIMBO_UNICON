const { app, BrowserWindow,Screen } = require("electron");
const { screen }                    = require('electron');

let screen1;

createWindow = () => {
    screen1 = new BrowserWindow({
        show: true,
        // x:0,
        // y:0,
        width: 1920,
        height: 1080,
        fullscreen: false,
        icon: `file://${__dirname}/dist/Unicon/assets/App_Icon.png`,
    });
    screen1.loadURL(`file://${__dirname}/dist/Unicon/browser/index.html`);
    screen1.setMenu(null);
    // screen1.maximize();
    // screen1.webContents.openDevTools();
    screen1.isAlwaysOnTop(true);
    screen1.on("closed", () => {
        screen1 = null;
    });    
}

app.on("ready", createWindow);

// app.on("ready",()=> {
//     createWindow();
//     const { screen } = require('electron');
//     console.log(screen.getAllDisplays())
// })


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});
