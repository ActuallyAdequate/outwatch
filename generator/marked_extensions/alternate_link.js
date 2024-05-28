const alternateLink = {
    name: 'alternateLink',
    level: 'inline',
    tokenizer(src) {
        const match = /^\[([^\]]+)\]\(([^)]+\.md)\)/.exec(src);
        if (match) {
            const [_, text, url] = match;
            return {
                type: 'alternateLink',
                raw: match[0],
                text: text,
                url: url.replace(/\.md$/, '.html')
            };
        }
    },
    renderer(token) {
        return `<a href="${token.url}">${token.text}</a>`;
    }
};

module.exports = {
    alternateLink
  }
