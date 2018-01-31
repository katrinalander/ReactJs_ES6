import cellRendererCheckType from './cellRendererCheckType';
import cellRendererAccount from './cellRendererAccount';
import styles from 'assets/styles/grid.scss';

export default () => {
    const output = [
        { title: "Check Type", field: 'checkType', renderer: cellRendererCheckType},
        { title: "Account", field: 'accountName', className: styles.cellAccount, renderer: cellRendererAccount}
    ];

    return output;
};