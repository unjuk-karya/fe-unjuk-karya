import Login from '../views/pages/auth/login';
import Register from '../views/pages/auth/register';
import Home from '../views/pages/home';
import Explore from '../views/pages/explore';
import Profile from '../views/pages/profile';
import NotFound from '../views/pages/not-found';
import CreatePost from '../views/pages/create/create-post';
import CreateProduct from '../views/pages/create/create-product';
import Marketplace from '../views/pages/marketplace';
import ProductDetail from '../views/pages/product-detail';
import EditPost from '../views/pages/edit/edit-post';
import EditProfile from '../views/pages/edit/edit-profile';
import CompletingRegister from '../views/pages/auth/completing-register';
import TransactionHistory from '../views/pages/transaction-history';
import EditProduct from '../views/pages/edit/edit-product';
import LandingPage from '../views/pages/landing-page';

const routes = {
  '/': LandingPage,
  '/home': Home,
  '/login': Login,
  '/register': Register,
  '/completing-register/:id': CompletingRegister,
  '/explore': Explore,
  '/create-post': CreatePost,
  '/create-product': CreateProduct,
  '/profile': Profile,
  '/profile/:id': Profile,
  '/marketplace': Marketplace,
  '/product/:id': ProductDetail,
  '/not-found': NotFound,
  '/edit-post/:id': EditPost,
  '/edit-product/:id': EditProduct,
  '/edit-profile/:id': EditProfile,
  '/transaction-history': TransactionHistory
};

export default routes;
