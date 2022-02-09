import loginSchema from "../schemas/LoginSchema.js";

export function validateLoginSchema(req, res, next) {
    const user = req.body;

    const validation = loginSchema.validate(user);
    if (validation.error) {
        return res.sendStatus(422);
    }

    next();
}