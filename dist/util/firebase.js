"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
// const serviceAccount = require('../firebase/xsync.json');
const serviceAccount = require('../firebase/test-cenference-catting-firebase-adminsdk-cxjsd-23e93ef811.json');
exports.firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://test-cenference-catting.firebaseio.com',
});
exports.timestamp = admin.database.ServerValue.TIMESTAMP;
//# sourceMappingURL=firebase.js.map