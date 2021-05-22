import {
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserCreateDto {
  // 用户名
  @Matches(/^[A-Za-z0-9\u4e00-\u9fa5_\-]{1,15}$/, {
    message: '用户名只支持不超过15位的汉字、字母、数字以及特殊字符-、_',
  })
  @IsString()
  @IsNotEmpty({ message: '缺少用户名' })
  readonly name: string;

  // 密码
  @Matches(/^[A-Za-z0-9]{6,128}$/, {
    message: '密码只能是不少于6位的大小写字母和数字',
  })
  @IsString()
  @IsNotEmpty({ message: '缺少密码' })
  readonly password: string;

  // 用户描述（可选）
  @IsOptional()
  @Length(0, 200, { message: '描述不能超过200字符' })
  @IsString()
  readonly desc?: string;

  // 用户头像（可选）
  @IsOptional()
  @IsString()
  readonly avatar?: string;
}

export class UserFindByIdDto {
  // 用户id
  @IsInt()
  @IsNotEmpty({ message: 'id不能为空' })
  readonly id: number;
}

export class UserFindByNameDto {
  // 用户名
  @MaxLength(128, { message: '用户名长度太大' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly name: string;
}

export class UserNameDto {
  @IsString()
  @MinLength(1, { message: '用户名不能为空' })
  readonly name: string;
}

export class LoginDto {
  @IsString()
  @MinLength(1, { message: '用户名不能为空' })
  readonly name: string;

  @IsString()
  @MinLength(6, { message: '密码不能少于6位' })
  readonly password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'token不能为空' })
  readonly token: string;
}

export class GetUserProfileDto {
  @IsString({ message: 'token必须为字符串' })
  @IsNotEmpty({ message: 'token不能为空' })
  readonly token: string;
}

export class FindSubjectDto {
  @MaxLength(20, { message: '选课码长度太大' })
  @IsString({ message: 'code必须为字符串' })
  @IsNotEmpty({ message: 'code不能为空' })
  readonly code: string;
}

export class FindExperimentsByIdDto {
  @IsString({ message: 'id必须是字符串' })
  @IsNotEmpty({ message: 'id不能为空' })
  readonly ids: string;
}

export class FindExperimentsBySubjectDto {
  @IsInt({ message: 'subjectId必须是数字' })
  @IsNotEmpty({ message: 'subjectId不能为空' })
  @Transform(id => parseInt(id.value))
  readonly id: number;
}

export class UserGradeDto {
  @IsInt({ message: 'user必须是数字' })
  @IsNotEmpty({ message: 'user不能为空' })
  @Transform(id => parseInt(id.value))
  readonly user: number;

  @IsInt({ message: 'experiment必须是数字' })
  @IsNotEmpty({ message: 'experiment不能为空' })
  @Transform(id => parseInt(id.value))
  readonly experiment: number;
}

export class AddUserCountDto {
  @IsInt({ message: 'user必须是数字' })
  @IsNotEmpty({ message: 'user不能为空' })
  readonly user: number;

  @IsInt({ message: 'experiment必须是数字' })
  @IsNotEmpty({ message: 'experiment不能为空' })
  readonly experiment: number;
}

export class SetUserGradeDto {
  @IsInt({ message: 'user必须是数字' })
  @IsNotEmpty({ message: 'user不能为空' })
  readonly user: number;

  @IsInt({ message: 'experiment必须是数字' })
  @IsNotEmpty({ message: 'experiment不能为空' })
  readonly experiment: number;

  @IsInt({ message: 'count必须是数字' })
  @IsOptional()
  readonly count: number;

  @IsInt({ message: 'score必须是数字' })
  @IsOptional()
  readonly score: number;
}
