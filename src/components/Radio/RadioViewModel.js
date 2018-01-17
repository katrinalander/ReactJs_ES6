import BaseViewModel from 'common/BaseViewModel';
import { observable } from 'mobx';

class RadioViewModel extends BaseViewModel {
    static create() {
        return new RadioViewModel();
    }

    /* Radio Button Select */
    @observable isChecked = false;
}

export default RadioViewModel;