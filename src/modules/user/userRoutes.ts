import { Router } from "express";
import { verifyToken } from "../../middleware/authJWT";
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
      "/createUser",
      registerValidation(),
      validate,
      userController.createUser
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
      // validate,
      userController.forgotPassword
    );

    // actualizar contraseña
    this.router.patch(
      "/changePassword/:token",
      // [verifyToken],
      // validate,
      userController.changePassword
    );

    // validar Token
    this.router.get(
      '/validate-token',
      verifyToken,
      userController.validateToken,
    );
  }
}
const statussclientRoutes = new clientRoutes();
export default statussclientRoutes.router;
