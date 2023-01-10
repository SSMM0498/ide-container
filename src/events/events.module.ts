import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { CRUDService } from './crud.service';
import { CRUDHandler } from 'src/handlers/crudHandler';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [EventsGateway, CRUDService, CRUDHandler],
})
export class EventsModule { }