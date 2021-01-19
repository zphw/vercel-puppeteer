const { parse } = require('url');
const { timingSafeEqual } = require('crypto');
const { getContent, getScreenshot } = require('./chromium');
const { getInt, getUrlFromPath, isValidUrl } = require('./validator');

const SECRET_KEY = process.env.SECRET_KEY || 'test';

const compare = (a, b) => {
    try {
        return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
    } catch {
        return false;
    }
};

module.exports = async function (req, res) {
    if (!compare(req.query.key, SECRET_KEY)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Bad ?key=</h1><p>Permission denied</p>');
        return;
    }
    try {
        const { pathname = '/', query = {} } = parse(req.url, true);
        const { act = 'content', type = 'png', quality } = query;
        const url = getUrlFromPath(pathname);
        const qual = getInt(quality) || 100;

        if (!isValidUrl(url)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<h1>Bad Request</h1><p>The url <em>${url}</em> is not valid.</p>`);
        } else {
            if (act === 'content') {
                res.setHeader('Content-Type', 'text/plain');
                const output = await getContent(url);
            } else {
                res.setHeader('Content-Type', `image/${type}`);
                const output = await getScreenshot(url, type, qual);
            }
            
            res.statusCode = 200;
            res.end(output);
        }
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
    }
};
