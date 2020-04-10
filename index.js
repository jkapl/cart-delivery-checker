const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { username, password } = require('./credentials.js');

const signInPage = 'https://www.amazon.com/gp/sign-in.html/ref=cart_empty_sign_in?path=%2Fgp%2Fcart%2Fview.html%3Fapp-nav-type%3Dnone%26dc%3Ddf&useRedirectOnSuccess=1'

const orderMyFood = async function () {
  puppeteer.launch().then(async browser => {
  
  const page = await browser.newPage();
  //sign in with email page
  await page.setViewport({
    width: 1080,
    height: 760
  })
  await page.goto(signInPage);

  await page.type('#ap_email', username);
  // await page.screenshot({path: 'example.png'});
  await page.click('#continue')
  await page.waitFor(2000)
  //enter password page 
  await page.type('#ap_password', password);
  await page.click('#signInSubmit')
  await page.waitFor(2000)
  //homepage
  // await page.screenshot({path: 'example2.png'});
  await page.click('#nav-cart');
  await page.waitFor(2000);
  //cart
  await page.click('.a-button-inner')
  await page.waitFor(2000)
  //before you checkout
  // await page.screenshot({path: 'example3.png'});
  await page.click('a[name="proceedToCheckout"]')
  await page.waitFor(2000)
  //substitution preferences
  // await page.screenshot({path: 'example4.png'});
  // await page.click('input[class="a-button-input"');
  await page.click('.a-box-inner');
  await page.waitFor(10000);
  //Either schedule your order or reenter password page
  // await page.screenshot({path: 'example5.png'});
  // const pageText = await checkPageForTime(page);
  await waitForTime(page);
  // await page.screenshot({path: 'example6.png'});
  await page.$$eval('.ufss-slot-price-text', prices => prices.forEach(price => price.innerText !== 'Not available' ? price.click() : ''));
  await page.waitFor(10000);
  await page.screenshot({path: 'example7.png'});
  
  await page.click('.a-button-input');
  // await page.click('.a-button-inner');
  
  await page.waitFor(15000);
  // ------------------------

  // await page.screenshot({path: 'example8.png'});
  // let html = await page.content();
  // fs.writeFileSync(path.join(__dirname, './page.html'), html);
  // await page.click('.place-your-order-button');
  // await page.click('.a-button-input');
  // await page.click('.a-button-inner');
  await waitForTime(page);
  await page.click('.continue-buttons')
  await page.waitFor(10000);
  // await page.screenshot({path: 'example9.png'})
  // html = await page.content();
  // fs.writeFileSync(path.join(__dirname, './page2.html'), html);
  //wrong button: this is something on the credit card: await page.click('.a-button-inner');
  // await page.click('.continue-buttons')
  await page.click('.place-your-order-button');
  // await page.click('#continue-top')
  
  await page.waitFor(10000);

  // await page.screenshot({path: 'example10.png'})
  await waitForTime(page);
  // html = await page.content();
  // fs.writeFileSync(path.join(__dirname, './page3.html'), html);
  browser.close();
  }
)};
try {
  orderMyFood();
} catch (err) {
  throw(err);
}

// add selector by color
//#f0c14b

async function waitForTime (page) {
  let pageText = await page.$$eval('.a-alert-heading', alerts => alerts.map(alert => alert.innerText));
  console.log(pageText[0]);
  let count = 0;
  while (pageText[0] == 'Due to increased demand, available windows are limited. Please check back later or shop a Whole Foods Market near you.') {
    count = count + 1;
    console.log(`refresh #${count}`);
    if (count % 30 === 0) {
      await page.screenshot({path: `time-slot-example-${count/30}.png`})
    }
    await page.waitFor(5000)
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    pageText = await page.$$eval('.a-alert-heading', alerts => alerts.map(alert => alert.innerText));
  }
  return true;
}
