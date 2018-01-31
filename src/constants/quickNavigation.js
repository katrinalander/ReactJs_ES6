export default [
    {
        value: 'account-administration',
        title: 'Account admin',
        entitlement: 'Admin'
    },
    {
        value: 'reports',
        title: 'Profile',
        entitlement: 'Admin'
    },
    {
        value: 'positive-pay',
        title: 'Positive Pay',
        options: [
            {
                value:'entry#manual',
                title: 'Entry checks',
                entitlement: 'RI manual entry'
            },
            {
                value:'entry#upload',
                title: 'Upload Checks',
                entitlement: 'RI file upload'
            }
        ]
    },
    {
        value: 'positive-pay',
        title: 'Reverse Positive Pay',
        options: [
            {
                value:'entry#manual',
                title: 'Entry checks',
                entitlement: 'RI manual entry'
            },
            {
                value:'entry#upload',
                title: 'Upload Checks',
                entitlement: 'RI file upload'
            }
        ]
    }
];