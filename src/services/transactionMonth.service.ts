import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { TransactionMonthEntity } from '@entities/transactionMonth.entity';
import { HttpException } from '@exceptions/HttpException';
import { TransactionMonth } from '@interfaces/transactionMonth.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class TransactionMonthService extends Repository<TransactionMonthEntity> {
  public async findAllMonthlyTransaction(): Promise<TransactionMonth[]> {
    const monthlyTransactions: TransactionMonth[] = await TransactionMonthEntity.find();
    return monthlyTransactions;
  }

  public async getMonthlyTransactionDataByMonthYear(month: number, year: number): Promise<TransactionMonth[]> {
    if (isEmpty(month) || isEmpty(year) || month < 1 || year < 1) throw new HttpException(400, 'Month and year must be provided');
    const findTransaction: TransactionMonth[] = await TransactionMonthEntity.find({ where: { month: month, year: year } });
    if (!findTransaction) throw new HttpException(409, 'Transaction not found');

    return findTransaction;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await hash(userData.password, 10);
    await UserEntity.update(userId, { ...userData, password: hashedPassword });

    const updateUser: User = await UserEntity.findOne({ where: { id: userId } });
    return updateUser;
  }
}

export default TransactionMonthService;
