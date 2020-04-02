import { connectionsMongodb } from '../../../util/db';
const mongoManager = connectionsMongodb('xsync-main');
export default mongoManager;
