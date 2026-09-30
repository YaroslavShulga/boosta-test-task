import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './domain/services/users.service';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from './users.constants';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [UsersService, { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository }],
  exports: [UsersService]
})
export class UsersModule {}
