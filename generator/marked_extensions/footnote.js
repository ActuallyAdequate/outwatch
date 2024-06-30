const footnote = {
    name: 'footnote',
    level: 'inline',
    tokenizer(src) {
        const match = /^\[\^([a-zA-Z0-9]+)\]/.exec(src);
        
        if (match) {
            console.log(match);
            const [_, id] = match;
            return {
                type: 'footnote',
                raw: match[0],
                id,
            };
        }
    },
    renderer(token) {
        return `<sup><a href="#${token.id}">${token.id}</a></sup>`;
    }
};

const footnotedesc = {
    name: 'footnotedesc',
    level: 'inline',
    tokenizer(src) {
        const match = /^\[\^?([a-zA-Z0-9]+)\]\:/.exec(src);
        
        if (match) {
            console.log(match);
            const [_, id] = match;
            return {
                type: 'footnotedesc',
                raw: match[0],
                id,
            };
        }
    },
    renderer(token) {
        return `<span class="footnotedesc" id="${token.id}">${token.id}</span>`;
    }
};

module.exports = {
    footnote,
    footnotedesc
  }