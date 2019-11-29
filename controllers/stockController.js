const got = require('got');
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
            const url = `https://www.nasdaq.com/market-activity/stocks/${s.symbol}/dividend-history`;
            const api = `https://api.nasdaq.com/api/quote/${s.symbol}/dividends?assetclass=stocks`;
            const response = await got(api);

            const rows = JSON.parse(response.body).data.dividends.rows;

            if (rows === null) {
                return Promise.resolve();
            }
            const row = rows[0];

            if (row.paymentDate === 'N/A' || row.exDate === 'N/A') {
                return Promise.resolve();
            }

            const paymentDate = DateTime.fromFormat(
                row.paymentDate,
                'MM/dd/yyyy'
            );
            const exDate = DateTime.fromFormat(row.exOrEffDate, 'MM/dd/yyyy');

            let share;

            if (s.share === 0) {
                share = 1;
            }

            events.push({
                url,
                allDay: true,
                start: exDate.plus({ days: 1 }).toJSDate(),
                end: exDate.plus({ days: 1 }).toJSDate(),
                summary: `📅 ${s.symbol} ExDate`,
                description: `Dividend: $ ${(
                    parseFloat(row.amount.replace('$', '')) * share
                ).toFixed(4)} to be paid on ${paymentDate.toISODate()}`,
            });

            events.push({
                url,
                allDay: true,
                start: paymentDate.plus({ days: 1 }).toJSDate(),
                end: paymentDate.plus({ days: 1 }).toJSDate(),
                summary: `💰 ${s.symbol} Payment Date`,
                description: `${row.amount} per share, total dividend: $${(
                    parseFloat(row.amount.replace('$', '')) * share
                ).toFixed(4)}`,
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
