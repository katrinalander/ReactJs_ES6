import { observable } from 'mobx';

import BaseViewModel from '../../common/BaseViewModel';

import { setUserHeader } from 'data/services/requestService';

class ApplicationViewModel extends BaseViewModel {
    @observable userName = null;
    @observable isLoading = false;

    static create() {
        return new ApplicationViewModel(window.sessionStorage.getItem('userName'));
    }

    constructor(userName){
        super();

        this.setUserName(userName);
    }

    setUserName(userName) {
        if(!userName) {
            return false;
        }
        this.userName = userName;
        window.sessionStorage.setItem('userName',userName);
        setUserHeader(userName);
    }
}

export default ApplicationViewModel;