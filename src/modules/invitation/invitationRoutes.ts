import { Router } from "express";
import { verifyToken } from "../../middleware/authJWT";
import { validate } from "../../middleware/validation";
import invitationController from "./invitationController";
import {
  createInvitationValidation,
  deleteInvitationValidation,
} from "./validation/invitation.validation";

class clientRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    // crear una nueva invitacion
    this.router.patch(
      "/create_invitation",
      createInvitationValidation(),
      [validate, verifyToken],
      invitationController.create_invitation
    );

    // consultar las invitaciones de un usuario
    this.router.get(
      "/read_invitation",
      [validate, verifyToken],
      invitationController.read_invitation
    );

    // consultar una invitacion
    this.router.get(
      "/getInvitationById/:token",
      [validate],
      invitationController.getInvitationById
    );

    // eliminar una nueva invitacion
    this.router.delete(
      "/delete_invitation",
      deleteInvitationValidation(),
      [validate, verifyToken],
      invitationController.delete_invitation
    );
  }
}
const statussclientRoutes = new clientRoutes();
export default statussclientRoutes.router;
