import {
    Route,
    Controller,
    Post,
    Request,
    Security,
} from 'tsoa';
import * as express from 'express';
import { APIService } from './service';

@Route('corp')
export class CorporateController extends Controller {
    @Post('generate')
    @Security('cookie')
    public async generate(
        @Request() req: express.Request,
    ): Promise<unknown> {
        const auth = req.cookies?.authToken;
        try{
            const res = await new APIService().generate(auth);
            return res;
        }
        catch{
            this.setStatus(401)
            return undefined
        }
        
    }
}