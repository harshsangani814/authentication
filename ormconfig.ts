import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource =new DataSource({
    type: "postgres",
    host: 'localhost',
    port: Number(process.env.Database_PORT || 5432),
    username: 'Postgres',
    password: 'Mysql@2003',
    database:'auth',
    synchronize:true,
    logging : false,
    entities: [User],

});

export default AppDataSource;