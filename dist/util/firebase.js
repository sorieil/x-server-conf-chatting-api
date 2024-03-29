"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = exports.firebaseFCMAdmin = exports.firebaseDBAdmin = void 0;
const admin = __importStar(require("firebase-admin"));
// const serviceAccount = require('../firebase/xsync.json');
const serviceDatabaseAccount = require('../../firebase/test-cenference-catting-firebase-adminsdk-cxjsd-23e93ef811.json');
const serviceFCMAccount = require('../../firebase/xsync-project-firebase-adminsdk-jkw9b-8a97636641.json');
exports.firebaseDBAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceDatabaseAccount),
    databaseURL: 'https://test-cenference-catting.firebaseio.com',
}, 'Database');
exports.firebaseFCMAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceFCMAccount),
    databaseURL: 'https://xsync-project.firebaseio.com',
}, 'FCM');
exports.timestamp = admin.database.ServerValue.TIMESTAMP;
//# sourceMappingURL=firebase.js.map