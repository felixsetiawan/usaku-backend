import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class UserService extends Repository<UserEntity> {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserEntity.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await UserEntity.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { uid: userData.uid } });
    if (!findUser) return await UserEntity.create(userData).save();

    return findUser;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    await UserEntity.update(userId, userData);

    const updateUser: User = await UserEntity.findOne({ where: { uid: userId } });
    return updateUser;
  }

  public async deleteUser(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await UserEntity.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    await UserEntity.delete({ uid: userId });
    return findUser;
  }
}

export default UserService;
