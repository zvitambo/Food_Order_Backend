import { ValidateSignature } from './../utility/PasswordUtility';
import { RequestHandler } from 'express';
import { AuthPayload } from '../dto';



declare global {
    namespace Express {
        interface Request{
           user?: AuthPayload
        }
    }
}




export const Authenticate: RequestHandler = async (req, res, next) => {
    const validate = await ValidateSignature(req);

    if (validate) {
        next(); 
    } 
    else
    {
       return res.json({"message":"user not found"});
    }
}