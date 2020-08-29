const moment = require('moment');

const isDate = (value) => {
    if (!value) {
        return false;
    }

    const fecha = moment ( value );
    if( !fecha.isValid ){
        return false;
    } else {
        return true
    }

}

module.exports = {
    isDate
}