const advancedImage = {
    name: 'advancedImage',
    level: 'inline',
    tokenizer(src) {
        const match = /^!\[(?:(\<|\>|\_)\|)?([a-zA-Z0-9\s\.\,\_\%\*\#\@\!\"\'\`\~\^\:\;\$\&\-]*)(?:\|([0-9]+))?\]\(([a-zA-Z0-9\.\_\-]*)\)(?:\(([a-zA-Z0-9\.\_\-]*)\))?/.exec(src);
        if (match) {
            const [ _ , align, imageText, width, imageUrl, url] = match;
            return {
                type: 'advancedImage',
                raw: match[0],
                imageText: imageText.trim(),
                imageUrl: (imageUrl || '').trim(),
                url: (url || '').trim().replace(/\.md$/, '.html'),
                align: align,
                width: width
            };
        }
    },
    renderer(token) {

        const align = token.align == "_" ? "display:block; margin: auto;" : (token.align == "<" ? "float: left;" : ( token.align == ">" ? "float: right;" : '' ))
        const width = token.width == undefined ? '' : `width: ${token.width}%`
        return `<a class="image-link" ${token.url !== '' ? `href="${token.url}"` : ''}>
                    <img 
                        alt="${token.imageText}" 
                        src="${token.imageUrl}" 
                        title="${token.imageText}"
                        ${align != '' || width != '' ? `style="${align} ${width}"` : '' }
                    >
                </a>`;
    }
};

  module.exports = {
    advancedImage
  }