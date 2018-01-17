import BaseViewModel from 'common/BaseViewModel';
import { observable } from 'mobx';

class CheckboxViewModel extends BaseViewModel {
    static create() {
        return new CheckboxViewModel();
    }

    /* Checkbox button check */
    @observable isChecked = false;
    @observable isDisabled = false;
}

export default CheckboxViewModel;