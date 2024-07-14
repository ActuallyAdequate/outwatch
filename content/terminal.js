document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const scriptElement = document.querySelector('script[src="terminal.js"]');
    const terminalDataName = scriptElement.getAttribute('terminal-data');
    const baseURL = `${window.location.protocol}//${window.location.host}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}`;
    const terminalDataURL = `${baseURL}/${terminalDataName}`;

    let terminalData = null;

    fetch(terminalDataURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {            
            terminalData = data;
            processCommand("loaded?")
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    terminalInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const input = terminalInput.value.trim();
            if (input) {
                processCommand(input);
                terminalInput.value = '';
            }
        }
    });

    const processCommand = (input) => {
        const output = document.createElement('div');
        output.textContent = `> ${input}`;
        terminalOutput.appendChild(output);

        const response = getResponse(input);
        const responseOutput = document.createElement('div');
        responseOutput.innerHTML = response;
        terminalOutput.appendChild(responseOutput);

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const getResponse = (input) => {
        const parts = input.toLowerCase().split(' ');
        if(terminalData == null) {
            input = 'loaded?';
        }
        switch(parts[0]) {
            case 'help':
                return 'Available commands: list, read, ping, connect';
            case 'read':
                return readTerminalData(terminalData['read'], parts[1]);
            case 'list':
                return listTerminalData(terminalData['read']);
            case 'connect':
                return connectTerminalData(terminalData['connect'], parts[1]);
            case 'ping':
                return pingTerminalData(terminalData['connect']);
            case 'loaded?':
                return terminalData == null ? "Terminal data has not yet been loaded please wait a few seconds and try again" : 'Terminal data retrieved begin by typing help';
            default:
                return 'Unkown command type help to view available commands'
        }  
    } 
    
    const readTerminalData = (readData, request) => {
        if(readData == null) {
            return "No data was found to read, type help for other commands";
        }
        if(readData[request] == null ) {
            return `The data ${request} does not exist, type list to view available data`
        }
        return readData[request];
    }

    const listTerminalData = (readData) => {
        if(readData == null) {
            return "No data was found to read, type help for other commands";
        }
        let requests = Object.keys(readData);
        let output = requests.join(", ");
        return `Available data to read: ${output}`;
    }

    const connectTerminalData = (connectData, request) => {
        if(connectData == null) {
            return "No records to connect to, type help for other commands";
        }
        if(connectData[request] == null ) {
            return `The node ${request} could not be reached, type ping to view available nodes`
        }
        setTimeout(() => {
            window.location.assign(`${baseURL}/${connectData[request]}`)
        }, 2000);
        return `Connecting to ${request}...`;   
    }

    const pingTerminalData = (connectData) => {
        if(connectData == null) {
            return "No records to connect to, type help for other commands";
        }
        let requests = Object.keys(connectData);
        let output = requests.join(", ");
        return `Available nodes to connect to: ${output}`;
    }
});
