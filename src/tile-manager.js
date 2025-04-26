const { BrowserView } = require('electron');

class TileManager {
  constructor(window, config) {
    this.window = window;
    this.config = config;
    this.tiles = [];
  }

  createTiles() {
    if (!this.window || !this.config.tiles) {
      console.error('Window or tiles configuration is missing');
      return;
    }

    this.config.tiles.forEach((tileConfig, index) => {
      const view = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });
      
      this.window.addBrowserView(view);
      
      view.setBounds({
        x: tileConfig.position.x,
        y: tileConfig.position.y,
        width: tileConfig.position.width,
        height: tileConfig.position.height
      });
      
      view.webContents.loadURL(tileConfig.url);
      
      this.tiles.push({
        view,
        config: tileConfig
      });
    });

    return this.tiles;
  }

  getTiles() {
    return this.tiles;
  }

  removeTiles() {
    this.tiles.forEach(tile => {
      this.window.removeBrowserView(tile.view);
    });
    this.tiles = [];
  }
}

module.exports = TileManager;
