import { Module } from '@nestjs/common';
import { CRUDGateway } from './crud.gateway';
import { CRUDService } from './crud.service';
import { CRUDHandler } from 'src/handlers/crudHandler';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [CRUDGateway, CRUDService, CRUDHandler],
})
export class CRUDModule { }