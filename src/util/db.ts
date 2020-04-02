import { createConnections, ConnectionOptions } from 'typeorm';
import { connection, connect } from 'mongoose';
interface Idb {
    MYSQL_DATABASE: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
    MONGO_HOST: string;
    MONGO_INITDB_DATABASE: string;
    MONGO_PORT: number;
}
export type ConnectionType = 'mysqlDB';
export type MongodbSchema = 'sk-knight' | 'xsync-main';
export const connectionMysql: ConnectionType = 'mysqlDB';

export const connections = (env: any) => {
    const mysqlOptions: ConnectionOptions = {
        name: 'mysqlDB',
        type: 'mysql',
        host: env.MYSQL_HOST,
        port: Number(env.MYSQL_PORT),
        username: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
        entities: ['./src/entity/mysql/entities/*{.js,.ts}'],
        synchronize: true,
        debug: false,
        insecureAuth: true,
        // logging: ['error'],
        // logger: 'file',
        extra: {
            connectionLimit: 4,
        },
    };
    return createConnections([mysqlOptions]);
};

export const connectionsMongodb = async (schema: MongodbSchema) => {
    const schemaName = schema ? schema : process.env.MONGO_DATABASE;
    const connectionUrl = `mongodb+srv://${process.env.MONGO_HOST}/${schemaName}?retryWrites=true&w=majority`;
    connect(connectionUrl, {
        user: process.env.MONGO_USERNAME,
        pass: process.env.MONGO_PASSWORD,
        dbName: schemaName,
        useNewUrlParser: true,
        useCreateIndex: false,
        useUnifiedTopology: true,
        socketTimeoutMS: 0,
        keepAlive: true,
        // reconnectTries: 30,
    })
        .then(() => {
            console.log(`Successfully connected to ${schemaName}`);
            return true;
        })
        .catch(error => {
            console.log('Error connecting to database: ', error);
            process.exit(1);
        });

    connection.on('disconnected', connect);
};
