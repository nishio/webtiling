# Tiled Web Pages

An Electron application that displays multiple web pages in a tiled layout according to a JSON configuration file.

## Features

- Load web pages in a tiled layout
- Configure tile positions and sizes via JSON
- Set scroll offsets for each web page
- Simple and lightweight

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tiled-web-pages.git

# Navigate to the project directory
cd tiled-web-pages

# Install dependencies
npm install
```

## Usage

1. Edit the `config.json` file to specify your desired layout:

```json
{
  "window": {
    "width": 1920,
    "height": 1080,
    "title": "Tiled Web Pages"
  },
  "tiles": [
    {
      "url": "https://example.com",
      "position": {
        "x": 0,
        "y": 0,
        "width": 640,
        "height": 480
      },
      "offset": {
        "x": 0,
        "y": 100
      }
    },
    {
      "url": "https://another-example.com",
      "position": {
        "x": 640,
        "y": 0,
        "width": 640,
        "height": 480
      },
      "offset": {
        "x": 50,
        "y": 0
      }
    }
  ]
}
```

2. Run the application:

```bash
npm start
```

## Configuration Options

### Window Configuration

- `width`: Width of the main window in pixels
- `height`: Height of the main window in pixels
- `title`: Title of the main window

### Tile Configuration

- `url`: URL of the web page to display
- `position`: Position and size of the tile
  - `x`: X coordinate of the tile
  - `y`: Y coordinate of the tile
  - `width`: Width of the tile
  - `height`: Height of the tile
- `offset`: Scroll offset of the web page
  - `x`: Horizontal scroll offset
  - `y`: Vertical scroll offset

## License

MIT
