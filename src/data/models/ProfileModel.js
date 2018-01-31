import BaseModel from 'common/BaseModel';

import Profile from 'data/structures/Profile';
import ProfileService from 'data/api/ProfileService';

import getErrorMessage from 'utils/getErrorMessage';

class ProfileModel extends BaseModel {
    storage = {};

    static create(type) {
        const model = new ProfileModel(ProfileService);
        model.type = type;
        return model;
    }

    serializeData(data) {
        return new Profile(data);
    }

    getProfileSummary() {
        const { type } = this;

        return this.api.getProfileSummary(type).then(
            response => {
                this.storage = this.serializeData(response.data.summaries);

                return {
                    success: true,
                    data: this.storage
                };
            },
            error => {
                return {
                    success: false,
                    message: getErrorMessage(error)
                };
            }
        );
    }

    getProfileSummariesAccounts(profiles) {
        return this.api.getProfileSummariesAccounts(profiles).then(
            responses => {
                const responsesData = [];
                responses.forEach(response => {
                    const data = this.serializeData(response.data.summaries);
                    data && data.accounts && data.accounts.forEach(item => {
                        responsesData.push(item);
                    });
                });

                this.storage = responsesData;

                return {
                    success: true,
                    data: this.storage
                };
            },
            error => {
                return {
                    success: false,
                    message: getErrorMessage(error)
                };
            }
        )
    }
}

export default ProfileModel;