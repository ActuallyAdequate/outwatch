const fs = require('fs');
const path = require('path');
const marked = require('marked');

const extensionsDir = path.join(__dirname, 'marked_extensions');
const extensions = [];

fs.readdirSync(extensionsDir).forEach(file => {
  if (file.endsWith('.js')) {
    const extensionModule = require(path.join(extensionsDir, file));
    for (const extension of Object.keys(extensionModule)) {
        extensions.push(extensionModule[extension]);
    }
    
  }
});
// Apply all extensions
marked.use({extensions: extensions});