import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../persistence/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return new User({
      id: orm.id,
      email: orm.email,
      passwordHash: orm.passwordHash,
      createdAt: orm.createdAt
    });
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    if (user.id) {
      orm.id = user.id;
    }
    orm.email = user.email;
    orm.passwordHash = user.passwordHash;
    return orm;
  }
}
