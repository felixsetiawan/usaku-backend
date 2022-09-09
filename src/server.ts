import App from '@/app';

// VALIDATOR
import validateEnv from '@utils/validateEnv';

// ROUTES
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import TransactionRoute from '@routes/transaction.route';
import BusinessRoute from '@routes/business.route';
import EmployeeRoute from '@routes/employee.route';

validateEnv();

const app = new App([new IndexRoute(), new EmployeeRoute(), new UsersRoute(), new TransactionRoute(), new BusinessRoute()]);

app.listen();
