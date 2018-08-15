import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';

import Form from 'components/Form';
import FormField from ' components/Form?FormFields';
import File from 'components/File';
import DropDownList from 'components/DropDownList';
import DropDownOption from 'components/DropDownOption';
import Link from 'components/Link';

import formStyles from 'assets/styles/form.scss';
import styles from './UploadForm.scss';

const ErrorMessages = {
    REQUIRED: 'This field is required.'
};

@observer
class UploadForm extends Component {
    form = null;
    isValid = true;

    static propTypes = {
        hideLinks: PropTypes.bool,
        router: PropTypes.object.isRequired,
        viewModel: PropTypes.object.isRequired,
        onChange: PropTypes.func
    };

    static defaultProps = {
        hideLinks: false
    };

    componentDidMount() {
        const { viewModel } = this.props;
        viewModel.getFileFormats();
    }

    reset() {
        this.form.reset();
    }

    validate() {
        this.isValid = this.form.validate();
    }

    @autobind handleChange(isValid) {
        const { viewModel, onChange } = this.props;
        this.isValid = isValid;

        if(onChange) {
            onChange(this.isValid,viewModel.newFile);
        }
    }

    @autobind handleCreateFormatClick() {
        const { router } = this.props;
        router.navigateToRoute('formatcreate');
    }

    @autobind handleManageFormatClick() {
        const { router } = this.props;
        router.navigateToRoute('formatmanage');
    }

    handleFileFormatChange(value) {
        const { viewModel } = this.props;
        viewModel.newFile.fileFormatId = value;
    }

    handleFileChange(file) {
        const { viewModel } = this.props;
        viewModel.newFile.file = file;
        viewModel.fileValidationError = '';
    }

    renderFileFormats() {
        const { fileFormats } = this.props.viewModel;
        return fileFormats.map((fileFormat, index) => {
            return (
                <DropDownOption value={`${fileFormat.id}`} key={index}>{ fileFormat.fileFormat }</DropDownOption>
            );
        });
    }

    renderLinks() {
        const { hideLinks } = this.props;

        return !hideLinks ? (
            <div className={styles.linkStyles}>
                <Link href="" showIcon={false} onClick={this.handleCreateFormatClick}>Create file format</Link>
                <span> | </span>
                <Link href="" showIcon={false} onClick={this.handleManageFormatClick}>Manage file format</Link>
            </div>
        ) : null;
    }

    render() {
        const { children, viewModel } = this.props;
        const { fileValidationError } = viewModel;

        const options = this.renderFileFormats();
        const links = this.renderLinks();

        return (
            <div>
                { links }
                <Form ref={element => (this.form = element)} onChange={this.handleChange}>
                    <FormField label="Choose format" labelId="lblFileType" for="ffFileType">
                        <div className={formStyles.formControlContainer}>
                            <DropDownList
                                className={styles.ddFileType}
                                errorMessage={ErrorMessages.REQUIRED}
                                id="ffFileType"
                                labelId="lblFileType"
                                isForm={true}
                                isRequired={true}
                                placeholder="Choose file format"
                                selectedValue={viewModel.newFile.fileFormatId}
                                onChange={(event,value) => this.handleFileFormatChange(value)}>

                                { options }
                            </DropDownList>
                        </div>
                        <Link target="_blank" href="https://google.com">
                            ...go to google...
                        </Link>
                    </FormField>

                    <FormField for="ffFile">
                        <File file={viewModel.newFile.file}
                              error={fileValidationError}
                              id="ffFile"
                              label="choose file"
                              isRequired={true}
                              onChange={(event, isValid, chosenFile) => this.handleFileChange(chosenFile)}/>
                    </FormField>

                    { children }

                </Form>
            </div>
        );
    }
}

export default UploadForm;
