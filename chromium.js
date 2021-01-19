const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function createBrowser() {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
    });
    return browser;
}

async function getContent(url) {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
    });

    const page = await browser.newPage();
    await page.goto(url);
    const content = await page.content();
    browser.close();
    return content;
}

async function getScreenshot(url, type, quality) {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
    });

    const page = await browser.newPage();
    await page.goto(url);
    const file = await page.screenshot({ type, quality, fullPage: true });
    browser.close();
    return file;
}

module.exports = { getContent, getScreenshot };
