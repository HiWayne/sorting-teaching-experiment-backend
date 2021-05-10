import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ClassType } from 'class-transformer/esm2015/ClassTransformer';
import * as CryptoJS from 'crypto-js';
import {
  LoginDto,
  UserCreateDto,
  UserNameDto,
  FindSubjectDto,
  FindExperimentDto,
  UserGradeDto,
  SetUserGradeDto,
  AddUserCountDto,
} from 'dto/app.dto';
import { User } from 'entity/user.entity';
import { Subject } from 'entity/subject.entity';
import { Experiment } from 'entity/experiment.entity';
import { Grade } from 'entity/grade.entity';

export class ErrorResponse {
  status: number;
  data?: null;
  message: string;
  [key: string]: any;
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User, 'mysqlConnection')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject, 'mysqlConnection')
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Experiment, 'mysqlConnection')
    private readonly experimentRepository: Repository<Experiment>,
    @InjectRepository(Grade, 'mysqlConnection')
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  public async createUser(body: UserCreateDto): Promise<User> {
    const { password, name } = body;
    // 检查用户名是否重复
    const nameCanUse = await this.checkUserName({ name });
    if (!nameCanUse) {
      throw new HttpException(
        {
          status: 4,
          data: null,
          message: '用户名重复',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const passwordHash = this.computeHash(password);
      const userEntity = await this.transformClass<User, UserCreateDto>(
        User,
        body,
      );
      userEntity.hash = passwordHash;
      const user = await this.userRepository.save(userEntity);
      delete user.hash;
      return user;
    } catch {
      throw new HttpException(
        { status: 2, data: null, message: '' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(body: LoginDto): Promise<User | ErrorResponse> {
    const { name, password } = body;
    const user = await this.userRepository.findOne({ name });
    if (user) {
      const passwordHash = this.computeHash(password);
      if (passwordHash === user.hash) {
        delete user.hash;
        if (user.desc === null) {
          user.desc = '';
        }
        if (user.avatar === null) {
          user.avatar = '';
        }
        return user;
      } else {
        return { status: 4, data: null, message: '用户名或密码错误' };
      }
    } else {
      return { status: 4, data: null, message: '用户名或密码错误' };
    }
  }

  // 检查用户名是否合法（重复）
  public async checkUserName(query: UserNameDto): Promise<boolean> {
    const { name } = query;
    const isExist = await this.userRepository.findOne({ name });
    return !isExist;
  }

  public async findSubject(
    query: FindSubjectDto,
  ): Promise<Subject | ErrorResponse> {
    const { code } = query;
    const subject = await this.subjectRepository.findOne({ code });
    if (subject) {
      return subject;
    } else {
      return { status: 4, data: null, message: '没有对应课程' };
    }
  }

  public async findExperiments(
    query: FindExperimentDto,
  ): Promise<Experiment[]> {
    const { subject } = query;
    const experiments = await this.experimentRepository.find({ subject });
    return experiments;
  }

  public async getUserGrade(
    query: UserGradeDto,
  ): Promise<Grade | ErrorResponse> {
    const { user, experiment } = query;
    const [userInfo, experimentInfo] = await Promise.all([
      this.userRepository.findOne({ id: user }),
      this.experimentRepository.findOne({ id: experiment }),
    ]);
    if (userInfo && experimentInfo) {
      const gradeInfo = await this.gradeRepository.findOne({
        user,
        experiment,
      });
      if (gradeInfo) {
        return gradeInfo;
      } else {
        return await this.gradeRepository.save({
          user,
          experiment,
          count: 0,
          score: 0,
        });
      }
    } else {
      if (!userInfo) {
        return { status: 4, data: null, message: '用户不存在' };
      }
      if (!experimentInfo) {
        return { status: 4, data: null, message: '实验不存在' };
      }
    }
  }

  public async addUserCount(body: AddUserCountDto): Promise<boolean> {
    const { user, experiment } = body;
    const gradeInfo = await this.gradeRepository.findOne({ user, experiment });
    if (gradeInfo) {
      if (gradeInfo.count >= 10) {
        return false;
      }
      const partialEntity = {
        count: gradeInfo.count + 1,
      } as any;
      await this.gradeRepository.update({ user, experiment }, partialEntity);
      return true;
    } else {
      await this.gradeRepository.save({
        user,
        experiment,
        count: 1,
        score: 0,
      });
      return true;
    }
  }

  public async setUserGrade(body: SetUserGradeDto): Promise<boolean> {
    const { user, experiment, count, score } = body;
    const gradeInfo = await this.gradeRepository.findOne({ user, experiment });
    if (gradeInfo) {
      const partialEntity = {
        count: gradeInfo.count,
        score: gradeInfo.score,
      } as any;
      if (count) {
        partialEntity.count = count;
      }
      if (score) {
        partialEntity.score =
          gradeInfo.score >= score ? gradeInfo.score : score;
      }
      await this.gradeRepository.update({ user, experiment }, partialEntity);
      return true;
    } else {
      await this.gradeRepository.save({
        user,
        experiment,
        count: count || 1,
        score: score && score >= 0 ? score : 0,
      });
      return true;
    }
  }

  private async transformClass<T, V>(cls: ClassType<T>, plain: V): Promise<T> {
    const transformedValue: T = plainToClass(cls, plain, {
      excludeExtraneousValues: true,
    });
    const errors = await validate(transformedValue as any);
    const errorLenth = errors.length;
    if (errorLenth > 0) {
      throw new BadRequestException(Object.values(errors[0].constraints)[0]);
    }
    return this.filterObject<T>(transformedValue);
  }

  private filterObject<T>(object: T): T {
    // @ts-ignore
    Reflect.ownKeys(object).forEach(key => {
      const value = object[key];
      if (!this.isExist(value)) {
        delete object[key];
      }
    });
    return object;
  }

  private isExist = (value: any): boolean =>
    value !== undefined && value !== null && !Number.isNaN(value);

  // 派生算法计算哈希
  private computeHash(password: string, salt = 'salt', count = 2000): string {
    const key512Bits = CryptoJS.PBKDF2(password, salt, {
      hasher: CryptoJS.algo.SHA512,
      keySize: 512 / 32,
      iterations: count,
    });
    const passwordHash = key512Bits.toString(CryptoJS.enc.Hex);
    return passwordHash;
  }
}
