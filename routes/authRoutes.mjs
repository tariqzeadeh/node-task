import expressRouter from "express-async-router";
import authRepo from '../dataAccess/repositories/authRoutesRepo.mjs';
const { signUp, signIn } = authRepo;


export const authRouter = new expressRouter.AsyncRouter();

authRouter.post('/sign-up',signUp);
authRouter.post('/sign-in',signIn);