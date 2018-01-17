const classNames = function (names) {
    let args = Array.isArray(names) ? names : Array.prototype.slice.call(arguments);

    return args.filter(arg => arg).join(' ');
};

export default classNames;