class BaseModel {
    static create(api) {
        return new BaseModel(api);
    }

    constructor(api) {
        this.api = api;
    }
}

export default BaseModel;