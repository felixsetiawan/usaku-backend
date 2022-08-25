import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class UserService extends Repository<UserEntity> {
  public async login(uid: string): Promise<string> {
    console.log(uid);
    const findUser: User = await UserEntity.findOne({ where: { uid } });
    console.log(findUser);
    if (findUser) {
      return '/transaction';
    }
    return '/new-user';
  }

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserEntity.find();
    return users;
  }

  public async findUserById(uid: string): Promise<User> {
    if (isEmpty(uid)) throw new HttpException(400, "You're not user");

    const findUser: User = await UserEntity.findOne({ where: { uid } });
    if (!findUser) return await UserEntity.create({ uid }).save();

    return findUser;
  }

  public async createUser(userData: CreateUserDto, uid: string): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { uid } });
    if (!findUser) return await UserEntity.create({ ...userData, uid }).save();

    return findUser;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { uid: userId } });
    if (!findUser) await this.createUser(userData, userId);

    await UserEntity.update(userId, userData);

    const updateUser: User = await UserEntity.findOne({ where: { uid: userId } });
    return updateUser;
  }
}

export default UserService;
