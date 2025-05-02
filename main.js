const { app, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const ConfigLoader = require('./src/config-loader');
const WindowManager = require('./src/window-manager');
const TileManager = require('./src/tile-manager');
const OffsetController = require('./src/offset-controller');

let windowManager;
let tileManager;
let offsetController;
let configLoader;
let configPath;

function getConfigPath() {
  const args = process.argv.slice(1);
  const configArgIndex = args.findIndex(arg => arg === '--config' || arg === '-c');
  
  if (configArgIndex !== -1 && args.length > configArgIndex + 1) {
    const customPath = args[configArgIndex + 1];
    if (fs.existsSync(customPath)) {
      return customPath;
    }
    console.warn(`Specified config file not found: ${customPath}, falling back to default`);
  }
  
  return path.join(__dirname, 'config.json');
}

function initializeApp(reload = false) {
  if (!configPath || !reload) {
    configPath = getConfigPath();
  }

  configLoader = new ConfigLoader(configPath);
  if (!configLoader.loadConfig() || !configLoader.validateConfig()) {
    console.error('Failed to load or validate configuration. Exiting...');
    if (!reload) {
      app.quit();
    }
    return false;
  }
  
  const config = configLoader.getConfig();
  
  if (reload && tileManager) {
    tileManager.removeTiles();
  }
  
  if (!windowManager || !windowManager.getWindow()) {
    windowManager = new WindowManager(config);
    const mainWindow = windowManager.createWindow();
    createMenu(mainWindow);
  } else if (reload) {
    windowManager.getWindow().setTitle(config.window.title || 'Tiled Web Pages');
  }
  
  tileManager = new TileManager(windowManager.getWindow(), config);
  tileManager.createTiles();
  
  offsetController = new OffsetController(tileManager);
  offsetController.applyOffsets();
  
  console.log('Application initialized successfully with', config.tiles.length, 'tiles');
  return true;
}

function createMenu(window) {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload Config',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            console.log('Reloading configuration from:', configPath);
            initializeApp(true);
          }
        },
        { type: 'separator' },
        {
          label: 'Load Config...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const { dialog } = require('electron');
            const result = await dialog.showOpenDialog(window, {
              properties: ['openFile'],
              filters: [{ name: 'JSON', extensions: ['json'] }]
            });
            
            if (!result.canceled && result.filePaths.length > 0) {
              configPath = result.filePaths[0];
              console.log('Loading configuration from:', configPath);
              initializeApp(true);
            }
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  initializeApp();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!windowManager || !windowManager.getWindow()) {
    initializeApp();
  }
});
