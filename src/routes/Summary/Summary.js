import React, { Component, PropTypes } from 'react';
import { observer, propTypes as ObservableTypes } from 'mobx-react';
import { extendObservable, observable } from 'mobx';

import Services from 'constants/services';

import Page from 'components/Page';
import Button from 'components/Button';
import Grid from 'components/Grid';
import Panel from 'components/Panel';
import Alert from 'components/Alert';
import Checkbox from '../../components/Checkbox';

import cellRendererAccountSummary from 'renderers/cellRendererAccountSummary';
import cellRendererPending from 'renderers/cellRendererPending';
import cellRendererNumber from 'renderers/cellRendererNumber';

import stylesGrid from 'assets/styles/grid.scss';
import styles from './Summary.scss';

@observer
class Summary extends Component {
    @observable profileProps = {};
    @observable profileButtonStates = {};
    @observable isProductSelected = {};
    @observable counts = {};

    SERVICES =[];

    static propTypes = {
        router: PropTypes.object.isRequired,
        viewModel: PropTypes.object.isRequired
    };

    componentWillMount() {
        const { SERVICES } = this;

        Object.keys(Services).forEach(service => {
            this.SERVICES.push(Services[service]);
        });

        SERVICES.forEach(service => {
            const params = {};
            const buttonStates = {};
            const counts = {};

            this.isProductSelected[service.code] = true;

            params[service.code] = {
                columns: [
                    {title: '', field: '', className: stylesGrid.cellCheckbox, headRenderer: () => this.headerRendererCheckbox(service.code), renderer: item => this.cellRendererCheckbox(item, service.code)},
                    {title: 'Account', field: 'accountName', className: stylesGrid.cellAccountExceptionSummary, renderer: item => cellRendererAccountSummary(item)},
                    {title: 'Review', field: 'exceptionPending', className: stylesGrid.cellAlignRight},
                    {title: 'Cut Off Time', field: 'cutOffTime', sorted: true, sortable:true, sortOrder: -1},
                    {title: 'Check status', field: 'posPayStatus', className: stylesGrid.cellAlignRight}
                ],
                data: [],
                loading: false,
                expanded: true,
                selected: [],
                isAllSelected: false
            };

            if(service.code === Services.REVPOSPAY.code) {
                params[service.code].columns.splice(params[service.code].columns.length - 2, 0, {
                    title: 'added additional column',
                    field: 'AdditionalColumn',
                    className: stylesGrid.cellAlignRight,
                    renderer: cellRendererNumber
                });
                params[service.code].columns.splice(params[service.code].columns.length - 1, 1, {
                    title: 'checks total',
                    field: 'TotalColumn',
                    className: stylesGrid.cellAlignRight,
                    renderer: cellRendererNumber
                });
            }

            if(service.code === Services.POSPAY.code) {
                params[service.code].columns.splice(params[service.code].columns.length - 2, 0, {
                    title: 'NoDisplay check',
                    field: 'approvedCount',
                    className: stylesGrid.hiddenCol
                });
            }
            
            buttonStates[service.code] = true;
            counts[service.code] = 0;
            
            extendObservable(this.profileButtonStates,buttonStates);
            extendObservable(this.counts,counts);
            extendObservable(this.profileProps,params);
        });
    }

    componentDidMount() {
        const { SERVICES } = this;
        const { viewModel } = this.props;
        SERVICES.forEach(service => {
            this.profileProps[service.code].loading = true;

            viewModel.getProfileSummary(service.code).then(() => {
                this.profileProps[service.code].data = viewModel.profiles[service.code].accounts;
                this.profileProps[service.code].loading = false;
                this.counts[service.code] = this.profileProps[service.code].data.reduce((count,account) => account.isAccountActive() && account.exceptionPending ? count + account.exceptionPending : count, 0);
            });
        });
    }

    setButtonState(serviceCode) {
        this.profileButtonStates[serviceCode] = this.profileProps[serviceCode].selected.length === 0;
    }

    setSelectAllState(serviceCode) {
        const activeAccounts = [];

        this.profileProps[serviceCode].data.forEach(item => {
            if(item.isAccountActive()) {
                activeAccounts.push(item);
            }
        });

        this.profileProps[serviceCode].isAllSelected = this.profileProps[serviceCode].selected.length === activeAccounts.length && activeAccounts.length !== 0;
    }

