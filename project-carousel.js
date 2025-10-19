(function () {
    const carousel = document.querySelector('.project-carousel');
    if (!carousel) return;

    const grid = carousel.querySelector('.project-grid.project-grid2');
    if (!grid) return;

    if (!carousel.hasAttribute('tabindex')) carousel.setAttribute('tabindex', '0');

    function childrenArray() {
        return Array.from(grid.children).filter(n => n.nodeType === 1);
    }

    function indexWrap(i, len) {
        return (i + len) % len;
    }

    function updateFromDOM() {
        const cards = childrenArray();
        const len = cards.length;
        if (len === 0) return;

        cards.forEach(c => c.classList.remove('center', 'prev', 'next', 'hidden-side'));

        const centerIdx = Math.floor(len / 2);
        const prevIdx = indexWrap(centerIdx - 1, len);
        const nextIdx = indexWrap(centerIdx + 1, len);

        cards.forEach((c, i) => {
            if (i === centerIdx) c.classList.add('center');
            else if (i === prevIdx) c.classList.add('prev');
            else if (i === nextIdx) c.classList.add('next');
            else c.classList.add('hidden-side');
        });

        cards.forEach((c, i) => {
            const isCenter = i === centerIdx;
            c.setAttribute('aria-current', isCenter ? 'true' : 'false');
            const focusable = c.querySelectorAll('a, button, [tabindex]');
            focusable.forEach(el => {
                if (isCenter) el.removeAttribute('tabindex');
                else el.setAttribute('tabindex', '-1');
            });
        });
    }

    function rotateNext() {
        const first = grid.firstElementChild;
        if (first) grid.appendChild(first);
        updateFromDOM();
    }

    function rotatePrev() {
        const last = grid.lastElementChild;
        const first = grid.firstElementChild;
        if (last && first) grid.insertBefore(last, first);
        updateFromDOM();
    }

    const prevBtn = carousel.querySelector('.project-carousel-arrow-left');
    const nextBtn = carousel.querySelector('.project-carousel-arrow-right');
    if (nextBtn) nextBtn.addEventListener('click', rotateNext);
    if (prevBtn) prevBtn.addEventListener('click', rotatePrev);

    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            rotatePrev();
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            rotateNext();
        }
    });

    let touchStartX = null;
    grid.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    grid.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) rotateNext();
            else rotatePrev();
        }
        touchStartX = null;
    });

    updateFromDOM();

    const activeInside = carousel.querySelector(':focus');
    try { if (activeInside) activeInside.blur(); } catch (e) { /* ignore */ }

    window._projectCarousel = { rotateNext, rotatePrev, updateFromDOM };
})();