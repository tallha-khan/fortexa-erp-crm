const pug = require('pug');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const puppeteer = require('puppeteer');
const { loadSettings } = require('@/middlewares/settings');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const chromeCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA &&
    path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe'),
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

function resolveChromePath() {
  return chromeCandidates.find((candidate) => fs.existsSync(candidate));
}

async function launchBrowser() {
  const args = ['--no-sandbox', '--disable-setuid-sandbox'];
  const executablePath = resolveChromePath();

  if (executablePath) {
    return puppeteer.launch({
      headless: true,
      executablePath,
      args,
    });
  }

  try {
    return await puppeteer.launch({
      headless: true,
      channel: 'chrome',
      args,
    });
  } catch (error) {
    return puppeteer.launch({
      headless: true,
      args,
    });
  }
}

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    if (!pugFiles.includes(modelName.toLowerCase())) {
      return;
    }

    const settings = await loadSettings();
    const selectedLang = settings['idurar_app_language'];
    const translate = useLanguage({ selectedLang });

    const {
      currency_symbol,
      currency_position,
      decimal_sep,
      thousand_sep,
      cent_precision,
      zero_format,
    } = settings;

    const { moneyFormatter } = useMoney({
      settings: {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      },
    });
    const { dateFormat } = useDate({ settings });

    settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

    const htmlContent = pug.renderFile('src/pdf/' + modelName + '.pug', {
      model: result,
      settings,
      translate,
      dateFormat,
      moneyFormatter,
      moment: moment,
    });

    fs.mkdirSync(path.dirname(targetLocation), { recursive: true });

    const browser = await launchBrowser();

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: targetLocation,
        format: info.format || 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      });
    } finally {
      await browser.close();
    }

    if (callback) {
      await callback();
    }
  } catch (error) {
    throw new Error(error);
  }
};
