// Função para configurar a navegação suave ao clicar nos links de navegação
export function setupNavigation() {
    // Seleciona todos os links dentro da tag <nav>
    const navLinks = document.querySelectorAll('nav a');

    // Itera sobre cada link encontrado
    navLinks.forEach(link => {
        // Adiciona um ouvinte de evento para o clique em cada link
        link.addEventListener('click', (event) => {
            // Obtém o elemento da seção de destino com base no href do link
            const targetSection = document.querySelector(link.getAttribute('href'));

            // Rola a página até a posição da seção de destino com um efeito de rolagem suave
            window.scrollTo({
                top: targetSection.offsetTop, // A posição vertical da seção de destino
                behavior: 'smooth' // Define o comportamento como 'suave' para rolar de forma suave
            });

            // Impede o comportamento padrão do link (evita o redirecionamento da página)
            event.preventDefault();
        });
    });
}
