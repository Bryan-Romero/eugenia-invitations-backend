import "dotenv/config";

export const config = {
  MYSQL_URI: process.env.MYSQL_URI,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DB: process.env.MYSQL_DB,
  SECRET: process.env.SECRET_TOKEN || "claveSecret12357",
  PORT: process.env.PORT! || 4000,
};
