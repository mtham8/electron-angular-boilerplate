'use strict';
const electron = require('electron');
const app = electron.app;
const isDev = process.env.NODE_ENV === 'development';
const BrowserWindow = electron.BrowserWindow;
const electronLocalshortcut = require('electron-localshortcut');
const { ipcMain } = require('electron');

// we need a reference to this object the entire time this application runs
let mainWindow;


const KILL_BAT = require("path").join(__dirname, './kill_explorer.bat');
const START_BAT = require("path").join(__dirname, './start_explorer.bat');

function runBat(path) {
    if(process.platform !== 'darwin' && process.platform !== 'linux'){
        require('child_process').exec(path, (err, stdout, stderr)=>{
            if(err){
                return console.log(err)
            }
            console.log(stdout);
        })
    } else {
        console.info('not on windows, exiting...');
        return false;
    }
}

function createWindow() {
    // default the process env to production
    if (process.env.NODE_ENV === '') {
        process.env.NODE_ENV = 'production';
    }

    let browserAttribs = {
        width: 800,
        height: 600
    };

    if (!isDev) {
        browserAttribs.fullscreen = true;
        browserAttribs.kiosk = true;
        browserAttribs.closable = false;
        browserAttribs.alwaysOnTop = true;
    }

    mainWindow = new BrowserWindow(browserAttribs);
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    electronLocalshortcut.register(mainWindow, 'CmdOrCtrl+D', () => {
        mainWindow.openDevTools();
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    if (isDev) {
        mainWindow.openDevTools({
            detach: true
        });
    }

    if(!isDev){
        runBat(KILL_BAT);
    }

    ipcMain.on('electron-msg', (event, msg) => {
        if(msg.command == 'quit'){
            runBat(START_BAT);
        }
        setTimeout(()=>{
            app.exit(0);
        }, 2000);

    });
}

app.on('will-quit', ()=>{
    runBat(START_BAT);
    console.log("APPLICATION QUITTING")
});

app.on('gpu-process-crashed', ()=>{
    runBat(START_BAT);
    app.relaunch({args: process.argv.slice(1) + ['--relaunch']});
    app.exit(0);
});

app.on('ready', createWindow);
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});



ipcMain.on('online-status-changed', (event, status) => {
    console.log(event, status);
});
