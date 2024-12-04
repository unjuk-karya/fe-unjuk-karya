import Login from '../views/pages/login';
import Register from '../views/pages/register';
import Home from '../views/pages/home';
import Explore from '../views/pages/explore';
import Profile from '../views/pages/profile';
import SearchUser from '../views/pages/search-user';
import NotFound from '../views/pages/not-found';

const routes = {
  '/': Home,
  '/login': Login,
  '/register': Register,
  '/explore': Explore,
  '/profile': Profile,
  '/search/:id': SearchUser,
  '/not-found': NotFound,
};

export default routes;