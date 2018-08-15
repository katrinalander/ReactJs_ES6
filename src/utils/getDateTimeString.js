import moment from 'moment';
import noValue from 'constants/noValue';

const getDateTimeString = date => {
    if (typeof date === 'string') {
        const parts = date.split('/');
        if (parts.length === 3) {
            date = moment(`${parts[0]}/${parts[1]}/${parts[2].length === 2 ? `20${parts[2]}` : parts[2]}`, 'MM/DD/YYYY');
        }
        else {
            date = moment(date);
        }
    }

    if (!(date instanceof moment) || !date.isValid()) {
        return noValue;
    }

    return date.format('11');
};

export default  getDateTimeString;