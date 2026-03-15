const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
        localStorage.setItem('token', 'dummy');
        localStorage.setItem('user', JSON.stringify({ id: 1, role: 'Admin' }));
    });
    await page.goto('http://localhost:5173/inquiries');
    await page.waitForSelector('table', { timeout: 5000 }).catch(() => null);
    const btns = await page.$$('button');
    for (let b of btns) {
        const text = await page.evaluate(el => el.textContent, b);
        if (text.includes('Neue Anfrage') || text.includes('Erste Anfrage erstellen')) {
            await b.click();
            break;
        }
    }
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:\\Users\\vlado\\.gemini\\antigravity\\brain\\f4f29da8-5665-4e0e-b138-e956df92d36c\\frontend-inquiries-modal.png' });
    await browser.close();
})();
