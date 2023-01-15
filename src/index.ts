import "reflect-metadata";
import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import indexRoutes from "./routes";
import { config } from "./config/settings";
const { PORT } = config;
import { AppDataSource } from "./config/mysql.setting";

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  async config(): Promise<void> {
    this.app.set("port", PORT);
    this.app.use(morgan("dev")); //visualizar petición en consola
    this.app.use(
      cors({
        origin: "*",
      })
    ); //peticiones a servidor desde angular
    this.app.use(express.json()); //entender json (antes body parser)
    this.app.use(express.urlencoded({ extended: false })); //validar formuarios html

    //Initialize typeorm
    try {
      await AppDataSource.initialize();
      console.log(`DB is connected`);
    } catch (error) {
      console.log(error);
    }

    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE"
      );
      res.setHeader("Access-Control-Allow-Methods", "Content-Type");
      next();
    });
  }

  //Routes
  routes(): void {
    this.app.use("/api", indexRoutes);
  }

  //Starting the server
  start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
