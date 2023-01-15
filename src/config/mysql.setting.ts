import { DataSource } from "typeorm";
import { config } from "./settings";
import { User } from "../modules/user/entities/user.entity";
import { Invitation } from "../modules/invitation/entities/invitation.entity";
const { MYSQL_URI, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = config;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: MYSQL_URI,
  port: 3306,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Invitation,
  ],
  subscribers: [],
  migrations: [],
  //insecureAuth: true,
});
