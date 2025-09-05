import { body, param, query } from "express-validator";

export const defaultStudentValidator = [
     body("identification")
    .trim()
    .notEmpty().withMessage("El campo identificación es requerido (DNI o Pasaporte)")
    .custom((value, { req }) => {
      const identificacion = String(value).trim();
      const dniRegex = /^\d{7,8}$/;
      const passportRegex = /^[A-Z0-9]{6,9}$/i;

      if (dniRegex.test(identificacion) || passportRegex.test(identificacion)) {
        req.body.identificacion = identificacion; // aseguramos string
        return true;
      }
      throw new Error("La identificación debe ser un DNI válido o un pasaporte válido");
    }),
    body("name")
        .trim()
        .notEmpty().withMessage("El campo nombre es requerido")
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/  ).withMessage("El nombre solo puede contener letras")
        .isLength({ min: 2, max: 100 }).withMessage("El campo Nombre debe tener entre 2 y 100 caracteres")
        .toLowerCase(),
    body("lastname")
        .trim()
        .notEmpty().withMessage("El campo apellido es requerido")
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/  ).withMessage("El apellido solo puede contener letras")
        .isLength({ min: 2, max: 100 }).withMessage("El campo Apellido debe tener entre 2 y 100 caracteres")
        .toLowerCase(),
    body("email")
        .trim()
        .notEmpty().withMessage("El campo email es requerido")
        .isEmail().withMessage("El email deve tener un formato válido"),
    body("phone")
        .matches(/^\+?[1-9]\d{7,14}$/)
        .withMessage("Debe ser un número de teléfono válido en formato internacional (+XXXXXXXXXXX)"),
      body("career")
        .optional()
        .isInt({min:1}).withMessage("career fuera de rango")

]