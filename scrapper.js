const puppeteer = require("puppeteer");
require('dotenv').config();

const scrapper = async () => {
  const browser = await puppeteer.launch({
    args:[
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: true,
    executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  await page.goto("https://deprem.afad.gov.tr/last-earthquakes");

  const data = await page.evaluate(function () {
    const events = document.querySelectorAll("tbody>tr");
    const array = [];
      try {
        for (i = 0; i < events.length; i++) {
          array.push({
            fullDate: events[i].querySelector("td").innerText,
            date: events[i].querySelector("td").innerText.split(' ')[0],
            hour: events[i].querySelector("td").innerText.split(' ')[1],
            latitude: events[i].querySelector("td:nth-child(2)").innerText,
            longitude: events[i].querySelector("td:nth-child(3)").innerText,
            depth: events[i].querySelector("td:nth-child(4)km").innerText,
            magnitude: events[i].querySelector("td:nth-child(6)").innerText,
            location: events[i].querySelector("td:nth-child(7)").innerText,
          });
        }
      } catch(e){
        array.push({ Error: 'Bir hata ile karşılaşıldı. Lütfen tarayıcınızı değiştirmeyi veya siteyi yenilemeyi deneyiniz.'}); 
      } 
   return array;
  });
  return data;
};



module.exports = scrapper;