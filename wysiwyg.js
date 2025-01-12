class SimpleWYSIWYG {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) {
            throw new Error('Container element not found');
        }
        
        // Set custom submit handler if provided
        this.onSubmit = options.onSubmit || null;
        
        this.init();
        
        // Create global access point
        window.simpleEditor = this;
        
        // Create global variables for submitted content
        window.wysiwygSubmittedHTML = '';
        window.wysiwygSubmittedText = '';
    }

    init() {
        // Create wrapper for editor and submit button
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'simple-wysiwyg-wrapper';
        
        // Create toolbar
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'simple-wysiwyg-toolbar';
        
        // Create editor content area
        this.editor = document.createElement('div');
        this.editor.className = 'simple-wysiwyg-editor';
        this.editor.contentEditable = true;

        // Create submit button container
        this.submitContainer = document.createElement('div');
        this.submitContainer.className = 'simple-wysiwyg-submit-container';
        
        // Create submit button
        this.submitButton = document.createElement('button');
        this.submitButton.className = 'simple-wysiwyg-submit';
        this.submitButton.innerHTML = '<i class="fas fa-check"></i> Submit';
        this.submitButton.addEventListener('click', () => this.handleSubmit());
        
        // Add toolbar buttons
        const buttons = [
            // Text style
            { command: 'bold', icon: '<i class="fas fa-bold"></i>', title: 'Bold' },
            { command: 'italic', icon: '<i class="fas fa-italic"></i>', title: 'Italic' },
            { command: 'underline', icon: '<i class="fas fa-underline"></i>', title: 'Underline' },
            { command: 'strikethrough', icon: '<i class="fas fa-strikethrough"></i>', title: 'Strikethrough' },
            { type: 'separator' },
            
            // Font size dropdown
            { type: 'select', options: [
                { value: '12px', text: '12px' },
                { value: '14px', text: '14px' },
                { value: '16px', text: '16px' },
                { value: '18px', text: '18px' },
                { value: '20px', text: '20px' },
                { value: '24px', text: '24px' },
                { value: '28px', text: '28px' },
                { value: '32px', text: '32px' },
                { value: '36px', text: '36px' },
                { value: '48px', text: '48px' }
            ], command: 'fontSize', title: 'Font Size', customHandler: (value) => {
                document.execCommand('fontSize', false, '7');
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const span = selection.getRangeAt(0).commonAncestorContainer;
                    if (span.nodeType === 3) {
                        span.parentElement.style.fontSize = value;
                    } else {
                        span.style.fontSize = value;
                    }
                }
            }},
            { type: 'separator' },
            
            // Blocks dropdown
            { type: 'select', options: [
                { value: 'p', text: 'Paragraph', icon: '<i class="fas fa-paragraph"></i>' },
                { value: 'h1', text: 'Heading 1', icon: '<i class="fas fa-heading"></i> 1' },
                { value: 'h2', text: 'Heading 2', icon: '<i class="fas fa-heading"></i> 2' },
                { value: 'h3', text: 'Heading 3', icon: '<i class="fas fa-heading"></i> 3' },
                { value: 'h4', text: 'Heading 4', icon: '<i class="fas fa-heading"></i> 4' },
                { value: 'h5', text: 'Heading 5', icon: '<i class="fas fa-heading"></i> 5' },
                { value: 'h6', text: 'Heading 6', icon: '<i class="fas fa-heading"></i> 6' },
                { value: 'pre', text: 'Code Block', icon: '<i class="fas fa-code"></i>' },
                { value: 'blockquote', text: 'Blockquote', icon: '<i class="fas fa-quote-right"></i>' }
            ], command: 'formatBlock', title: 'Format Block', className: 'simple-wysiwyg-block-select' },
            { type: 'separator' },
            
            // Lists
            { command: 'insertUnorderedList', icon: '<i class="fas fa-list-ul"></i>', title: 'Bullet List' },
            { command: 'insertOrderedList', icon: '<i class="fas fa-list-ol"></i>', title: 'Numbered List' },
            { type: 'separator' },
            
            // Alignment
            { command: 'justifyLeft', icon: '<i class="fas fa-align-left"></i>', title: 'Align Left' },
            { command: 'justifyCenter', icon: '<i class="fas fa-align-center"></i>', title: 'Center' },
            { command: 'justifyRight', icon: '<i class="fas fa-align-right"></i>', title: 'Align Right' },
            { command: 'justifyFull', icon: '<i class="fas fa-align-justify"></i>', title: 'Justify' },
            { type: 'separator' },
            
            // Insert link
            { command: 'createLink', icon: '<i class="fas fa-link"></i>', title: 'Insert Link', prompt: true },
        ];

        buttons.forEach(btn => {
            if (btn.type === 'separator') {
                const separator = document.createElement('span');
                separator.className = 'simple-wysiwyg-separator';
                this.toolbar.appendChild(separator);
                return;
            }

            if (btn.type === 'select') {
                const select = document.createElement('select');
                select.className = `simple-wysiwyg-select ${btn.className || ''}`;
                select.title = btn.title;
                
                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = btn.title;
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);
                
                btn.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.innerHTML = opt.icon ? `${opt.icon} ${opt.text}` : opt.text;
                    select.appendChild(option);
                });
                
                select.addEventListener('change', () => {
                    if (btn.customHandler) {
                        btn.customHandler(select.value);
                    } else {
                        document.execCommand(btn.command, false, select.value);
                    }
                    select.selectedIndex = 0; // Reset to default option
                    this.editor.focus();
                    this.emitChange();
                });
                
                this.toolbar.appendChild(select);
                return;
            }

            const button = document.createElement('button');
            button.innerHTML = btn.icon;
            button.title = btn.title;
            button.className = 'simple-wysiwyg-btn';
            
            button.addEventListener('click', () => {
                if (btn.prompt) {
                    const url = prompt('Enter URL:');
                    if (url) {
                        document.execCommand(btn.command, false, url);
                    }
                } else if (btn.command === 'formatBlock') {
                    document.execCommand(btn.command, false, btn.value);
                } else {
                    document.execCommand(btn.command);
                }
                this.editor.focus();
                this.emitChange();
            });
            
            this.toolbar.appendChild(button);
        });

        // Append elements to container
        this.container.appendChild(this.wrapper);
        this.wrapper.appendChild(this.toolbar);
        this.wrapper.appendChild(this.editor);
        this.wrapper.appendChild(this.submitContainer);
        this.submitContainer.appendChild(this.submitButton);

        // Add input event listener
        this.editor.addEventListener('input', () => this.emitChange());
    }

    // Get HTML content
    getContent() {
        return this.editor.innerHTML;
    }

    // Get plain text content
    getText() {
        return this.editor.innerText;
    }

    // Set content (HTML)
    setContent(html) {
        this.editor.innerHTML = html;
        this.emitChange();
    }

    // Set plain text
    setText(text) {
        this.editor.innerText = text;
        this.emitChange();
    }

    // Emit change event with data
    emitChange() {
        const event = new CustomEvent('wysiwyg-change', {
            detail: {
                html: this.getContent(),
                text: this.getText()
            }
        });
        window.dispatchEvent(event);

        // Also update global variables for easy access
        window.wysiwygHTML = this.getContent();
        window.wysiwygText = this.getText();
    }

    handleSubmit() {
        const html = this.getContent();
        const text = this.getText();
        
        // Update global variables
        window.wysiwygSubmittedHTML = html;
        window.wysiwygSubmittedText = text;
        
        // Call custom submit handler if provided
        if (typeof this.onSubmit === 'function') {
            this.onSubmit({ html, text });
        }
    }

    // Method to set submit handler after initialization
    setSubmitHandler(handler) {
        if (typeof handler === 'function') {
            this.onSubmit = handler;
        } else {
            throw new Error('Submit handler must be a function');
        }
    }
}

// Make it available globally when loaded via CDN
if (typeof window !== 'undefined') {
    window.SimpleWYSIWYG = SimpleWYSIWYG;
} 