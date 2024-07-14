# The Blooded Pond

<script>
document.addEventListener('DOMContentLoaded', () => {
    const buttonElem = document.getElementById('decrypt');
    const keyElem = document.getElementById('key');
    console.log(buttonElem)
    buttonElem.addEventListener('click', () => {
        console.log("clicking")
        if(keyElem.value == "K0cryptson#") {
            console.log("decrypting")
            const baseURL = `${window.location.protocol}//${window.location.host}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}`;
            const url = `${baseURL}/waywardblackbox_record.html`;
            window.location.assign(url);
        }
    });
});
</script>

The following is a transcript of an audio recording left by Disnin Kolar xenobiologist of Expedition 4.

> *Static* ---- I have seen you, you little Gods. The living quake for the undying. *Wretching and Coughing* ---- I have myself a flower among the cotton. A knife in the brambles. *Static* ---- *Radio Over* --- 'Kolar Report In' '30 minutes of light' 'Kolar Return...Disnin! Where are you' 'Voice Theft!' 'Disnin comeback to the ship we are sending our report for the artifact' *Radio Shutoff* --- Little fishes with skin so thick, Darwin's mercy as I take a sip.

```cli
The indexer has identified an encrypted connection, searching expedition 4 for decryption key...
```

<button id="decrypt">Decrypt</button><input id="key" autocomplete="off"/>
