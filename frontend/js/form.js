export function setupLoginForm() { 
    const form = document.querySelector('form');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const successModal = document.querySelector('#success-modal');
    const closeModalButton = document.querySelector('#close-modal');
    const modalMessage = document.querySelector('#modal-message');

    // Registration elements
    const registerForm = document.querySelector('#register-form');
    const newUsernameInput = document.querySelector('#new-username');
    const newPasswordInput = document.querySelector('#new-password');
    const registerModal = document.querySelector('#register-modal');
    const registerMessage = document.querySelector('#register-message');
    const closeRegisterModalButton = document.querySelector('#close-register-modal');

    // Handle Login
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Save token
                modalMessage.textContent = 'Login realizado com sucesso!';
                modalMessage.classList.add('success-message');
                successModal.style.display = 'flex';

                setTimeout(() => {
                    window.location.href = "2pagina.html"; 
                }, 4000);
            } else {
                modalMessage.textContent = 'Login inválido!';
                modalMessage.classList.add('error-message');
                successModal.style.display = 'flex';
            }
        } catch (error) {
            alert('Erro ao conectar ao servidor.');
        }
    });

    closeModalButton.addEventListener('click', () => {
        successModal.style.display = 'none';
    });

    // Handle Registration
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = newUsernameInput.value.trim();
        const password = newPasswordInput.value.trim();

        if (!username || !password) {
            registerMessage.textContent = "Preencha todos os campos!";
            registerMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                registerMessage.textContent = "Usuário registrado com sucesso!";
                registerMessage.style.color = "green";
                registerForm.reset();
                registerModal.style.display = 'flex';
            } else {
                registerMessage.textContent = data.error || "Erro no registro!";
                registerMessage.style.color = "red";
                registerModal.style.display = 'flex';
            }
        } catch (error) {
            registerMessage.textContent = "Erro ao conectar ao servidor.";
            registerMessage.style.color = "red";
        }
    });

    closeRegisterModalButton.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });
}
