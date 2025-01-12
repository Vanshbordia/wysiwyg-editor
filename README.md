# Simple WYSIWYG Editor

A lightweight, modern, and dependency-free WYSIWYG editor that can be easily integrated into any web project.

## Features

- Clean, minimal interface
- Essential text formatting (bold, italic, underline)
- Precise font size control (12px to 48px)
- Headings (H1-H6)
- Code blocks and blockquotes
- Lists and text alignment
- Customizable submit handler
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

2. Initialize the editor with an optional submit handler:
```javascript
// Method 1: Set handler during initialization
const editor = new SimpleWYSIWYG('#editor', {
    onSubmit: ({ html, text }) => {
        // Handle submitted content
        console.log('Submitted HTML:', html);
        console.log('Submitted Text:', text);
    }
});

// Method 2: Set handler after initialization
editor.setSubmitHandler(({ html, text }) => {
    // Handle submitted content
    console.log('Submitted HTML:', html);
    console.log('Submitted Text:', text);
});
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

### Submit Handler
```javascript
// Set submit handler
editor.setSubmitHandler(({ html, text }) => {
    // Example: Send to server
    fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ html, text }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
});
```

### Global Variables
The editor provides global variables for easy access:

```javascript
// Real-time content (updates on every change)
const html = window.wysiwygHTML;
const text = window.wysiwygText;

// Submitted content (updates when submit button is clicked)
const submittedHtml = window.wysiwygSubmittedHTML;
const submittedText = window.wysiwygSubmittedText;
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
        // Initialize editor with submit handler
        const editor = new SimpleWYSIWYG('#editor', {
            onSubmit: ({ html, text }) => {
                // Example: Update form fields
                document.getElementById('content-html').value = html;
                document.getElementById('content-text').value = text;
                
                // Example: Save to localStorage
                localStorage.setItem('savedContent', html);
                
                // Example: Send to server
                fetch('/api/save', {
                    method: 'POST',
                    body: JSON.stringify({ html, text })
                });
            }
        });

        // Set initial content
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