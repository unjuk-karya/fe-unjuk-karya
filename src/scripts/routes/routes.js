import Login from '../views/pages/login';
import Register from '../views/pages/register';
import Home from '../views/pages/home';
import Explore from '../views/pages/explore';
import Profile from '../views/pages/profile';
import NotFound from '../views/pages/not-found';
import Create from '../views/pages/create';
import Marketplace from '../views/pages/marketplace';

const routes = {
  '/': Home,
  '/login': Login,
  '/register': Register,
  '/explore': Explore,
  '/create': Create,
  '/profile': Profile,
  '/profile/:id': Profile,
  '/marketplace': Marketplace,
  '/not-found': NotFound,
};

export default routes;
