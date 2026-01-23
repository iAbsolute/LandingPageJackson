document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Verificação de Segurança ---
    const modal = document.getElementById("resume-modal");
    if (!modal) {
        console.error("ERRO CRÍTICO: O HTML do Modal não foi encontrado! Verifique se você colou o código <div id='resume-modal'> no final do index.html");
        return; // Para o script para não dar mais erros
    }

    // --- 2. Animação de Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));


    // --- 3. Elementos do Modal ---
    const modalTitle = document.getElementById("modal-title");
    const modalSubtitle = document.getElementById("modal-subtitle");
    const modalBody = document.getElementById("modal-body");
    const closeBtn = document.querySelector(".close-modal");
    
    // Carrossel Interno
    const modalCarouselContainer = document.getElementById("modal-carousel-container");
    const modalTrack = document.getElementById("modal-track");
    const modalPrevBtn = document.getElementById("modal-prev-btn");
    const modalNextBtn = document.getElementById("modal-next-btn");

    let modalCurrentIndex = 0;
    let modalImages = [];

    // --- 4. Clique nos Itens (Delegação) ---
    document.addEventListener('click', function(e) {
        // Procura se o clique foi dentro de um .clickable (seja na imagem, texto ou borda)
        const clickedItem = e.target.closest('.clickable');

        if (clickedItem) {
            // Pega os dados
            const title = clickedItem.getAttribute("data-title");
            const subtitle = clickedItem.getAttribute("data-subtitle");
            const details = clickedItem.getAttribute("data-details");
            const imagesAttr = clickedItem.getAttribute("data-images");
            
            // Preenche o Modal
            if(modalTitle) modalTitle.innerText = title;
            if(modalSubtitle) modalSubtitle.innerText = subtitle;
            if(modalBody) modalBody.innerHTML = details;

            // Configura Carrossel (se houver imagens)
            if(modalTrack) {
                modalTrack.innerHTML = "";
                modalCurrentIndex = 0;
                modalTrack.style.transform = `translateX(0)`;

                if (imagesAttr && imagesAttr.trim() !== "") {
                    modalImages = imagesAttr.split(',').map(img => img.trim());
                    modalImages.forEach(imgSrc => {
                        const imgElement = document.createElement("img");
                        imgElement.src = imgSrc;
                        imgElement.classList.add("modal-img");
                        modalTrack.appendChild(imgElement);
                    });
                    if(modalCarouselContainer) modalCarouselContainer.style.display = "block";
                    
                    // Esconde botões se tiver só 1 foto
                    if (modalImages.length <= 1) {
                        if(modalPrevBtn) modalPrevBtn.style.display = "none";
                        if(modalNextBtn) modalNextBtn.style.display = "none";
                    } else {
                        if(modalPrevBtn) modalPrevBtn.style.display = "flex";
                        if(modalNextBtn) modalNextBtn.style.display = "flex";
                    }
                } else {
                    if(modalCarouselContainer) modalCarouselContainer.style.display = "none";
                }
            }

            // Abre o Modal
            modal.classList.add("open");
        }
    });

    // --- 5. Navegação do Carrossel ---
    function updateModalCarousel() {
        if(modalCarouselContainer) {
            const width = modalCarouselContainer.offsetWidth;
            modalTrack.style.transform = `translateX(-${width * modalCurrentIndex}px)`;
        }
    }

    if(modalNextBtn) modalNextBtn.addEventListener('click', (e) => { e.stopPropagation(); modalCurrentIndex = (modalCurrentIndex < modalImages.length - 1) ? modalCurrentIndex + 1 : 0; updateModalCarousel(); });
    if(modalPrevBtn) modalPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); modalCurrentIndex = (modalCurrentIndex > 0) ? modalCurrentIndex - 1 : modalImages.length - 1; updateModalCarousel(); });

    // --- 6. Fechar Modal ---
    function closeModal() { modal.classList.remove("open"); }
    
    if(closeBtn) closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); }); // Clica fora
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); }); // Tecla ESC
    window.addEventListener('resize', updateModalCarousel);
});

/* Script para mostrar/esconder o Header */
document.addEventListener('scroll', function() {
    const header = document.querySelector('#header');
    
    // Se rolar mais que 100 pixels para baixo
    if (window.scrollY > 100) {
        header.classList.add('header-visible');
    } else {
        // Se estiver no topo
        header.classList.remove('header-visible');
    }

// --- 7. Menu Mobile (Hambúrguer) ---
    const menuIcon = document.getElementById("menu-icon");
    const navLinks = document.querySelector(".nav-links");
    const navLinksItems = document.querySelectorAll(".nav-links a");

    // Abrir / Fechar ao clicar no ícone
    if (menuIcon) {
        menuIcon.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            
            // Alterna o ícone entre 'Barras' e 'X' (opcional, visual legal)
            if (navLinks.classList.contains("active")) {
                menuIcon.classList.remove("fa-bars");
                menuIcon.classList.add("fa-times");
            } else {
                menuIcon.classList.remove("fa-times");
                menuIcon.classList.add("fa-bars");
            }
        });
    }

    // Fechar o menu automaticamente ao clicar em um link
    navLinksItems.forEach(item => {
        item.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuIcon.classList.remove("fa-times");
                menuIcon.classList.add("fa-bars");
            }
        });
    });
});

/* --- LÓGICA DO LIGHTBOX (TELA CHEIA) --- */

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('fullscreen-overlay');
    const fullImg = document.getElementById('fullscreen-img');
    const closeBtn = document.getElementById('close-fullscreen');
    
    // Função para abrir o Lightbox
    function openLightbox(src) {
        fullImg.src = src;
        overlay.classList.add('active'); // Mostra o overlay
    }

    // Função para fechar o Lightbox
    function closeLightbox() {
        overlay.classList.remove('active'); // Esconde o overlay
        setTimeout(() => {
            fullImg.src = ''; // Limpa a imagem após fechar
        }, 300);
    }

    // 1. Detectar clique nas imagens do Popup (Usando delegação de eventos)
    // Isso garante que funcione mesmo se a imagem for carregada dinamicamente
    document.body.addEventListener('click', function(e) {
        // Verifica se clicou em uma imagem que está dentro de um modal ou carrossel
        if (e.target.tagName === 'IMG' && 
           (e.target.closest('.modal-content') || e.target.closest('.carousel-item'))) {
            
            openLightbox(e.target.src);
        }
    });

    // 2. Fechar ao clicar no X
    closeBtn.addEventListener('click', closeLightbox);

    // 3. Fechar ao clicar no fundo preto (fora da imagem)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    // 4. Fechar ao apertar a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
});
