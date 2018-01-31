import { concurrentRequest, getRequest } from 'data/services/requestService';

const PROFILE_SERVICE_URL = '/summary';

const ProfileService = {
    getProfileSummary(type){
        const payload = {
            type
        };
        return getRequest(PROFILE_SERVICE_URL, payload);
    },

    getProfileSummariesAccounts(profiles) {
        if(!profiles) {
            return new Promise((resolve,reject) => {
                reject({
                    response: {data: {error: 'No profiles provided!!!'}}
                });
            });
        }

        const promises = profiles.map(profile => this.getProfileSummary(profile));

        return concurrentRequest(promises);
    }
};

export default ProfileService;