const getTimeString = time => {
    if (!time) {
        return '';
    }

    const mask = /^(\d){2}\:(\d){2}(AM|PM)*/i;

    if(!mask.test(time)) {
        throw new Error('ERROR: wrong time string format.');
    }

    let hh = time.split(':')[0];
    let mm = time.split(':')[1];

    const index = time.toUpperCase().indexOf('M');
    let suffix = index >= 0 ?time.toUpperCase().substr(index -1, 2) : '';

    hh = parseInt(hh, 10);
    mm = parseInt(mm, 10);
    mm = mm <10 ? '0' + mm : mm;

    suffix = suffix ? suffix : hh > 12 ? 'PM' : 'AM';
    hh = hh > 12 ? hh - 12 : hh;

    return `${hh}:${mm} ${suffix} ET`;
};

export default getTimeString;