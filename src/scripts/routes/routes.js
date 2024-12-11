import Login from '../views/pages/login';
import Register from '../views/pages/register';
import Home from '../views/pages/home';
import Explore from '../views/pages/explore';
import Profile from '../views/pages/profile';
import NotFound from '../views/pages/not-found';
import Create from '../views/pages/create';
import Marketplace from '../views/pages/marketplace';
import ProductDetail from '../views/pages/product-detail';
import EditPost from '../views/pages/edit-post';
import EditProfile from '../views/pages/edit-profile';

const routes = {
  '/': Home,
  '/login': Login,
  '/register': Register,
  '/explore': Explore,
  '/create-post': Create,
  '/profile': Profile,
  '/profile/:id': Profile,
  '/marketplace': Marketplace,
  '/product/:id': ProductDetail,
  '/not-found': NotFound,
  '/edit-post/:id': EditPost,
  '/edit-profile/:id': EditProfile,
};

export default routes;
