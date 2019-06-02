const OpenCC = require('opencc');
const Raven = require('raven');

const reconvert = (str) =>
    str
        .replace(/(\\u)(\w{1,4})/gi, ($0) =>
            String.fromCharCode(
                parseInt(escape($0).replace(/(%5Cu)(\w{1,4})/g, '$2'), 16)
            )
        )
        .replace(/(&#x)(\w{1,4});/gi, ($0) =>
            String.fromCharCode(
                parseInt(
                    escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, '$2'),
                    16
                )
            )
        )
        .replace(/(&#)(\d{1,6});/gi, ($0) =>
            String.fromCharCode(
                parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, '$2'))
            )
        );

const convert = async (req, res, next) => {
    try {
        const opencc = new OpenCC('t2s.json');
        const title = opencc.convertSync(reconvert(req.body.title));
        const content = opencc.convertSync(reconvert(req.body.content));
        res.status(200).json({
            title,
            content,
        });
    } catch (error) {
        Raven.captureException(
            Error(`OpenCC ${error}: ${req.body.title}, ${req.body.content}`)
        );
        next();
    }
};

module.exports = {
    convert,
};
