import { EntityRepository, Repository } from 'typeorm';
import { CreateBusinessDto } from '@dtos/business.dto';
import { BusinessEntity } from '@entities/business.entity';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { Business } from '@interfaces/business.interface';
import { isEmpty } from '@utils/util';
import { User } from '@interfaces/users.interface';

@EntityRepository()
class BusinessService extends Repository<BusinessEntity> {
  public async createBusiness(businessData: CreateBusinessDto, uid: string): Promise<Business> {
    if (isEmpty(businessData)) throw new HttpException(400, 'Body is empty');

    const findBusiness: Business = await BusinessEntity.findOne({ where: { owner: uid, business_key: businessData.business_key } });
    if (!findBusiness) return await BusinessEntity.create({ ...businessData, owner: uid }).save();

    return findBusiness;
  }

  public async findAllMembers(business_key: string): Promise<User[]> {
    const findMembers: User[] = await UserEntity.createQueryBuilder('user')
      .where(`user.business_key = '${business_key}' AND user.role != 'owner'`)
      .getMany();
    return findMembers;
  }

  public async login(uid: string): Promise<string> {
    const findBusiness: Business = await BusinessEntity.findOne({ where: { uid } });
    if (findBusiness) {
      return '/transaction';
    }
    return '/new-business';
  }

  public async findAllBusiness(): Promise<Business[]> {
    const business: Business[] = await BusinessEntity.find();
    return business;
  }

  public async getBusinessProfile(business_key: string, uid: string): Promise<Business> {
    if (isEmpty(uid)) throw new HttpException(400, "You're not business");

    const findBusiness: Business = await BusinessEntity.findOne({ where: { business_key: business_key } });
    // if (!findBusiness) return await BusinessEntity.create({ uid }).save();
    return findBusiness;
  }

  public async updateBusiness(businessId: string, businessData: CreateBusinessDto): Promise<Business> {
    if (isEmpty(businessData)) throw new HttpException(400, "You're not businessData");

    const findBusiness: Business = await BusinessEntity.findOne({ where: { uid: businessId } });
    if (!findBusiness) await this.createBusiness(businessData, businessId);

    await BusinessEntity.update(businessId, businessData);

    const updateBusiness: Business = await BusinessEntity.findOne({ where: { uid: businessId } });
    return updateBusiness;
  }
}

export default BusinessService;
