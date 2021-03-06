const { app, BrowserWindow, ipcMain } = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

let rightWindow;
let bottomWindow;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, resizable: false});
  win.setResizable(false);

  // and load the index.html of the app.
  win.loadFile('index.html')

  win.setMenu(null);

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  let xy = win.getPosition();
  rightWindow = new BrowserWindow({width: 100, height: 600, frame: false, parent: win});
  rightWindow.loadFile('right.html');
  rightWindow.on('closed', () => {
    rightWindow = null; 
  });
  rightWindow.setPosition(xy[0] + 800, xy[1]);
  rightWindow.setResizable(false);

  bottomWindow = new BrowserWindow({width: 800, height: 225, frame: false, parent: win});
  bottomWindow.loadFile('bottom.html');
  bottomWindow.on('closed', () => {
    bottomWindow = null;
  });
  bottomWindow.setPosition(xy[0], xy[1] + 600);
  bottomWindow.setResizable(false);

  ipcMain.on('insert-ticket', (event, payload) => {
    win.webContents.send('insert-ticket', payload);
  });

  ipcMain.on('tap-credit', (event, payload) => {
    win.webContents.send('tap-credit', payload);
  });

  ipcMain.on('insert-credit', (event, payload) => {
    win.webContents.send('insert-credit', payload);
  });

  ipcMain.on('insert-coins', (event, payload) => {
    win.webContents.send('insert-coins', payload);
  });

  ipcMain.on('send-text', (event, payload) => {
    bottomWindow.webContents.send('send-text', payload);
  });

  ipcMain.on('print-ticket', (event, payload) => {
    bottomWindow.webContents.send('print-ticket', payload);
  });

  ipcMain.on('output-change', (event, payload) => {
    bottomWindow.webContents.send('output-change', payload);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.