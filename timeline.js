function updateHashtagCounts() {
    const items = document.querySelectorAll('.timeline-item');
    const counts = {
        all: items.length,
        education: 0,
        certification: 0,
        ctf: 0,
        competitions: 0,
        publications: 0,
        work: 0
    };
    items.forEach(item => {
        const tags = item.dataset.tags.split(' ');
        tags.forEach(tag => {
            if (counts.hasOwnProperty(tag)) {
                counts[tag]++;
            }
        });
    });
    Object.keys(counts).forEach(filter => {
        const btns = document.querySelectorAll(`.hashtag-btn[data-filter="${filter}"]`);
        btns.forEach(btn => {
            const countElement = btn.querySelector('.hashtag-count');
            if (countElement) {
                countElement.textContent = counts[filter];
            }
        });
    });
}

function syncHashtagButtons(filter, isActive) {
    // Синхронизируем состояние всех кнопок с данным фильтром
    document.querySelectorAll(`.hashtag-btn[data-filter="${filter}"]`).forEach(btn => {
        if (isActive) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function applyFilters() {
    const allBtn = document.querySelector('.hashtag-btn[data-filter="all"]');
    const activeFilters = Array.from(document.querySelectorAll('.hashtag-btn.active'))
        .map(btn => btn.dataset.filter)
        .filter(filter => filter !== 'all');

    // Если нет активных фильтров или активен "Все"
    if (activeFilters.length === 0 || allBtn.classList.contains('active')) {
        // Показываем все элементы
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.style.display = 'block';
            item.classList.remove('highlighted');
        });
        // Активируем "Все" и деактивируем остальные
        syncHashtagButtons('all', true);
        document.querySelectorAll('.hashtag-btn:not([data-filter="all"])').forEach(btn => {
            syncHashtagButtons(btn.dataset.filter, false);
        });
        return;
    }

    // Применяем фильтрацию
    document.querySelectorAll('.timeline-item').forEach(item => {
        const itemTags = item.dataset.tags.split(' ');
        const hasAnyTag = activeFilters.some(filter => itemTags.includes(filter));
        
        if (hasAnyTag) {
            item.style.display = 'block';
            item.classList.add('highlighted');
        } else {
            item.style.display = 'none';
            item.classList.remove('highlighted');
        }
    });
}

function setupHashtagFilter() {
    document.querySelectorAll('.hashtag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Если кликнули на "Все"
            if (filter === 'all') {
                // Синхронизируем состояние всех кнопок
                syncHashtagButtons('all', true);
                document.querySelectorAll('.hashtag-btn:not([data-filter="all"])').forEach(b => {
                    syncHashtagButtons(b.dataset.filter, false);
                });
            } else {
                // Для других фильтров
                const isActive = this.classList.contains('active');
                syncHashtagButtons(filter, !isActive);
                // Деактивируем "Все" если активируется другой фильтр
                if (!isActive) {
                    syncHashtagButtons('all', false);
                }
            }
            
            // Применяем фильтры
            applyFilters();
        });
    });
}

function setupCertificateModals() {
    const certificateModal = document.getElementById('certificateModal');
    
    if (certificateModal) {
        certificateModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const pdfUrl = button.getAttribute('data-pdf-url');
            const title = button.getAttribute('data-title');
            
            document.getElementById('certificateModalTitle').textContent = `Сертификат: ${title}`;
            
            const iframe = document.getElementById('certificateIframe');
                        iframe.src = pdfUrl;
            
            const downloadBtn = document.getElementById('downloadCertificate');
            downloadBtn.href = pdfUrl;
            downloadBtn.download = `Сертификат_${title.replace(/\s+/g, '_')}.pdf`;
        });
        
        certificateModal.addEventListener('hidden.bs.modal', function() {
            document.getElementById('certificateIframe').src = '';
        });
    }
}

function setupBackToTopButton() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 200) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function setupStickyHashtags() {
    const hashtagContainer = document.querySelector('.hashtag-filter-container');
    if (!hashtagContainer) return;
    
    const observer = new IntersectionObserver(
        ([e]) => {
            hashtagContainer.classList.toggle('sticky', e.intersectionRatio < 1);
        },
        {threshold: [1]}
    );
    
    observer.observe(hashtagContainer);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            hashtagContainer.classList.add('sticky');
        } else {
            hashtagContainer.classList.remove('sticky');
        }
    });
}

function setupFilterSidebar() {
    const sidebar = document.querySelector('.filter-sidebar');
    const toggle = document.querySelector('.filter-toggle');
    
    if (toggle) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
        });
    }
    document.querySelectorAll('.hashtag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const correspondingBtn = document.querySelector(`.filter-content .hashtag-btn[data-filter="${filter}"]`) || 
                                    document.querySelector(`.hashtag-filter .hashtag-btn[data-filter="${filter}"]`);
            
            if (correspondingBtn) {
                correspondingBtn.classList.toggle('active', this.classList.contains('active'));
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    updateHashtagCounts();
    setupHashtagFilter();
    setupCertificateModals();
    setupBackToTopButton();
    setupFilterSidebar();
});