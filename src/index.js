const { app, BrowserWindow, ipcMain } = require('electron')

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/../node_modules/electron`)
});

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: true
    }
  })

  // mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('to-search', (event, args) => {
  searchWindow = new BrowserWindow({
    width: 600,
    height: 400,
    parent: mainWindow,
    modal: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: true
    }
  });

  let url = __dirname + "/components/search/search.html"
  searchWindow.loadURL(url);

  // searchWindow.removeMenu();
  
  searchWindow.once('ready-to-show', () => {
    searchWindow.show();
  })
})

ipcMain.on('get-project', (event, args) => {
  mainWindow.webContents.send('set-project', args);
})