import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import puppeteer, {Page} from "puppeteer";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const extPath = path.join(__dirname, "..", "ISDCAC");
const FILENAME = "document.pdf";
const dummyUrl = "https://www.vg.no";

const exists = util.promisify(fs.exists);
const unlink = util.promisify(fs.unlink);

export async function acceptCookiesFromPopup(page: Page, popupSelector: string, acceptButtonSelector: string) {
  try {
    // Waiting for the cookie consent popup to appear
    await page.waitForSelector(popupSelector);

    // Clicking the "Accept" button to accept cookies
    await page.click(acceptButtonSelector);

    // Cookies have been accepted successfully
    return true;
  } catch (error) {
    // An error occurred while accepting cookies
    console.error("-> Error handling the cookie popup:", error);
    return false;
  }
}

export async function runPupWithUrl(websiteUrl = dummyUrl ) {
  // Remove the PDF file if it already exists
  if (await exists(FILENAME)) {
    await unlink(FILENAME);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
    ],
  });

  const page = await browser.newPage();

  await page.goto(websiteUrl, {waitUntil: "networkidle0"});
  await page.emulateMediaType("screen");
  sleep(1000);

  const pdf = await page.pdf({
    path: FILENAME,
    margin: {top: "100px", right: "50px", bottom: "100px", left: "50px"},
    printBackground: true,
    format: "A4",
  });

  await browser.close();

  return pdf;
}

export async function runPupWithContent(websiteUrl = dummyUrl ) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
    ],
  });

  const page = await browser.newPage();

  await page.goto(websiteUrl, {waitUntil: "networkidle0"});
  await page.emulateMediaType("screen");

  if (await exists(FILENAME)) {
    await unlink(FILENAME);
  }

  const pdf = await page.pdf({
    path: FILENAME,
    margin: {top: "100px", right: "50px", bottom: "100px", left: "50px"},
    printBackground: true,
    format: "A4",
  });

  await browser.close();

  return pdf;
}

