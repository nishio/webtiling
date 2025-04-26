const { BrowserWindow } = require('electron');

class WindowManager {
  constructor(config) {
    this.config = config;
    this.window = null;
  }

  createWindow() {
    this.window = new BrowserWindow({
      width: this.config.window.width || 1920,
      height: this.config.window.height || 1080,
      title: this.config.window.title || 'Tiled Web Pages',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    return this.window;
  }

  getWindow() {
    return this.window;
  }

  closeWindow() {
    if (this.window) {
      this.window.close();
      this.window = null;
    }
  }
}

module.exports = WindowManager;
