document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('product-container');

    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
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
});
