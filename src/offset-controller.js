class OffsetController {
  constructor(tileManager) {
    this.tileManager = tileManager;
  }

  applyOffsets() {
    const tiles = this.tileManager.getTiles();
    
    if (!tiles || tiles.length === 0) {
      console.error('No tiles available to apply offsets');
      return;
    }

    tiles.forEach(tile => {
      const { view, config } = tile;
      
      if (config.offset) {
        view.webContents.on('did-finish-load', () => {
          this.applyOffsetToView(view, config.offset);
        });
      }
    });
  }

  applyOffsetToView(view, offset) {
    if (!view || !offset) return;
    
    const x = offset.x || 0;
    const y = offset.y || 0;
    
    view.webContents.executeJavaScript(`
      window.scrollTo(${x}, ${y});
    `).catch(err => {
      console.error('Error applying offset:', err);
    });
  }

  updateOffset(tileIndex, newOffset) {
    const tiles = this.tileManager.getTiles();
    
    if (!tiles || !tiles[tileIndex]) {
      console.error(`Tile at index ${tileIndex} not found`);
      return;
    }
    
    const { view } = tiles[tileIndex];
    this.applyOffsetToView(view, newOffset);
  }
}

module.exports = OffsetController;
