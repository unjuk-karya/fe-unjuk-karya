import AuthSource from '../../data/auth-source';
import Swal from 'sweetalert2';

const Register = {
  async render() {
    return `
      <auth-register></auth-register>
    `;
  },

  async afterRender() {
    const registerForm = document.querySelector('auth-register');

    const form = registerForm.shadowRoot.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      submitButton.disabled = true;

      const formData = {
        username: form.querySelector('#username').value,
        email: form.querySelector('#email').value,
        password: form.querySelector('#password').value,
        confirmPassword: form.querySelector('#confirmPassword').value,
      };

      try {
        const response = await AuthSource.register(formData);

        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil',
          text: 'Selamat datang di komunitas!',
        });

        window.location.href = '#/login';
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: error.data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
        });
      } finally {
        submitButton.disabled = false;
      }
    });
  }
};

export default Register;