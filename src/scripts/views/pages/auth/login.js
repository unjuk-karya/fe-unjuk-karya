import AuthSource from '../../../data/auth-source';
import Swal from 'sweetalert2';

const Login = {
  async render() {
    return `
      <auth-login></auth-login>
    `;
  },

  async afterRender() {
    const loginForm = document.querySelector('auth-login');
    const form = loginForm.shadowRoot.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      submitButton.disabled = true;

      Swal.fire({
        title: 'Sedang Proses...',
        text: 'Mohon tunggu sebentar sementara kami memproses login Anda',
        didOpen: () => {
          Swal.showLoading();
        },
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      const formData = {
        identifier: form.querySelector('#identifier').value,
        password: form.querySelector('#password').value,
      };

      try {
        const response = await AuthSource.login(formData);

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: 'Anda telah berhasil masuk. Selamat menikmati pengalaman Anda!',
        }).then(() => {
          window.location.href = '#/home';
        });
      } catch (error) {
        let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

        if (error.status === 422 && error.data?.errors) {
          const validationErrors = [];

          if (error.data.errors.identifier) {
            validationErrors.push(`Identifier: ${error.data.errors.identifier.join(', ')}`);
          }

          errorMessage = validationErrors.join('\n');
        }

        Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: errorMessage,
        });
      } finally {
        submitButton.disabled = false;
      }
    });
  }
};

export default Login;
