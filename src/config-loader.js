const fs = require('fs');
const path = require('path');

class ConfigLoader {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = null;
    console.log('ConfigLoader initialized with path:', this.configPath);
  }

  loadConfig() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      return true;
    } catch (error) {
      console.error('Error loading config:', error);
      return false;
    }
  }

  getConfig() {
    return this.config;
  }

  validateConfig() {
    if (!this.config) {
      return false;
    }

    if (!this.config.window) {
      console.error('Window configuration is missing');
      return false;
    }

    if (!this.config.tiles || !Array.isArray(this.config.tiles) || this.config.tiles.length === 0) {
      console.error('Tiles configuration is missing or invalid');
      return false;
    }

    for (const tile of this.config.tiles) {
      if (!tile.url) {
        console.error('Tile URL is missing');
        return false;
      }

      if (!tile.position || 
          typeof tile.position.x !== 'number' || 
          typeof tile.position.y !== 'number' || 
          typeof tile.position.width !== 'number' || 
          typeof tile.position.height !== 'number') {
        console.error('Tile position is missing or invalid');
        return false;
      }
    }

    return true;
  }
}

module.exports = ConfigLoader;
