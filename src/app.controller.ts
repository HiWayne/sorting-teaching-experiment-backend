import { Controller, Get, Post, Body, UsePipes, Query } from '@nestjs/common';
import {
  LoginDto,
  UserCreateDto,
  FindSubjectDto,
  FindExperimentDto,
  UserGradeDto,
  SetUserGradeDto,
  AddUserCountDto,
} from 'dto/app.dto';
import { CommonPipe } from 'pipe/common.pipe';
import { AppService, ErrorResponse } from './app.service';
import { User } from 'entity/user.entity';
import { Subject } from 'entity/subject.entity';
import { Experiment } from 'entity/experiment.entity';
import { Grade } from 'entity/grade.entity';

@Controller('api')
@UsePipes(CommonPipe)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/user/create')
  public async createUser(@Body() body: UserCreateDto): Promise<User> {
    return await this.appService.createUser(body);
  }

  @Post('/user/login')
  public async login(@Body() body: LoginDto): Promise<User | ErrorResponse> {
    return await this.appService.login(body);
  }

  @Get('/subject/find')
  public async findSubject(
    @Query() query: FindSubjectDto,
  ): Promise<Subject | ErrorResponse> {
    return await this.appService.findSubject(query);
  }

  @Get('/experiments/find')
  public async findExperiments(
    @Query() query: FindExperimentDto,
  ): Promise<Experiment[]> {
    return await this.appService.findExperiments(query);
  }

  @Get('/user/grade/find')
  public async getUserGrade(
    @Query() query: UserGradeDto,
  ): Promise<Grade | ErrorResponse> {
    return await this.appService.getUserGrade(query);
  }

  @Post('/user/count/add')
  public async addUserCount(@Body() body: AddUserCountDto): Promise<boolean> {
    return await this.appService.addUserCount(body);
  }

  @Post('/user/grade/set')
  public async setUserGrade(@Body() body: SetUserGradeDto): Promise<boolean> {
    return await this.appService.setUserGrade(body);
  }
}
