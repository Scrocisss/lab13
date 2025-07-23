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

function setupHashtagFilter() {
    document.querySelectorAll('.hashtag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.filter === 'all') {
                document.querySelectorAll('.hashtag-btn:not([data-filter="all"])').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                document.querySelectorAll('.timeline-item').forEach(item => {
                    item.classList.remove('faded');
                    item.classList.remove('highlighted');
                });
                return;
            }
            this.classList.toggle('active');
            const allBtn = document.querySelector('.hashtag-btn[data-filter="all"]');
            if (allBtn.classList.contains('active')) {
                allBtn.classList.remove('active');
            }
            const activeFilters = Array.from(document.querySelectorAll('.hashtag-btn.active'))
                .map(btn => btn.dataset.filter)
                .filter(filter => filter !== 'all');
            if (activeFilters.length === 0) {
                document.querySelectorAll('.timeline-item').forEach(item => {
                    item.classList.remove('faded');
                    item.classList.remove('highlighted');
                });
                allBtn.classList.add('active');
                return;
            }
            document.querySelectorAll('.timeline-item').forEach(item => {
                const itemTags = item.dataset.tags.split(' ');
                const hasAnyTag = activeFilters.some(filter => itemTags.includes(filter));
                
                if (hasAnyTag) {
                    item.classList.remove('faded');
                    item.classList.add('highlighted');
                } else {
                    item.classList.add('faded');
                    item.classList.remove('highlighted');
                }
            });
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