import AuthSource from '../../data/auth-source';
import Swal from 'sweetalert2';

const Register = {
  async render() {
    return `
      <auth-register></auth-register>
    `;
  },

  async afterRender() {

  }
};

export default Register;