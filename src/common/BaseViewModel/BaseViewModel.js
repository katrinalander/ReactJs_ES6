import { action } from 'mobx';

class BaseViewModel {
    static create() {
        throw new Error('Should implement create() static method of BaseViewModel class');
    }

    constructor(models, autorun) {
        // Attach model
        models && Object.keys(models).forEach(key => {
            this[key] = models[key];

            if (autorun) {
                models[key].initialize && models[key].initialize();
            }
        });
    }

    @action set(name, value) {
        this[name] = value;
    }

    @action extend(values) {
        Object.assign(this, values);
    }
}

export default BaseViewModel;