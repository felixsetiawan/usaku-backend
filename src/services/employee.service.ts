import { EntityRepository, Not, Repository } from 'typeorm';
import { EmployeeEntity } from '@entities/employee.entity';
import { HttpException } from '@exceptions/HttpException';
import { Business } from '@/interfaces/business.interface';
import { Employee } from '@interfaces/employee.interface';
import { isEmpty } from '@utils/util';
import { BusinessEntity } from '@/entities/business.entity';

@EntityRepository()
class EmployeeService extends Repository<EmployeeEntity> {
  public async findAllEmployee(uid: string, businessKey: string): Promise<Employee[]> {
    const employee: Employee[] = await EmployeeEntity.find({
      where: {
        uid: Not(uid),
        business_key: businessKey,
        role: Not('owner'),
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

  public async findRole(uid: string, businessKey: string): Promise<Employee> {
    const employee: Employee = await EmployeeEntity.createQueryBuilder('employee')
      .select(['employee.role'])
      .where('employee.uid = :uid and employee.business_key= :businessKey', { uid, businessKey })
      .getOne();
    if (!employee) {
      throw new HttpException(400, 'Employee does not exist');
    }
    return employee;
  }

  public async deleteEmployee(uid: string, businessKey: string): Promise<void> {
    await EmployeeEntity.delete({ uid, business_key: businessKey });
  }

  public async editRole(uid: string, businessKey: string, newRole: string): Promise<void> {
    await EmployeeEntity.update({ uid, business_key: businessKey }, { role: newRole });
  }
}

export default EmployeeService;
