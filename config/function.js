"use strict";
const dotenv = require('dotenv');
dotenv.config();

module.exports.getPagination = function getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

module.exports.getPagingData = function getPagingData(data, page, limit) {
    const { count: totalItems, rows: datas } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, datas, totalPages, currentPage };
}

