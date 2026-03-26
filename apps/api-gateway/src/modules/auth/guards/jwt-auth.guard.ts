import { Injectable } from '@nestjs/common';
import { JwtAuthGuard as BaseJwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';

@Injectable()
export class JwtAuthGuard extends BaseJwtAuthGuard {}
