import App from '@/app';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import TransactionRoute from '@routes/transaction.route';
import BusinessRoute from '@routes/business.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new TransactionRoute(), new BusinessRoute()]);

app.listen();
