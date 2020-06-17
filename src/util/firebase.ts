import * as admin from 'firebase-admin';
// const serviceAccount = require('../firebase/xsync.json');
//const serviceAccount = require('../../firebase/test-cenference-catting-firebase-adminsdk-cxjsd-23e93ef811.json');
const serviceAccount = require('../../firebase/xsync-project-firebase-adminsdk-jkw9b-8a97636641.json');
// export let firebaseAdmin = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://test-cenference-catting.firebaseio.com',
// });
export let firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://xsync-project.firebaseio.com',
});
export let timestamp = admin.database.ServerValue.TIMESTAMP;
