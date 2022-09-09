import { EntityRepository, Repository } from 'typeorm';
import { EmployeeEntity } from '@entities/employee.entity';
import { HttpException } from '@exceptions/HttpException';
import { Business } from '@/interfaces/business.interface';
import { Employee } from '@interfaces/employee.interface';
import { isEmpty } from '@utils/util';
import { BusinessEntity } from '@/entities/business.entity';

@EntityRepository()
class EmployeeService extends Repository<EmployeeEntity> {
  public async findAllEmployee(businessKey: string): Promise<Employee[]> {
    const employee: Employee[] = await EmployeeEntity.find({
      where: {
        business_key: businessKey,
      },
    });

    return employee;
  }

  public async findAllBusiness(uid: string): Promise<Employee[]> {
    const employee: Employee[] = await EmployeeEntity.find({
      where: {
        uid: uid,
      },
    });

    return employee;
  }

  public async newEmployee(uid: string, businessKey: string, employeeData: Employee): Promise<Employee> {
    const isBusinessExist: Business = await BusinessEntity.findOne({
      where: {
        business_key: businessKey,
      },
    });

    if (!isBusinessExist) {
      throw new HttpException(400, 'Business Key does not exist.');
    }
    const employee: Employee = await EmployeeEntity.create({ ...employeeData, business_name: isBusinessExist.business_name, uid }).save();
    return employee;
  }
}

export default EmployeeService;
