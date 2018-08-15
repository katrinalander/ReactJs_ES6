import shortid from 'shortid';

class File {
    constructor(options = {}) {
        this.id = options.id || shortid.generate();
        this.fileFormat = options.fileFormat || '';
    }
}

export default File;