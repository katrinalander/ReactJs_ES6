import React, { Component, PropTypes } from 'react';
import { observer, propTypes as ObservableTypes } from 'mobx-react';
import { observable } from 'mobx';
import autobind from 'autobind-decorator';

import Input from '../../components/Input';
import Icon from '../../components/Icon';
import Annotation from '../../components/Annotation';
import Page from '../../components/Page';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Checkbox from '../../components/Checkbox';
import Image from '../../components/Image';
import DropDownList from '../../components/DropDownList';
import DropDownOption from '../../components/DropDownOption';
import TextArea from '../../components/TextArea';
import Radio from '../../components/Radio';
import RadioGroup from '../../components/RadioGroup';
import Link from '../../components/Link';
import Modal from '../../components/Modal';
import Panel from '../../components/Panel';
import StickyFooter from '../../components/StickyFooter';
import Rating from '../../components/Rating';
import QuickNavigation from '../../components/QuickNavigation';
import Grid from '../../components/Grid';

import styles from './Components.scss'

@observer
class Components extends Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        viewModel: PropTypes.object.isRequired
    };

    renderAnnotation() {
            return(
                <span>My first ToolTip inside Annotation!!!</span>
            );
    }
    @observable visible = false;
    /* Notifications example */
    @observable notification = {
        type: 'information',
        message: 'Does everything looks OK?'
    };

    @autobind handleShowInformation() {
        console.log("show info");
        this.notification = {
            type: 'information',
            message: 'Does everything looks OK?'
        };
    }

    @autobind handleShowConfirmation() {
        console.log("show confirm");
        this.notification = {
            type: 'confirmation',
            message: 'Here is confirmation message body....',
            annotation: 'You can add annotation to yur confirmation here...'
        };
    }

    @autobind handleShowAlert() {
        console.log("show alert");
        this.notification = {
            type: 'alert',
            message: 'Here is alert message body....',
            annotation: 'You can add annotation for your alert here...'
        };
    }

    @autobind handleHideNotification() {
        this.notification = null;
    }

    gridData = {
        columns: [
            {title:'0ne',field:'one'},
            {title:'Two',field:'two'},
            {title:'Three',field:'three'},
            {title:'Four',field:'four'},
            {title:'Five',field:'five'}
        ],
        data: [
            {one:1,two:2,three:3, four: 4, five: 5},
            {one:2,two:3,three:4, four: 5, five: 6},
            {one:3,two:4,three:5, four: 6, five: 7}
        ],
        loading:false,
        expanded: true,
        selected:[],
        isAllSelected: false
    };

    /* Icons */
    renderIcons() {
        const ICON_TYPES = [
            'hamburger',
            'pencil',
            'flag',
            'camera',
            'film',
            'connection',
            'mic',
            'files-empty',
            'file-text',
            'file-picture',
            'home',
            'folder-open',
            'folder-plus',
            'folder-minus',
            'folder-download',
            'barcode',
            'qrcode',
            'location',
            'map',
            'clock',
            'printer',
            'phone',
            'display',
            'mobile',
            'save',
            'undo',
            'redo',
            'bubble',
            'user',
            'users',
            'user-pus',
            'user-minus',
            'user-tie',
            'hour-glass',
            'spinner',
            'zoom-in',
            'zoom-out',
            'lock',
            'unlocked',
            'wrench',
            'attachment',
            'eye',
            'star-empty',
            'star-half',
            'star-full',
            'happy',
            'sad',
            'wondering',
            'point-right',
            'close',
            'checkmark',
            'checkmark2',
            'play',
            'pause',
            'stop',
            'backward',
            'forward',
            'arrow-up',
            'arrow-right',
            'arrow-down',
            'arrow-left',
            'circle-up',
            'circle-right',
            'circle-down',
            'circle-left',
            'mail',
            'mail4',
            'amazon',
            'google',
            'facebook',
            'instagram',
            'whatsapp',
            'youtube',
            'github',
            'linkedin',
            'pinterest',
            'paypall',
            'chrome',
            'firefox',
            'edge',
            'file-pdf',
            'file-word',
            'file-excel',
            'chevron-down',
            'chevron-up',
            'chevron-left',
            'chevron-right',
            'thumbs-down',
            'thumbs-up',
            'toggle-left',
            'toggle-right',
            'X',
            'notification',
            'confirmation',
            'remove',
            'warning',
            'info',
            'info2',
            'error',
            'calendar',
            'help',
            'help_outline'
        ];

        return ICON_TYPES.map((icon, index) => (
            <div className={styles.iconContainer} key={index}>
                <Icon type={icon} className={styles.icon} />
                <span className={styles.iconLabel}>
                    { icon }
                </span>
            </div>
        ))
    }

    renderImage(){
        const id = '1';
        return(
            <Image aligment="horizontal" id={id} />
        );
    }

    @autobind handleModalVisible() {
        this.visible = true;
        console.log("show modal window ",this.visible);
    }

    renderModalButtons() {
        const firstBut = (<Button type="secondary" onClick={this.closeModal}>Cancel</Button>);
        const secondBut = (<Button type="primary" onClick={this.closeModal}>Enter</Button>);
        const buttons = ([
            firstBut,
            secondBut
        ]);
        return buttons;
    }

    renderModal(){
        const title = "Here is title of modal";
        const message = "Modal example message...";
        const buttons = this.renderModalButtons();
        return(
            <Modal
                visible={this.visible}
                message={message}
                title={title}
                buttons={buttons}
                onCloseRequest={this.closeModal}
            />
        );
    }

    @autobind closeModal() {
        this.visible = false;
    }

    render() {
        const annotation = this.renderAnnotation();
        const { notification, gridData } = this;
        const icons = this.renderIcons();
        const image = this.renderImage();
        const modal = this.renderModal();
        let today, day, month, year;
            today= new Date();
            day = today.getDate();
            month = today.getMonth()+1;
            year = today.getFullYear();
            today = month+'/'+day+'/'+year;
        const footerData = [
            {title : "Created by:", value: "Katrina L"},
            {title : "Today is:", value: today},
            {title : "Created in:", value: "ReactJS"}
        ];

        return(
            <Page title="Components demo" annotation={annotation} notification={notification}>
                <h3> Page notification examples </h3>
                <div>
                    <Button type="primary" onClick={this.handleShowInformation}>Show Information Notification</Button>
                    <Button type="secondary" onClick={this.handleShowConfirmation}>Show Confirmation Notification</Button>
                    <Button type="tertiary" onClick={this.handleShowAlert}>Show Alert Notification</Button>
                    <Button onClick={this.handleHideNotification}>Hide Notification</Button>
                </div>
                <h3>Quick Navigation: </h3>
                <QuickNavigation/>

                <Annotation content={(<span>Second annotation example</span>)} position="top" title="Title example" />
                <Input isRequired={true} type="currency" errorMessage="ERROR!!!" isToolTipAvailable={true} placeholder="please enter something..."/>
                <Alert type="alert">Test alert</Alert>
                <Alert type="info">Test info alert</Alert>
                <Alert>AAAAAAAlert</Alert>

                <h3>Checkbox: </h3>
                <Checkbox label="Yes"/>

                <h3>Grid: </h3>
                <Grid {...gridData}/>

                <Panel title="List of icons" expanded={false}>
                    <div>
                        { icons }
                    </div>
                </Panel>

                <h3>DropDown component: </h3>
                <DropDownList placeholder="regular dropdown">
                    <DropDownOption value="option1"> Option 1 </DropDownOption>
                    <DropDownOption value="option2"> Option 2 </DropDownOption>
                    <DropDownOption value="option3"> Option 3 </DropDownOption>
                </DropDownList>

                <h3>DropDown component (type navigation): </h3>
                <DropDownList type="navigation" placeholder="navigation dropdown">
                    <DropDownOption value="option4"> Option 4 </DropDownOption>
                    <DropDownOption value="option5"> Option 5 </DropDownOption>
                    <DropDownOption value="option6"> Option 6 </DropDownOption>
                </DropDownList>

                <h3>TextArea component: </h3>
                <TextArea/>

                <h3>Panel component: </h3>
                <Panel title="Title of panel" annotation={annotation}>
                    <p>Essentially, a <b>promise</b> is a returned object to which you attach <b>callbacks</b>, instead of passing <b>callbacks</b> into a function.
                        E.g., instead of an old-style function that expects two <b>callbacks</b>, and calls one of them on eventual completion or failure: ...
                        We call this an asynchronous function call
                        Understanding <b>JavaScript Promises</b>. A <b>promise</b> represents the eventual result of an asynchronous operation.
                        It is a placeholder into which the successful result value or reason for failure will materialize.
                        A <b>callback</b> function, also known as a higher-order function, is a function that is passed to another function
                        (let's call this other function “otherFunction”) as a parameter, and the <a>callback</a> function is called (or executed)
                        inside the otherFunction.
                    </p>
                </Panel>

                <h3>Link component: </h3>
                <div>
                    <Link href="" onClick={this.handleModalVisible}>Default link (for Modal window)</Link>
                    { modal }
                </div>
                <div>
                    <Link href="" showIcon={false}>Link without icon</Link>
                </div>

                <h3>Radio component (default)</h3>
                <RadioGroup>
                    <Radio value="yes" id="input1" name="choice1" />
                    <Radio value="no" id="input2" name="choice1"/>
                </RadioGroup>

                <h3>Radio component (vertical)</h3>
                <RadioGroup type="vertical">
                    <Radio value="yes" id="input3" name="choice2" />
                    <Radio value="no" id="input4" name="choice2"/>
                </RadioGroup>

                <h3>Rating:</h3>
                <Rating />
                <div>Results 3.6 of 5: <Rating interactive={false} rating={3.6} /></div>

                <h3>Image:</h3>
                <div>{image}</div>

                <StickyFooter data={footerData} >
                    <Button type="primary">Enter</Button>
                    <Button type="secondary">Cancel</Button>
                </StickyFooter>
            </Page>
        );
    }
}

export default Components;