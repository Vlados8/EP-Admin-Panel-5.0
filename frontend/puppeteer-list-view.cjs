const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log('Navigating to http://localhost:5173/login to mock auth...');
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

        // Let's assume there is a mock auto-login or we just navigate
        // Actually since we don't have the login credentials here, let's just go to inquiries
        // Wait, auth is required. We'll use the same trick as before.

        await page.evaluate(() => {
            localStorage.setItem('token', 'dummy_token');
            localStorage.setItem('user', JSON.stringify({
                id: 1,
                name: "System Admin",
                role: "Admin"
            }));
        });

        console.log('Navigating to http://localhost:5173/inquiries...');
        await page.goto('http://localhost:5173/inquiries', { waitUntil: 'networkidle0' });

        // Wait for list to load
        await page.waitForSelector('table', { timeout: 5000 }).catch(() => console.log('Timeout waiting for table'));

        // Take a screenshot
        const screenshotPath = 'C:\\Users\\vlado\\.gemini\\antigravity\\brain\\f4f29da8-5665-4e0e-b138-e956df92d36c\\frontend-inquiries-list-view.png';
        await page.screenshot({ path: screenshotPath });
        console.log('Captured inquiries list view screenshot.');

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
        console.log('Done.');
    }
})();
