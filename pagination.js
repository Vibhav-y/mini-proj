// Pagination Module
const Pagination = (function() {
    let currentPage = 1;
    let totalProducts = 0;
    let totalPages = 0;
    const productsPerPage = 12;
    let isSearchMode = false;
    let searchQuery = '';

    const apiUrl = 'https://dummyjson.com/products';
    const searchApiUrl = 'https://dummyjson.com/products/search';

    function init() {
        createPaginationContainer();
        loadPage(1);
    }

    function createPaginationContainer() {
        // Check if pagination container already exists
        if (document.getElementById('pagination-container')) return;

        const main = document.getElementById('product-container');
        const paginationDiv = document.createElement('div');
        paginationDiv.id = 'pagination-container';
        paginationDiv.className = 'pagination';
        main.insertAdjacentElement('afterend', paginationDiv);
    }

    function loadPage(page, query = null) {
        const container = document.getElementById('product-container');
        container.innerHTML = '<p>Loading products...</p>';

        let url;
        if (query !== null) {
            // Search mode
            isSearchMode = true;
            searchQuery = query;
            url = `${searchApiUrl}?q=${encodeURIComponent(query)}&limit=${productsPerPage}&skip=${(page - 1) * productsPerPage}`;
        } else if (isSearchMode && searchQuery) {
            // Continue search pagination
            url = `${searchApiUrl}?q=${encodeURIComponent(searchQuery)}&limit=${productsPerPage}&skip=${(page - 1) * productsPerPage}`;
        } else {
            // Normal mode
            isSearchMode = false;
            searchQuery = '';
            url = `${apiUrl}?limit=${productsPerPage}&skip=${(page - 1) * productsPerPage}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                currentPage = page;
                totalProducts = data.total;
                totalPages = Math.ceil(totalProducts / productsPerPage);

                // Update global products for suggestions
                if (window.updateProductsForSuggestions) {
                    window.updateProductsForSuggestions(data.products);
                }

                displayProducts(data.products, container);
                renderPagination();
            })
            .catch(err => {
                console.error(err);
                container.innerHTML = '<p>Error loading products.</p>';
            });
    }

    function displayProducts(products, container) {
        container.innerHTML = '';

        if (!products.length) {
            container.innerHTML = '<p class="no-results">No products found.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;

            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="price">$${product.price}</p>
            `;

            card.addEventListener('click', () => {
                window.location.href = `./product.html?id=${product.id}`;
            });

            container.appendChild(card);
        });
    }

    function renderPagination() {
        const paginationContainer = document.getElementById('pagination-container');
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = '← Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                loadPage(currentPage - 1);
                scrollToTop();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        const pageNumbers = getPageNumbers();
        pageNumbers.forEach(pageNum => {
            if (pageNum === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            } else {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'pagination-btn' + (pageNum === currentPage ? ' active' : '');
                pageBtn.textContent = pageNum;
                pageBtn.addEventListener('click', () => {
                    if (pageNum !== currentPage) {
                        loadPage(pageNum);
                        scrollToTop();
                    }
                });
                paginationContainer.appendChild(pageBtn);
            }
        });

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                loadPage(currentPage + 1);
                scrollToTop();
            }
        });
        paginationContainer.appendChild(nextBtn);

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-info';
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);
    }

    function getPageNumbers() {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function search(query) {
        if (!query || !query.trim()) {
            // Reset to normal browsing
            isSearchMode = false;
            searchQuery = '';
            loadPage(1);
        } else {
            loadPage(1, query.trim());
        }
    }

    function reset() {
        isSearchMode = false;
        searchQuery = '';
        loadPage(1);
    }

    return {
        init,
        loadPage,
        search,
        reset,
        getCurrentPage: () => currentPage,
        getTotalPages: () => totalPages
    };
})();

// Export for use in script.js
window.Pagination = Pagination;
