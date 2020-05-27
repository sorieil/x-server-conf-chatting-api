"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionsMongodb = exports.connections = exports.connectionMysql = void 0;
const typeorm_1 = require("typeorm");
const mongoose_1 = require("mongoose");
exports.connectionMysql = 'mysqlDB';
exports.connections = (env) => {
    const mysqlOptions = {
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
    return typeorm_1.createConnections([mysqlOptions]);
};
exports.connectionsMongodb = (schema) => __awaiter(void 0, void 0, void 0, function* () {
    const schemaName = schema ? schema : process.env.MONGO_DATABASE;
    const connectionUrl = `mongodb+srv://${process.env.MONGO_HOST}/${schemaName}?retryWrites=true&w=majority`;
    mongoose_1.connect(connectionUrl, {
        user: process.env.MONGO_USERNAME,
        pass: process.env.MONGO_PASSWORD,
        dbName: schemaName,
        useNewUrlParser: true,
        useCreateIndex: false,
        useUnifiedTopology: true,
        socketTimeoutMS: 0,
        keepAlive: true,
    })
        .then(() => {
        console.log(`Successfully connected to ${schemaName}`);
        return true;
    })
        .catch(error => {
        console.log('Error connecting to database: ', error);
        process.exit(1);
    });
    mongoose_1.connection.on('disconnected', mongoose_1.connect);
});
//# sourceMappingURL=db.js.map