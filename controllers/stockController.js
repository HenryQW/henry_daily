const got = require('got');
const cheerio = require('cheerio');
const { DateTime } = require('luxon');
const db = require('../models');
const ical = require('../helpers/iCalGenerator');

const getAllStocks = async () => {
    try {
        return await db.Stock.findAll();
    } catch (error) {
        Error(error);
    }
};

const createStock = async (req, res) => {
    try {
        if (req.body.symbol) {
            const dbResult = await db.Stock.create({
                symbol: req.body.symbol,
                share: req.body.share | 0,
            });
            res.status(200).json({
                status: 'success',
                message: `Inserted Stock ${dbResult.id} - ${dbResult.symbol}.`,
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'No symbol provided.',
            });
        }
    } catch (error) {
        Error(error);
    }
};

const updateStock = async (req, res) => {
    try {
        const dbResult = await db.Stock.update(
            {
                share: parseInt(req.body.share),
            },
            {
                where: {
                    symbol: req.body.symbol,
                },
            }
        );
        if (dbResult.length === 1) {
            res.status(200).json({
                status: 'success',
                message: `Update shares to ${req.body.share} for Stock ${req.body.symbol}.`,
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: "Stock doesn't exist.",
            });
        }
    } catch (error) {
        Error(error);
    }
};

const getDividendICal = async (req, res) => {
    const list = await getAllStocks();

    const events = [];

    await Promise.all(
        list.map(async (s) => {
            const url = `https://m.nasdaq.com/symbol/${s.symbol}/dividend-history`;
            const response = await got(url);

            const $ = cheerio.load(response.body);
            const row = $($('#table-saw > tbody > tr')[0]).find('td');

            const paymentDate = DateTime.fromISO($(row[4]).text());

            const exDate = DateTime.fromISO($(row[0]).text());

            s.share = s.share === 0 ? 1 : s.share;

            events.push({
                url,
                allDay: true,
                start: exDate.plus({ days: 1 }).toISODate(),
                end: exDate.plus({ days: 1 }).toISODate(),
                summary: `📅 ${$('h1')
                    .text()
                    .replace(' Dividend Date & History', '')} ExDate`,
                description: `Dividend: ${($(row[1]).text() * s.share).toFixed(
                    2
                )} to be paid on ${paymentDate.toISODate()}`,
            });

            events.push({
                url,
                allDay: true,
                start: paymentDate.plus({ days: 1 }).toISODate(),
                end: paymentDate.plus({ days: 1 }).toISODate(),
                summary: `💰 ${$('h1')
                    .text()
                    .replace(' Dividend Date & History', '')} Payment Date`,
                description: `${$(row[1]).text()} per share, total dividend: ${(
                    $(row[1]).text() * s.share
                ).toFixed(2)}`,
            });

            return Promise.resolve();
        })
    );

    ical.generateICal(res, events, 'Dividend');
};

module.exports = {
    getDividendICal,
    getAllStocks,
    createStock,
    updateStock,
};
