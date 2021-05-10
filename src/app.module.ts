import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { defaultConfig } from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from 'entity/user.entity';
import { Subject } from 'entity/subject.entity';
import { Experiment } from 'entity/experiment.entity';
import { Grade } from 'entity/grade.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultConfig,
      name: 'mysqlConnection',
      entities: [User, Subject, Experiment, Grade],
      database: 'teachingExperiment',
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature(
      [User, Subject, Experiment, Grade],
      'mysqlConnection',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
