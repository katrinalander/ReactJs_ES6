const getDateTimeStringSpecial = date => {
    let dateParts = [
        date.getMonth() +1,
        date.getDate(),
        date.getYear().toString().substr(date.getYear().toString().length - 2, 2),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ];

    dateParts = dateParts.map(part => {
        let output = part.toString();

        if(output.length < 2) {
            output = '0' +output;
        }

        return output;
    });

    const output = dateParts.join(' ');

    return output;
};

export default getDateTimeStringSpecial;