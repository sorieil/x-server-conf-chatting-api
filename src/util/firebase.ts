import * as admin from 'firebase-admin';
// const serviceAccount = require('../firebase/xsync.json');
const serviceDatabaseAccount = require('../../firebase/test-cenference-catting-firebase-adminsdk-cxjsd-23e93ef811.json');
const serviceFCMAccount = require('../../firebase/xsync-project-firebase-adminsdk-jkw9b-8a97636641.json');
export let firebaseDBAdmin = admin.initializeApp(
    {
        credential: admin.credential.cert(serviceDatabaseAccount),
        databaseURL: 'https://test-cenference-catting.firebaseio.com',
    },
    'Database',
);

export let firebaseFCMAdmin = admin.initializeApp(
    {
        credential: admin.credential.cert(serviceFCMAccount),
        databaseURL: 'https://xsync-project.firebaseio.com',
    },
    'FCM',
);
export let timestamp = admin.database.ServerValue.TIMESTAMP;
