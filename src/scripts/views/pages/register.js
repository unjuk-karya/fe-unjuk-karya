import AuthSource from '../../data/auth-source';
import Swal from 'sweetalert2';

const Register = {
  async render() {
    return `
   <div class="auth-container">
     <h2 class="auth-heading">Register</h2>
     <form id="registerForm">
       <div class="form-group">
         <label class="form-label" for="email">Email</label>
         <input class="form-input" type="email" id="email" required>
       </div>
       <div class="form-group">
         <label class="form-label" for="username">Username</label>
         <input class="form-input" type="text" id="username" required>
       </div>
       <div class="form-group">
         <label class="form-label" for="name">Name</label>
         <input class="form-input" type="text" id="name" required>
       </div>
       <div class="form-group">
         <label class="form-label" for="password">Password</label>
         <input class="form-input" type="password" id="password" required>
       </div>
       <div class="form-group">
         <label class="form-label" for="confirmPassword">Confirm Password</label>
         <input class="form-input" type="password" id="confirmPassword" required>
       </div>
       <button type="submit" class="btn btn-primary">Register</button>
       <p class="auth-footer">Already have an account? <a href="#/login" class="link">Login here</a></p>
     </form>
   </div>
    `;
  },

  async afterRender() {
    const registerForm = document.querySelector('#registerForm');
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelectorAll('.error-message').forEach((el) => el.remove());

      try {
        await AuthSource.register({
          email: document.querySelector('#email').value,
          username: document.querySelector('#username').value,
          name: document.querySelector('#name').value,
          password: document.querySelector('#password').value,
          confirmPassword: document.querySelector('#confirmPassword').value
        });

        window.location.href = '#/login';

        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).fire({
          icon: 'success',
          title: 'Registration successful'
        });

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

export default Register;