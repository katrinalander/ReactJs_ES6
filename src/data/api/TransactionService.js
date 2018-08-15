import { concurrentRequest, postRequest, putRequest } from 'data/services/requestService';

const TRANSACTION_SERVICE_URL = '/reconProcessTransactions';
const TRANSACTION_VALIDATE_SERVICE_URL = '/reconValidateTransactions';

const TransactionService = {
    validateTransaction(transaction) {
        const payload = Object.assign({},transaction);
        delete payload.accountName;
        delete payload.outcome;
        delete payload.type;

        return postRequest(TRANSACTION_VALIDATE_SERVICE_URL, payload);
    },

    validateTransactions(transactions) {
        if (!transactions) {
            return new Promise((resolve,reject) => {
                reject({
                    response: { data: { error: "No transaction provided!"}}
                });
            });
        }

        const promises = transactions.map(transaction => this.validateTransaction(transaction));

        return concurrentRequest(promises);
    },

    insertTransaction(transaction) {
        const payload = {
            transaction
        };

        return postRequest(TRANSACTION_SERVICE_URL, payload);
    },

    insertTransactions(transactions) {
        let payload = {
            transactions
        };

        payload.transactions.forEach(check => {
            delete check.type;
        });

        return postRequest(TRANSACTION_SERVICE_URL, payload);
    },

    saveTransaction(transaction) {
        const payload = {
            transaction
        };

        return putRequest(`${TRANSACTION_SERVICE_URL}/${transaction.id}`, payload);
    }
};

export default TransactionService;