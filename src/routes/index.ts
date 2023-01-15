import { Router } from "express";
import invitationRoutes from "../modules/invitation/invitationRoutes";
import userRoutes from "../modules/user/userRoutes";

class IndexRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.use("/user", userRoutes);
    this.router.use("/invitation", invitationRoutes);
  }
}

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;