    handleRowCheckboxClick(event, item, isChecked,serviceCode) {
        if (isChecked) {
            this.profileProps[serviceCode].selected.push(item);
            this.isProductSelected[serviceCode] = true;

            if(serviceCode === Services.POSPAY.code) {
                this.isProductSelected[Services.REVPOSPAY.code] = false;
            }
            else {
                this.isProductSelected[Services.POSPAY.code] = false;
            }
            this.cls = styles.withOpacity;
        }
        else {
            this.profileProps[serviceCode].selected.splice(this.profileProps[serviceCode].selected.findIndex(selectedItem => item.id === selectedItem.id), 1);
            if(this.profileProps[serviceCode].selected.length === 0) {
                this.isProductSelected[serviceCode] = true;
            }
            if(this.profileProps[serviceCode].selected.length === 0) {
                if(serviceCode === Services.POSPAY.code) {
                    this.isProductSelected[Services.REVPOSPAY.code] = true;
                }
                else {
                    this.isProductSelected[Services.POSPAY.code] = true;
                }
            }
            this.cls = styles.withNoOpacity;
        }
        this.setButtonState(serviceCode);
        this.setSelectAllState(serviceCode);
    }

    handleHeaderCheckboxClick(event, isChecked, serviceCode) {
        const profiles = this.profileProps[serviceCode].data;

        if(isChecked) {
            profiles.forEach(item => {
                if(item.isAccountActive()) {
                    this.profileProps[serviceCode].selected.push(item);
                }
            });
        }
        else {
            this.profileProps[serviceCode].selected = [];
            if (serviceCode === Services.POSPAY.code) {
                this.isProductSelected[Services.REVPOSPAY.code] = true;
            }
            else {
                this.isProductSelected[Services.POSPAY.code] = true;
            }
        }

        if (this.profileProps[serviceCode].selected.length >0) {
            if (serviceCode === Services.POSPAY.code) {
                this.isProductSelected[Services.REVPOSPAY.code] = false;
                this.cls = styles.withOpacity;
            }
            else if (serviceCode === Services.REVPOSPAY.code) {
                this.isProductSelected[Services.POSPAY.code] = false;
                this.cls = styles.withNoOpacity;
            }
        }
        this.setButtonState(serviceCode);
        this.setSelectAllState(serviceCode);
    }

    handleNextClick(serviceCode){
        const { router } = this.props;
        const { profileProps, SERVICES } = this;
        const service = SERVICES.find(item => item.code === serviceCode);
        const accountId = profileProps[service.code].selected.map(item => item.accountNumber).join();

        router.navigateToRoute('review', {
            accountId,
            service
        });
    }

    getHandlerLinkClick(serviceCode, item) {
        const { SERVICES } = this;
        const { router } = this.props;
        const service = SERVICES.find(serviceItem => serviceItem.code === serviceCode);
        const accountId = item.accountNumber;

        return (event) => {
            event.preventDefault();

            router.navigateToRoute('review', {
                accountId,
                service
            });
        }
    }

    cellRendererCheckbox = (item, serviceCode) => {
        const selected = this.profileProps[serviceCode].selected;
        const checked = selected.findIndex(selectedProfile => selectedProfile.id === item.id) !== -1;

        return (
            <Checkbox checked={checked} disabled={!item.isAccountActive()} value={item} onClick={(event,value,isChecked) => this.handleRowCheckboxClick(event,value,isChecked,serviceCode)} />
        );
    }

    headerRendererCheckbox = (serviceCode) => {
        const checked = this.profileProps[serviceCode].isAllSelected;

        return(
            <Checkbox checked={checked} onClick={(event,value,isChecked) => this.handleHeaderCheckboxClick(event,isChecked,serviceCode)}/>
        );
    }

    renderAnnotation() {
        return (<span>Annotation</span>);
    }

    renderPanel(service, index) {
        if (!this.profileProps[service.code].data) {
            return null;
        }

        const profileProps = this.profileProps[service.code];
        const profileButtonState = this.profileButtonStates[service.code];
        const cls = styles.withOpacity;
        const annotation = this.renderAnnotation();
        const notification = {};

        return(
            <div key={index}>
                <Panel
                    title={service.title}
                    annotation={annotation}
                    key={service.code}
                    loading={profileProps.loading}
                    expanded={profileProps.expanded}
                >
                    {/*<Alert type="info" className={showNotification}>{notification}</Alert>*/}
                    <Grid classNames={cls} {...profileProps} />
                    <div className={styles.buttonsContainer}>
                        <Button
                            className={styles.buttonNext}
                            disabled={profileButtonState}
                            onClick={() => this.handleNextClick(service.code)}>
                            Next
                        </Button>
                    </div>
                </Panel>
            </div>
        )
    }

    renderPanels() {
        const { SERVICES } = this;
        const panels = SERVICES.map((service, index) => {
            return this.renderPanel(service,index);
        });
        return (
          <div>
              { panels }
          </div>
        );
    }

    render(){
        const notification = {
            type: 'information',
            message: 'Here is summary page',
        };
        const title = " SummaryPage Title";
        const panels = this.renderPanels();
        return(
            <Page notification={notification} title={title} {...this.props} >
                { panels }
            </Page>
        );
    }
}

export default Summary;