const validator = require("../util/AuthValidator");

module.exports = (req, res, next) => {
    let isValid = validator(req.body);
    if (isValid) {
        req.valid = true;
        next();
    } else {
        const errors = validator.errors.map(error => error.message);
        res.status(400).json({ errors: errors });
    }
};
