const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function createBrowser() {
    const options = {
        args: [...chrome.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--window-position=0,0', '--ignore-certifcate-errors', '--ignore-certifcate-errors-spki-list'],
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
        ignoreHTTPSErrors: true,
    };

    const browser = await puppeteer.launch(options);
    return browser;
}

async function getContent(url) {
    const browser = await createBrowser();

    const page = await browser.newPage();
    const response = await page.goto(url);
    await page.setContent((await response.buffer()).toString('utf8'));
    const content = await page.content();
    browser.close();
    return content;
}

async function getScreenshot(url, type, quality) {
    const browser = await createBrowser();

    const page = await browser.newPage();
    const response = await page.goto(url);
    await page.setContent((await response.buffer()).toString('utf8'));
    const file = await page.screenshot({ type, quality, fullPage: true });
    browser.close();
    return file;
}

module.exports = { getContent, getScreenshot };
