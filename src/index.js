const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { localStorage } = require('electron-browser-storage');


require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/../node_modules/electron`)
});

let mainWindow;



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 750,
    minWidth: 750,
    height: 675,
    icon: __dirname + "/assets/images/fav.ico",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: true
    }
  })

  // mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')
 
  // Checks if user is working on project.
  // If so, the user will receive a popup asking to
  // stop their timer. If the timer is stopped, the user
  // can shut down the application.
  mainWindow.on("close", async (event) => {
    event.preventDefault();
    if(JSON.parse(await localStorage.getItem("isWorking"))) {
      dialog.showErrorBox("Urenregistratie", "Je bent nog aan het werk. Sluit eerst je project af")
    } else {
      mainWindow.destroy();
      app.quit();
    }
  });
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
    width: 900,
    minWidth: 900,
    height: 410,
    parent: mainWindow,
    modal: true,
    frame: false,
    show: false,
    resizable: false,
    icon: __dirname + "/assets/images/fav.ico",
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

ipcMain.on('to-login', (event, args) => {
  loginWindow = new BrowserWindow({
    width: 500,
    height: 550,
    parent: mainWindow,
    modal: true,
    frame: false,
    show: false,
    transparent: true,
    icon: __dirname + "/assets/images/fav.ico",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: true
    }
  });

  let url = __dirname + "/components/user/user.html"
  loginWindow.loadURL(url);

  // searchWindow.removeMenu();
  
  loginWindow.once('ready-to-show', () => {
    loginWindow.show();
  })
})

ipcMain.on('to-monthly-overview', (event, args) => {
  overviewWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    parent: mainWindow,
    modal: true,
    frame: false,
    show: false,
    icon: __dirname + "/assets/images/fav.ico",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: true
    }
  });

  let url = __dirname + "/components/month/month.html"
  overviewWindow.loadURL(url);

  // searchWindow.removeMenu();
  
  overviewWindow.once('ready-to-show', () => {
    overviewWindow.show();
  })
})

ipcMain.on('to-new-project', (event, args) => {
  newWindow = new BrowserWindow({
    width: 900,
    height: 600,
    parent: mainWindow,
    modal: true,
    frame: false,
    show: false,
    icon: __dirname + "/assets/images/fav.ico",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: true
    }
  });

  let url = __dirname + "/components/new/new.html";
  newWindow.loadURL(url);

  // searchWindow.removeMenu();
  
  newWindow.once('ready-to-show', () => {
    newWindow.show();
  })
})

ipcMain.on('get-project', (event, args) => {
  mainWindow.webContents.send('set-project', args);
})

ipcMain.on('reload-parent', (event, args) => {
  console.log("reloaded")
  mainWindow.webContents.reload();
})

ipcMain.on('print-to-pdf', function(event) {
  const pdfPath = "C:\\Users\\rickv\\Desktop\\PDFS\\test.pdf";
  const win = BrowserWindow.fromWebContents(event.sender);

  console.log(pdfPath);

  var options = { 
    silent: false, 
    printBackground: true, 
    color: false, 
    margin: { 
        marginType: 'printableArea'
    }, 
    landscape: false, 
    pagesPerSheet: 1, 
    collate: false, 
    copies: 1, 
    header: 'Header of the Page', 
    footer: 'Footer of the Page'
} 

  win.webContents.print(options, (success, failReason) => {
    if(!success) return console.log(failReason);
  })
})

ipcMain.on('to-weekly-overview', (event, args) => {
  weekWindow = new BrowserWindow({
    width: 1300,
    height: 700,
    parent: mainWindow,
    modal: true,
    frame: false,
    show: false,
    icon: __dirname + "/assets/images/fav.ico",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: true
    }
  });

  let url = __dirname + "/components/week/week.html"
  weekWindow.loadURL(url);

  // searchWindow.removeMenu();
  
  weekWindow.once('ready-to-show', () => {
    weekWindow.show();
  })
})