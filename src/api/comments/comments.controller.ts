import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, UseInterceptors } from '@nestjs/common';

@Controller('comments')
@UseInterceptors(CacheInterceptor)
export class CommentsController {}
