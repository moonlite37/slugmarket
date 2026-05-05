import { Controller, Get, Route, Security } from 'tsoa';

@Route('check')
@Security('jwt')
export class CheckController extends Controller {
  @Get()
  public async check(): Promise<[]> {
    return [];
  }
}
