import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/interfaces/user-repository.interface';
import { GetOneUserQuery } from '../../domain/queries/get-one-user.query';
import { UserMapper } from '../mappers/user.mapper';
import { UserOrmEntity } from '../persistence/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>
  ) {}

  async findOne(query: GetOneUserQuery): Promise<User | null> {
    if (!query.id && !query.email) {
      return null;
    }
    const orm = await this.repository.findOne({
      where: {
        ...(query.id ? { id: query.id } : {}),
        ...(query.email ? { email: query.email } : {})
      }
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async create(user: User): Promise<User> {
    const saved = await this.repository.save(UserMapper.toOrm(user));
    return UserMapper.toDomain(saved);
  }
}
