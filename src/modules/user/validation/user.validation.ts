import { body } from "express-validator";

export const loginValidation = () => {
  return [
    body("email")
      .exists()
      .withMessage("required")
      .bail()
      .isEmail()
      .withMessage("email formato incorrecto"),

    body("password").exists().withMessage("required"),
  ];
};

export const registerValidation = () => {
  return [
    body("email")
      .exists()
      .withMessage("required")
      .bail()
      .isEmail()
      .withMessage("email formato incorrecto"),

    body("password")
      .exists()
      .withMessage("required")
      .isLength({ min: 8 })
      .withMessage("password debe tener minimo de 8 caracteres"),

    body("firstName").exists().withMessage("required"),

    body("lastName").exists().withMessage("required"),

    body("departmentNumber").exists().withMessage("required"),
  ];
};
