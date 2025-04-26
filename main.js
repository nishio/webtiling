const { app } = require('electron');
const path = require('path');

const ConfigLoader = require('./src/config-loader');
const WindowManager = require('./src/window-manager');
const TileManager = require('./src/tile-manager');
const OffsetController = require('./src/offset-controller');

let windowManager;
let tileManager;
let offsetController;

function initializeApp() {
  const configLoader = new ConfigLoader(path.join(__dirname, 'config.json'));
  if (!configLoader.loadConfig() || !configLoader.validateConfig()) {
    console.error('Failed to load or validate configuration. Exiting...');
    app.quit();
    return;
  }
  
  const config = configLoader.getConfig();
  
  windowManager = new WindowManager(config);
  const mainWindow = windowManager.createWindow();
  
  tileManager = new TileManager(mainWindow, config);
  tileManager.createTiles();
  
  offsetController = new OffsetController(tileManager);
  offsetController.applyOffsets();
  
  console.log('Application initialized successfully with', config.tiles.length, 'tiles');
}

app.whenReady().then(initializeApp);

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
