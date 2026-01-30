function fetchProducts(url) {
    return fetch(url)
        .then(res => res.json())
        .catch(err => {
            console.error(err);
            return { products: [] };
        });
}

function displayProducts(products, container) {
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('product-container');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchBtn');
    let products = {};


    fetchProducts('https://dummyjson.com/products')
        .then(data => {
            products = data.products;
            container.innerHTML = '';
            displayProducts(data.products, container);
        })
        .catch(err => {
            console.error(err);
        });


    searchButton.addEventListener('click', (e) => {
        const query = searchInput.value.toLowerCase();
        const filteredProducts = fetchProducts('https://dummyjson.com/products/search?q=' + query)
            .then(data => {
                products = data.products;
                container.innerHTML = '';
                displayProducts(data.products, container);
            })
            .catch(err => {
                console.error(err);
        });
    });
}); 