import expressRouter from "express-async-router";
import authRepo from '../dataAccess/repositories/authRoutesRepo.mjs';
import { schemaValidator } from '../middleware/schemaValidation.mjs';
import { authRouteSchema } from './Schemas/auth.schema.mjs'


export const authRouter = new expressRouter.AsyncRouter();

authRouter.post('/sign-up', schemaValidator.body(authRouteSchema.signUpSchema.body),async (req, res) =>{
    const { name, email, password, role } = req.body;

    const result = await authRepo.signUp(name, email, password, role);
    if(result.error){
        return res.status(result.error.status).json(result.error.message);
    }
    return res.status(result.status).json(result.response);
});


authRouter.post('/sign-in', schemaValidator.body(authRouteSchema.signInSchema.body),async (req, res) =>{
    const { email, password } = req.body;

    const result = await authRepo.signIn(email, password);
    if(result.error){
        return res.status(result.error.status).json(result.error.message);
    }
    return res.status(result.status).json(result.response);
});