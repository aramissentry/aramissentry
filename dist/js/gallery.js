document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    const pagination = document.getElementById("pagination");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImage");
    const caption = document.getElementById("caption");
    const closeBtn = document.getElementById("closeModal");

    const photosPerPage = 16;
    let currentPage = 1;

    // Example photo data (replace with your real image paths)
    const photoData = Array.from({ length: 32 }, (_, i) => ({
        src: `../dist/public/img/aramis-${i + 1}.jpg`,
        alt: `Aramis Sentry`,
    }));

    function renderGallery() {
        gallery.innerHTML = "";
        const start = (currentPage - 1) * photosPerPage;
        const end = start + photosPerPage;
        const currentPhotos = photoData.slice(start, end);

        currentPhotos.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo.src;
            img.alt = photo.alt;
            img.onclick = () => openModal(photo.src, photo.alt);
            gallery.appendChild(img);
        });
    }

    function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(photoData.length / photosPerPage);

        const prev = document.createElement("button");
        prev.textContent = "← Prev";
        prev.disabled = currentPage === 1;
        prev.onclick = () => {
            currentPage--;
            renderGallery();
            renderPagination();
        };
        pagination.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === currentPage) btn.classList.add("active");
            btn.onclick = () => {
                currentPage = i;
                renderGallery();
                renderPagination();
            };
            pagination.appendChild(btn);
        }

        const next = document.createElement("button");
        next.textContent = "Next →";
        next.disabled = currentPage === totalPages;
        next.onclick = () => {
            currentPage++;
            renderGallery();
            renderPagination();
        };
        pagination.appendChild(next);
    }

    function openModal(src, alt) {
        modal.style.display = "block";
        modalImg.src = src;
        caption.textContent = alt;
    }

    closeBtn.onclick = () => (modal.style.display = "none");
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };

    // Init
    renderGallery();
    renderPagination();

});
