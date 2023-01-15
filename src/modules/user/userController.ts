import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { config } from "../../config/settings";
import { comparePassword, encryptedPassword } from "../../utils/bcrypt";
import { User } from "./entities/user.entity";

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
}

const userControllers = new userController();
export default userControllers;
