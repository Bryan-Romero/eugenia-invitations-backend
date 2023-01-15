import { Request, Response } from "express";
import { generateTokenRandom } from "../../utils/crypto";
import { User } from "../user/entities/user.entity";
import { Invitation } from "./entities/invitation.entity";
// import { typeStatusClient } from '../../enums/statusClient.enum';
// import { typeStatusProject } from '../../enums/statusProject.enum';
// import { Project } from '../projects/entities/project.entity';
// import { Client } from './entities/client.entity';

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
      if (!userFound) return res.status(404).json({ message: "No found user" });

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
        return res.status(404).json({ message: "No found invitation" });

      const token = generateTokenRandom(20);
      await Invitation.update(invitation.id, {
        tokenShare: token,
      });

      return res.status(201).json({ token, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error create invitation" });
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
      if (!userFound) return res.status(404).json({ message: "No found user" });

      const invitations = await Invitation.find({
        select: {
          guestName: true,
          dateOfEntry: true,
          expirationDate: true,
        },
        where: {
          userId: userId,
        },
      });

      return res.status(201).json({ invitations, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error leer invitaciones" });
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
      if (!userFound) return res.status(404).json({ message: "No found user" });

      await Invitation.delete(id);
      const invitations = await Invitation.find({
        select: {
          guestName: true,
          dateOfEntry: true,
          expirationDate: true,
        },
        where: {
          userId: userId,
        },
      });

      return res.status(201).json({ invitations, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error eliminar invitaciones" });
    }
  }

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
        return res.status(404).json({ message: "No found invitatio" });

      const { dateOfEntry, expirationDate } = invitation;
      const toDay = new Date();
      const toDayWithoutTime = new Date();
      toDayWithoutTime.setHours(0, 0, 0, 0)

      // console.log(`${toDay} < ${dateOfEntry} = ${toDay < dateOfEntry}`);
      // console.log(`${toDayWithoutTime} > ${expirationDate} = ${toDayWithoutTime > expirationDate}`);
      if (toDay < dateOfEntry)
        return res
          .status(404)
          .json({
            message: `Invitacion para el ${dateOfEntry.getFullYear()}-${
              dateOfEntry.getMonth() + 1
            }-${dateOfEntry.getDay()}  ${dateOfEntry.getHours()}:${dateOfEntry.getMinutes()}`,
          });
      if (toDayWithoutTime > expirationDate)
        return res.status(404).json({ message: "Invitation expirada" });

      return res.json({ invitation, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error en la invitacion 2" });
    }
  }
}

const userControllers = new userController();
export default userControllers;
