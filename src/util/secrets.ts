import logger from './logger';
// import shell from 'shelljs';

if (Object.entries(process.env).length > 1) {
    // logger.debug('Using NODE_ENV variable.!!!');
} else {
    // logger.debug('You do not have anything!! What are you doing?? Ah~~~~~');
    process.exit(1);
}

export const SESSION_SECRET = process.env.SESSION_SECRET;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
if (!MYSQL_DATABASE) {
    // logger.error(
    //     'No client mysql or mongodb connection information. Set MYSQL NODE_ENV variable.',
    // );
    process.exit(1);
}

if (!MYSQL_DATABASE) {
    // logger.error(
    //     'No client mysql connection information. Set MYSQL NODE_ENV variable.',
    // );
    process.exit(1);
}

if (!SESSION_SECRET) {
    // logger.error('No client secret. Set SESSION_SECRET NODE_ENV variable.');
    process.exit(1);
}

// shell.cp('-R', 'src/public/images', 'dist/public/');

// logger.debug('No problem');
