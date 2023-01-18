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
  public async createUser(req: Request, res: Response): Promise<any> {
    const { firstName, lastName, email, password, departmentNumber } = req.body;
    try {
      const userFound = await User.findOne({
        where: {
          email,
        },
      });
      if (userFound)
        return res.status(400).json({
          message: { email: "Este usuario ya existe" },
        });

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

      res.json({
        token,
        user: `${saveUser.firstName} ${saveUser.lastName}`,
        createAt: new Date(),
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }

  /**
   * Funcion encargada de hacer login de un usuario
   */
  public async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    try {
      let userFound: any = await User.findOne({
        where: {
          email,
        },
      });
      if (!userFound) {
        return res
          .status(404)
          .json({ message: { email: "Usuario no encontrado" } });
      }

      if (!(await comparePassword(password, userFound.password)))
        return res
          .status(401)
          .json({ message: { password: "Contraseña incorrecta" } });

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
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }

  /**
   * Funcion encargada de enviar email al correo
   */
  public async forgotPassword(req: Request, res: Response): Promise<any> {
    const { email } = req.body;
    const userFound = await User.findOne({ where: { email: email } });
    try {
      if (!userFound)
        return res
          .status(404)
          .json({ message: { email: "Usuario no encontrado" } });

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
        <p>https://eugenia-invitation-8h24wfl5z-bryanromero.vercel.app/changePassword/${token}</p>
        `,
      };
      await node.sendEmail(bodyMailOptionsI);

      return res.status(200).json({ message: "E-mail enviado" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
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
      if (!userFound)
        return res
          .status(404)
          .json({ message: { email: "Usuario no encontrado" } });

      const hashPassword = await encryptedPassword(password);
      const userChangePassword = Object.assign(userFound, {
        password: hashPassword,
      });
      await User.save(userChangePassword);

      // remove value tokenPassword
      await User.update(userFound.id, {
        tokenPassword: null,
      });

      return res.json({ message: "Se cambio la contraseña" });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }

  /**
   * Función que valida un token
   */
  public async validateToken(req: Request, res: Response): Promise<any> {
    const { email } = req.user;
    try {
      let userFound: any = await User.findOne({
        where: {
          email,
        },
      });
      if (!userFound)
        return res
          .status(404)
          .json({ message: { email: "Usuario no encontrado" } });

      res.json({
        token: true,
        user: `${userFound.firstName} ${userFound.lastName}`,
        createAt: new Date(),
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Algo ha salido mal" });
    }
  }
}

const userControllers = new userController();
export default userControllers;
