import { Router } from 'express';
import { validate } from '../../middleware/validation'; 
import { verifyToken } from '../../middleware/authJWT';
// import { authPermition } from '../../middleware/permission';
// import { validate } from '../../middleware/validation';
import userController from './userController';
import { registerValidation, loginValidation } from './validation/user.validation';

class clientRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    
    // crear un nuevo usuario
    this.router.post(
      '/',
      registerValidation(),
      validate,
      userController.create_user,
    ); 

    // login usuario
    this.router.post(
      '/login',
      loginValidation(),
      validate,
      userController.login,
    ); 
   
  }
}
const statussclientRoutes = new clientRoutes();
export default statussclientRoutes.router;
