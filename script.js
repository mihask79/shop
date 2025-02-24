document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById("product-list");
    const searchInput = document.getElementById("search");
    const addProductForm = document.getElementById("add-product-form");
    const loginForm = document.getElementById("login-form");
    const adminPanel = document.getElementById("admin-panel");
    const loginButton = document.getElementById("login-button");
    const adminPasswordInput = document.getElementById("admin-password");

    const ADMIN_PASSWORD = "12345"; // Пароль администратора
    let isAdmin = false; // Флаг для определения прав администратора

    let products = JSON.parse(localStorage.getItem("products")) || [
        { name: "Фильтр масляный", price: "500 руб.", image: "images/filter.jpg", quantity: 5 },
        { name: "Тормозные колодки", price: "1200 руб.", image: "images/brake.jpg", quantity: 10 }
    ];

    function saveProducts() {
        localStorage.setItem("products", JSON.stringify(products));
    }

    function renderProducts(filter = "") {
        productList.innerHTML = "";
        products
            .filter(product => product.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach((product, index) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");

                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Цена: ${product.price}</p>
                    <p>Количество: ${product.quantity}</p>
                    ${isAdmin ? `<button class="delete-btn" data-index="${index}">Удалить</button>` : ""}
                `;

                productList.appendChild(productDiv);
            });

        if (isAdmin) {
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const index = event.target.getAttribute("data-index");
                    products.splice(index, 1);
                    saveProducts();
                    renderProducts();
                });
            });
        }
    }

    searchInput.addEventListener("input", () => {
        renderProducts(searchInput.value);
    });

    addProductForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("product-name").value;
        const price = document.getElementById("product-price").value;
        const image = document.getElementById("product-image").value;
        const quantity = parseInt(document.getElementById("product-quantity").value, 10);

        if (name && price && image && quantity > 0) {
            products.push({ name, price, image, quantity });
            saveProducts();
            renderProducts();
            addProductForm.reset();
        }
    });

    loginButton.addEventListener("click", () => {
        const enteredPassword = adminPasswordInput.value;
        if (enteredPassword === ADMIN_PASSWORD) {
            alert("Вы вошли как администратор!");
            isAdmin = true;
            loginForm.style.display = "none";
            adminPanel.style.display = "block";
            renderProducts();
        } else {
            alert("Неправильный пароль!");
        }
    });

    renderProducts();
});
