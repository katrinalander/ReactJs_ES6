export default [
    {
        value: 'account-administration',
        title: 'QUICK_NAV_ACCOUNT_MAINTENANCE',
        entitlement: 'Admin'
    },
    {
        value: 'positive-pay',
        title: 'QUICK_NAV_POSITIVE_PAY',
        options: [
            {
                value:'entry#manual',
                title: 'QUICK_NAV_ENTRY_CHECKS',
                entitlement: 'RI manual entry'
            },
            {
                value:'entry#upload',
                title: 'QUICK_NAV_UPLOAD_CHECKS',
                entitlement: 'RI file upload'
            }
        ]
    }
];