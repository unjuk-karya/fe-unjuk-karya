import AuthSource from '../../data/auth-source';
import Swal from 'sweetalert2';

const Login = {
  async render() {
    return `
    <div class="auth-container">
    <div class="auth-layout">
      <div class="login-image">
        <img src="../login-bg.svg" alt="Login Illustration">
      </div>
      <div class="login-form">
        <h2 class="auth-heading">Login</h2>
        <form id="loginForm">
          <div class="form-group">
            <label class="form-label" for="identifier">Username or Email</label>
            <input class="form-input" type="text" id="identifier" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input class="form-input" type="password" id="password" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <p class="auth-footer">
            Don't have an account? <a href="#/register" class="link">Register here</a>
          </p>
        </form>
      </div>
    </div>
  </div>  
   `;
  },

  async afterRender() {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelectorAll('.error-message').forEach((el) => el.remove());

      try {
        const response = await AuthSource.login({
          identifier: document.querySelector('#identifier').value,
          password: document.querySelector('#password').value
        });

        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          window.location.href = '#/';

          Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).fire({
            icon: 'success',
            title: 'Login successful'
          });
        }
      } catch (error) {
        if (error.data?.status === 422 && error.data.errors) {
          Object.entries(error.data.errors).forEach(([field, messages]) => {
            const input = document.querySelector(`#${field}`);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = messages[0];
            input.parentNode.appendChild(errorDiv);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong! Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }
};

export default Login;
