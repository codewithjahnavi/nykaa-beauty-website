
// CART FUNCTIONALITY

// CART DATA
const cartIcon = document.querySelector(".header-icons span:last-child");

let cart = JSON.parse(localStorage.getItem("nykaaCart")) || [];

function updateCartIcon() {
    if (cartIcon) {
        const totalItems = cart.reduce(
            (total, item) => total + item.quantity, 0
        );
        cartIcon.textContent = "🛍️ " + totalItems;
    }
}

updateCartIcon();

// ADD TO CART
document.addEventListener("click", function(event) {
    const button = event.target.closest(
        ".product-card button:not(.wishlist-btn)"
    );

    if (!button) return;

    const productCard = button.closest(".product-card");

    const productName = productCard.querySelector("h3").textContent;
    const priceText = productCard.querySelector(".new-price").textContent;
    const price = Number(priceText.replace(/[^\d]/g, ""));

    const existingProduct = cart.find(
        item => item.name === productName
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("nykaaCart", JSON.stringify(cart));
    updateCartIcon();

    alert(productName + " added to cart!");
});

// SEARCH
const searchInput = document.getElementById("searchInput");
const productCards = document.querySelectorAll(".product-card");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        const searchValue = searchInput.value.toLowerCase();

        productCards.forEach(function(card) {
            const productName = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = productName.includes(searchValue) ? "block" : "none";
        });
    });
}

// WISHLIST
const wishlistButtons = document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        button.textContent =
            button.textContent.trim() === "♡" ? "❤️" : "♡";
    });
});

// CATEGORY FILTER
const categories = document.querySelectorAll(".category");

categories.forEach(function(category) {
    category.addEventListener("click", function() {
        const categoryName = category.textContent.toLowerCase();

        productCards.forEach(function(card) {
            const productCategory = card.dataset.category;

            card.style.display = categoryName.includes(productCategory)
                ? "block"
                : "none";
        });
    });
});

// BACK TO TOP
const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
    backToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// DISPLAY CART ITEMS

const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function displayCart() {
    if (!cartItemsContainer || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
        cartTotal.textContent = "Total: ₹0";
        return;
    }

    let total = 0;

    cartItemsContainer.innerHTML = cart.map(function(item, index) {
        total += item.price * item.quantity;

        return `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: ₹${item.price}</p>

                <button type="button" data-action="decrease" data-index="${index}">−</button>

                <span>${item.quantity}</span>

                <button type="button" data-action="increase" data-index="${index}">+</button>

                <button type="button" data-action="remove" data-index="${index}">
                    Remove
                </button>
            </div>
        `;
    }).join("");

    cartTotal.textContent = "Total: ₹" + total;
}

if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", function(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (action === "increase") {
            cart[index].quantity++;
        }

        if (action === "decrease") {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        }

        if (action === "remove") {
            cart.splice(index, 1);
        }

        localStorage.setItem("nykaaCart", JSON.stringify(cart));
        updateCartIcon();
        displayCart();
    });
}

displayCart();
const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const customerName =
            document.getElementById("customerName").value;

        alert("Thank you, " + customerName +
              "! Your order has been placed successfully. 💗");

        localStorage.removeItem("nykaaCart");

        window.location.href = "index.html";
    });
}
