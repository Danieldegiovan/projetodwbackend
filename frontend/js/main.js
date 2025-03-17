// Importa a função de configuração da navegação (menu) e a função do formulário de login de arquivos separados
import { setupNavigation } from './ui.js';
import { setupLoginForm } from './form.js';

// Quando o conteúdo da página (DOM) estiver totalmente carregado, executa a configuração das funções
document.addEventListener('DOMContentLoaded', () => {
    // Chama a função que configura a navegação
    setupNavigation();
    
    // Chama a função que configura o formulário de login
    setupLoginForm();
});
