document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('product-container');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchBtn');
    let products = {};


    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            products = data.products;
            container.innerHTML = '';
            data.products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p class="price">$${product.price}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error(err);
        });

    searchButton.addEventListener('click', (e) => {
        const query = searchInput.value.toLowerCase();
        const filteredProducts = fetch('https://dummyjson.com/products/search?q=' + query)
            .then(res => res.json())
            .then( data => {
                products = data.products;
                container.innerHTML = '';
                data.products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <img src="${product.thumbnail}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p class="price">$${product.price}</p>
                    `;
                    container.appendChild(card);
            });
        })
        .catch(err => {
            console.error(err);
            return [];
        });
    });
});
//