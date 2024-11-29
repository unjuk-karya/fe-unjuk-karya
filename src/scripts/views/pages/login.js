import AuthSource from '../../data/auth-source';
import Swal from 'sweetalert2';

const Login = {
  async render() {
    return `
      <auth-login></auth-login>
   `;
  },

  async afterRender() {

  }
};

export default Login;
