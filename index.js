const { app, BrowserWindow } = require('electron')
const path = require('path');

app.commandLine.appendSwitch("--no-sandbox");

const ALLOWED_URLS = [
    'https://gemini.google.com/',
    'https://accounts.google.com/'
];

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            devTools: false,
            sandbox: false,
            contextIsolation: true
        },
        title: "Gemini ✴️"
    });

    // Force the title to stay as "Gemini" even if page changes it
    win.on('page-title-updated', (e) => {
        e.preventDefault();
        win.setTitle('Gemini');
    });

    // URL filtering
    win.webContents.on('will-navigate', (event, url) => {
        const isAllowed = ALLOWED_URLS.some(allowedUrl =>
            url.startsWith(allowedUrl)
        );
        if (!isAllowed) {
            event.preventDefault();
            win.loadURL('https://gemini.google.com/');
        }
    });

    // Handle redirects in new windows
    app.on('web-contents-created', (event, contents) => {
        contents.on('will-navigate', (event, url) => {
            const isAllowed = ALLOWED_URLS.some(allowedUrl =>
                url.startsWith(allowedUrl)
            );
            if (!isAllowed) {
                event.preventDefault();
                contents.destroy();
            }
        });
    });

    win.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Alt' || input.key === 'F10') {
            event.preventDefault(); // Megakadályozza a menü megjelenését
        }
    });

    win.setMenu(null); // Teljesen letiltja a menüt
    win.loadURL('https://gemini.google.com/')
}

app.whenReady().then(() => {
    createWindow()
})
