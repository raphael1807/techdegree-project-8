// ------------------------------------------
// EXPRESS APP
// ------------------------------------------
const express = require('express');
const errors = express();

// ------------------------------------------
// 404 HANDLER CATCHER
// ------------------------------------------
errors.use((req, res, next) => {
    const err = new Error(`These are uncharted waters.⛵ The page requested does not exist!😞`);
    err.status = 404;
    console.log(`💻 Error ${err.status} ️⚠️ ${err.message}`);
    next(err);
});

// ------------------------------------------
// GLOBAL HANDLE ERRORS
// ------------------------------------------
errors.use((err, req, res, next) => {
    // If err.status === 404, render page-not-found.
    if (err.status === 404) {
        res.status(404);
        res.render('page-not-found', { err });
    }
    // Else if err.status is not 404, render error.
    else {
        err.message = err.message || `Oops - Our servers is on a break. 🚧`;
        res.status(err.status || 500);
        res.render('error', { err });
    }
});

// ------------------------------------------
// Export errors
// ------------------------------------------
module.exports = errors;