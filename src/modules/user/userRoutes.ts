import { Router } from "express";
import { validate } from "../../middleware/validation";
import userController from "./userController";
import {
  registerValidation,
  loginValidation,
} from "./validation/user.validation";

class clientRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    // crear un nuevo usuario
    this.router.post(
      "/",
      registerValidation(),
      validate,
      userController.create_user
    );

    // login usuario
    this.router.post(
      "/login",
      loginValidation(),
      validate,
      userController.login
    );

    // enviar email
    this.router.post(
      "/forgotPassword",
      // [verifyToken],
      userController.forgotPassword
    );

    //Actualizar contraseña
    this.router.patch(
      "/changePassword",
      // [verifyToken],
      userController.changePassword
    );
  }
}
const statussclientRoutes = new clientRoutes();
export default statussclientRoutes.router;
