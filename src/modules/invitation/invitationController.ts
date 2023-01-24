import { Request, Response } from "express";
import { generateTokenRandom } from "../../utils/crypto";
import { User } from "../user/entities/user.entity";
import { Invitation } from "./entities/invitation.entity";

class userController {
  /**
   * Funcion encargada de insertar una nueva invitacion
   */
  public async create_invitation(req: Request, res: Response): Promise<any> {
    const { userId } = req.user;
    const { guestName, dateOfEntry, expirationDate } = req.body;
    try {
      const userFound = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!userFound)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const newInvitation = new Invitation();
      newInvitation.guestName = guestName;
      newInvitation.dateOfEntry = dateOfEntry;
      newInvitation.expirationDate = expirationDate;
      newInvitation.userId = userId;
      const invitation = await Invitation.save(newInvitation);

      const shareInvitation = await Invitation.findOne({
        where: {
          id: invitation.id,
        },
      });

      if (!shareInvitation)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const token = generateTokenRandom(20);
      await Invitation.update(invitation.id, {
        tokenShare: token,
      });

      const invitations = await Invitation.find({
        select: {
          id: true,
          guestName: true,
          dateOfEntry: true,
          expirationDate: true,
          tokenShare: true,
        },
        where: {
          userId: userId,
        },
      });

      return res
        .status(201)
        .json({ invitations, token, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }

  /**
   * Funcion encargada de consultar las invitaciones de un usuario
   */
  public async read_invitation(req: Request, res: Response): Promise<any> {
    const { userId } = req.user;
    try {
      const userFound = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

      const invitations = await Invitation.find({
        select: {
          id: true,
          guestName: true,
          dateOfEntry: true,
          expirationDate: true,
          tokenShare: true,
        },
        where: {
          userId: userId,
        },
      });

      return res.status(201).json({ invitations, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }

  /**
   * Funcion encargada de eliminar una invitacion
   */
  public async delete_invitation(req: Request, res: Response): Promise<any> {
    const { userId } = req.user;
    const { id } = req.body;
    try {
      const userFound = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

      await Invitation.delete(id);
      const invitations = await Invitation.find({
        select: {
          id: true,
          guestName: true,
          dateOfEntry: true,
          expirationDate: true,
          tokenShare: true,
        },
        where: {
          userId: userId,
        },
      });

      return res.status(201).json({ invitations, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }

  /**
   * Funcion encargada de leer una invitacion con tokenShare
   */
  public async getInvitationById(req: Request, res: Response): Promise<any> {
    const { token } = req.params;
    try {
      const invitation = await Invitation.findOne({
        select: {
          guestName: true,
          dateOfEntry: true,
          expirationDate: true,
        },
        where: {
          tokenShare: token,
        },
      });
      if (!invitation)
        return res.status(404).json({ message: "Usuario no encontrado" });

      return res.json({ invitation, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }
}

const userControllers = new userController();
export default userControllers;
