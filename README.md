# Simple WYSIWYG Editor

A lightweight, modern, and dependency-free WYSIWYG editor that can be easily integrated into any web project.

## Features

- Clean, minimal interface
- Essential text formatting (bold, italic, underline)
- Precise font size control (12px to 48px)
- Headings (H1-H6)
- Code blocks and blockquotes
- Lists and text alignment
- Modern design with customizable theme
- No dependencies (except Font Awesome for icons)

## Installation

1. Download the required files:
   - `wysiwyg.js`
   - `wysiwyg.css`

2. Add Font Awesome and the editor files to your HTML:
```html
<!-- Add Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Add the editor files -->
<link rel="stylesheet" href="path/to/wysiwyg.css">
<script src="path/to/wysiwyg.js"></script>
```

## Usage

1. Add a container element in your HTML:
```html
<div id="editor"></div>
```

2. Initialize the editor:
```javascript
const editor = new SimpleWYSIWYG('#editor');
```

## API Methods

### Get Content
```javascript
// Get HTML content
const html = editor.getContent();

// Get plain text
const text = editor.getText();
```

### Set Content
```javascript
// Set HTML content
editor.setContent('<h1>Hello World!</h1>');

// Set plain text
editor.setText('Hello World!');
```

### Event Listener
```javascript
// Listen for content changes
window.addEventListener('wysiwyg-change', (e) => {
    const html = e.detail.html;
    const text = e.detail.text;
});
```

### Global Variables
The editor also provides global variables for easy access in any context:
```javascript
// Access content globally
const html = window.wysiwygHTML;
const text = window.wysiwygText;
```

## Example

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="path/to/wysiwyg.css">
</head>
<body>
    <div id="editor"></div>
    
    <script src="path/to/wysiwyg.js"></script>
    <script>
        const editor = new SimpleWYSIWYG('#editor');
        editor.setContent('<h1>Hello World!</h1>');
    </script>
</body>
</html>
```

## Customization

The editor uses CSS variables for easy theming. You can override these variables to match your website's design:

```css
:root {
    --editor-primary: #3b82f6;    /* Primary color for accents */
    --editor-border: #e5e7eb;     /* Border color */
    --editor-bg: #ffffff;         /* Background color */
    --editor-text: #374151;       /* Text color */
    --editor-hover-bg: #f3f4f6;   /* Hover background color */
    --editor-active-bg: #e5e7eb;  /* Active/pressed state color */
}
```

## License

MIT License 