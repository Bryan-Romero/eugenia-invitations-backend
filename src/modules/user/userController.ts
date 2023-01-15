import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { config } from "../../config/settings";
import { comparePassword, encryptedPassword } from "../../utils/bcrypt";
import { generateTokenRandom } from "../../utils/crypto";
import { User } from "./entities/user.entity";
import { Nodemailer } from "../../utils/nodemailer";
const node = new Nodemailer();

class userController {
  /**
   * Funcion encargada de insertar un nuevo usuario
   */
  public async create_user(req: Request, res: Response): Promise<any> {
    const { firstName, lastName, email, password, departmentNumber } = req.body;
    try {
      const userFound = await User.findOne({
        where: {
          email,
        },
      });
      if (userFound)
        return res.status(400).json({ message: "User already exists" });

      const hashPassword = await encryptedPassword(password);
      const newUser = new User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.password = hashPassword;
      newUser.departmentNumber = departmentNumber;
      const saveUser = await User.save(newUser);

      const payload = {
        userId: saveUser.id,
        email: saveUser.email,
      };
      const token = sign(payload, config.SECRET, {
        expiresIn: "1h",
      });

      return res.status(201).json({ token, message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error register user" });
    }
  }

  /**
   * Funcion encargada de hacer login de un usuario
   */
  public async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    try {
      let userFound: any = await User.findOne({
        select: [
          "id",
          "firstName",
          "lastName",
          "email",
          "password",
          "departmentNumber",
        ],
        where: {
          email,
        },
      });
      if (!userFound) {
        return res.status(404).json({ message: "No found" });
      }

      if (!(await comparePassword(password, userFound.password)))
        return res.status(401).json({ message: "Incorrect password" });

      const payload = {
        userId: userFound.id,
        email: userFound.email,
      };
      const token = sign(payload, config.SECRET, {
        expiresIn: "1h",
      });
      res.json({
        token,
        user: `${userFound.firstName} ${userFound.lastName}`,
        createAt: new Date(),
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error login user" });
    }
  }
  /**
   * Funcion encargada de enviar email al correo
   */
  public async forgotPassword(req: Request, res: Response): Promise<any> {
    const { email } = req.body;
    const userFound = await User.findOne({ where: { email: email } });
    if (!userFound) return res.status(404).json({ message: "No encontrado" });
    const token = generateTokenRandom(30);
    await User.update(userFound.id, {
      tokenPassword: token,
    });

    const bodyMailOptionsI = {
      from: "APP EUGENIA",
      to: userFound.email,
      subject: "Recuperar tu contraseña EUGENIA",
      text: "Recuperar contraeña",
      html: `
        <p>Recuperar contraseña</p>
        <p>https://eugenia/changePassword/${token}</p>
      `,
    };
    await node.sendEmail(bodyMailOptionsI);

    return res.status(200).json({ message: "Email enviado" });
  }

  /**
   * Funcion encargada de cambiar la contraseña de un usuario
   */
  public async changePassword(req: Request, res: Response): Promise<any> {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const userFound = await User.findOne({
        where: {
          tokenPassword: token,
        },
      });
      if (!userFound) return res.status(404).json({ message: "No found user" });

      const hashPassword = await encryptedPassword(password);
      const userChangePassword = Object.assign(userFound, {
        password: hashPassword,
      });
      await User.save(userChangePassword);

      return res.json({ message: "SUCCESS FULL" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error en la invitacion 2" });
    }
  }
}

const userControllers = new userController();
export default userControllers;
