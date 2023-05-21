const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const { executablePath } = require("puppeteer");

const scrapper = async () => {
  const browser = await puppeteer.launch({
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chrome.defaultViewport,
    executablePath: await executablePath(),
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto("https://deprem.afad.gov.tr/last-earthquakes.html");

  const data = await page.evaluate(function () {
    const events = document.querySelectorAll("tbody>tr");
    const array = [];
    for (i = 0; i < events.length; i++) {
      array.push({
        date: events[i].querySelector("td").innerText,
        latitude: events[i].querySelector("td:nth-child(2)").innerText,
        longitude: events[i].querySelector("td:nth-child(3)").innerText,
        depth: events[i].querySelector("td:nth-child(4)").innerText,
        magnitude: events[i].querySelector("td:nth-child(6)").innerText,
        location: events[i].querySelector("td:nth-child(7)").innerText,
      });
    }
    return array;
  });
  return data;
};

module.exports = scrapper;
