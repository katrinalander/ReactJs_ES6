import BaseViewModel from 'common/BaseViewModel';
import ProfileModel from 'data/models/ProfileModel';

import Services from 'constants/services';

class SummaryViewModel extends BaseViewModel {
    static create() {
        const models = {};

        Object.keys(Services).forEach(service => {
            models[Services[service].code] = ProfileModel.create(Services[service].code);
        });

        return new SummaryViewModel(models);
    }

    profiles = {};

    constructor(models) {
        super({models});
        const keys = Object.keys(models);
        const profiles = {};

        keys.forEach(key => {
            profiles[key] = {};
        });

        this.profiles = profiles;
    }

    getProfileSummary(type) {
        return this.models[type].getProfileSummary().then(response => {
            if(response.success) {
                this.profiles[type] = response.data;
            }
            else {
                this.profiles[type] = {
                    accounts: []
                };
            }
        });
    }
}

export default SummaryViewModel;