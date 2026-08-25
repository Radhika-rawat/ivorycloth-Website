

const products = [
    {
        id: 1,
        name: "Ivory Linen Dress",
        category: "Dresses",
        price: 2499,
        oldPrice: 3299,
        size: ["S", "M", "L"],
        color: "Ivory",
        rating: 4.8,
        reviews: 124,
        image: "images/news/new1.jpg"
    },

    {
        id: 2,
        name: "Classic Summer Top",
        category: "Tops",
        price: 1499,
        oldPrice: 1999,
        size: ["S", "M", "L", "XL"],
        color: "White",
        rating: 4.7,
        reviews: 89,
        image: "images/news/new2.jpg"
    },

    {
        id: 3,
        name: "Wide Leg Trousers",
        category: "Bottoms",
        price: 1999,
        oldPrice: 2699,
        size: ["S", "M", "L"],
        color: "Beige",
        rating: 4.6,
        reviews: 76,
        image: "images/news/new3.jpg"
    },

    {
        id: 4,
        name: "Minimal Shoulder Bag",
        category: "Accessories",
        price: 1799,
        oldPrice: 2299,
        size: ["FREE"],
        color: "Brown",
        rating: 4.9,
        reviews: 154,
        image: "images/news/new4.jpg"
    },

    {
        id: 5,
        name: "Elegant Evening Dress",
        category: "Dresses",
        price: 2899,
        oldPrice: 3999,
        size: ["S", "M", "L"],
        color: "Black",
        rating: 4.9,
        reviews: 201,
        image: "images/news/new5.jpg"
    },

    {
        id: 6,
        name: "Soft Cotton Blouse",
        category: "Tops",
        price: 1699,
        oldPrice: 2199,
        size: ["S", "M", "L", "XL"],
        color: "Cream",
        rating: 4.5,
        reviews: 63,
        image: "images/news/new6.jpg"
    },

    {
        id: 7,
        name: "High Waist Pants",
        category: "Bottoms",
        price: 2199,
        oldPrice: 2999,
        size: ["S", "M", "L"],
        color: "Olive",
        rating: 4.7,
        reviews: 92,
        image: "images/news/new7.jpg"
    },

    {
        id: 8,
        name: "Everyday Mini Bag",
        category: "Accessories",
        price: 1299,
        oldPrice: 1799,
        size: ["FREE"],
        color: "Tan",
        rating: 4.6,
        reviews: 54,
        image: "images/news/new8.jpg"
    }
];


/* ============================================================
   2. STATE
   ============================================================ */

let cart =
    JSON.parse(localStorage.getItem("ivoryCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("ivoryWishlist")) || [];

let recentlyViewed =
    JSON.parse(localStorage.getItem("ivoryRecent")) || [];


/* ============================================================
   3. DOM
   ============================================================ */

const productsContainer =
    document.querySelector(".products");

const cartCount =
    document.querySelector(".cart-count");


/* ============================================================
   4. FORMAT PRICE
   ============================================================ */

function formatPrice(price) {

    return "₹" + price.toLocaleString("en-IN");

}


/* ============================================================
   5. SAVE DATA
   ============================================================ */

function saveCart() {

    localStorage.setItem(
        "ivoryCart",
        JSON.stringify(cart)
    );

}


function saveWishlist() {

    localStorage.setItem(
        "ivoryWishlist",
        JSON.stringify(wishlist)
    );

}


function saveRecentlyViewed() {

    localStorage.setItem(
        "ivoryRecent",
        JSON.stringify(recentlyViewed)
    );

}


/* ============================================================
   6. UPDATE CART COUNT
   ============================================================ */

function updateCartCount() {

    if (!cartCount) return;

    const totalItems =
        cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

    cartCount.textContent =
        totalItems;

}


/* ============================================================
   7. CREATE PRODUCT CARD
   ============================================================ */

function createProductCard(product) {

    const liked =
        wishlist.includes(product.id);


    const card =
        document.createElement("div");

    card.className = "product";


    card.innerHTML = `

        <div class="product-image">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <button
                class="heart ${liked ? "active" : ""}"
                data-id="${product.id}"
            >
                ${liked ? "♥" : "♡"}
            </button>

            <span class="sale-badge">
                SALE
            </span>

            <button
                class="quick-view"
                data-id="${product.id}"
            >
                QUICK VIEW
            </button>

        </div>

        <div class="product-info">

            <p class="product-category">
                ${product.category}
            </p>

            <h3>
                ${product.name}
            </h3>

            <div class="price">

                ${formatPrice(product.price)}

                <span class="old-price">
                    ${formatPrice(product.oldPrice)}
                </span>

            </div>

            <div class="rating">

                ★★★★★

                <span>
                    (${product.reviews})
                </span>

            </div>

            <button
                class="add-cart-btn"
                data-id="${product.id}"
            >
                ADD TO BAG
            </button>

        </div>

    `;


    /* Wishlist */

    const heart =
        card.querySelector(".heart");

    heart.addEventListener(
        "click",
        () => toggleWishlist(product.id, heart)
    );


    /* Cart */

    const addButton =
        card.querySelector(".add-cart-btn");

    addButton.addEventListener(
        "click",
        () => addToCart(product.id)
    );


    /* Quick View */

    const quickView =
        card.querySelector(".quick-view");

    quickView.addEventListener(
        "click",
        () => openQuickView(product.id)
    );


    return card;

}


/* ============================================================
   8. DISPLAY PRODUCTS
   ============================================================ */

function displayProducts(list = products) {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (list.length === 0) {

        productsContainer.innerHTML = `

            <div class="no-products">

                <h3>No products found</h3>

                <p>
                    Try changing your search or filters.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(product => {

        productsContainer.appendChild(
            createProductCard(product)
        );

    });

}


/* ============================================================
   9. ADD TO CART
   ============================================================ */

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    showNotification(
        `${product.name} added to your bag 🛍️`
    );

}


/* ============================================================
   10. REMOVE FROM CART
   ============================================================ */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    updateCartCount();

    renderCart();

}


/* ============================================================
   11. CHANGE QUANTITY
   ============================================================ */

function changeQuantity(id, change) {

    const item =
        cart.find(
            product => product.id === id
        );

    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    saveCart();

    updateCartCount();

    renderCart();

}


/* ============================================================
   12. CART SIDEBAR
   ============================================================ */

function openCart() {

    let sidebar =
        document.querySelector(".cart-sidebar");

    if (!sidebar) {

        sidebar =
            document.createElement("div");

        sidebar.className =
            "cart-sidebar";

        document.body.appendChild(
            sidebar
        );

    }


    renderCart();

    setTimeout(() => {

        sidebar.classList.add("active");

    }, 10);

}


/* ============================================================
   13. RENDER CART
   ============================================================ */

function renderCart() {

    const sidebar =
        document.querySelector(".cart-sidebar");

    if (!sidebar) return;


    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    const shipping =
        subtotal >= 999 || subtotal === 0
            ? 0
            : 99;


    const total =
        subtotal + shipping;


    sidebar.innerHTML = `

        <div class="cart-header">

            <h2>Your Bag</h2>

            <button
                class="close-cart"
            >
                ✕
            </button>

        </div>


        <div class="cart-items">

            ${
                cart.length === 0

                ?

                `
                    <div class="empty-cart">

                        <div>🛍️</div>

                        <h3>
                            Your bag is empty
                        </h3>

                        <p>
                            Discover something beautiful.
                        </p>

                    </div>
                `

                :

                cart.map(item => `

                    <div class="cart-item">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                        <div class="cart-item-info">

                            <h4>
                                ${item.name}
                            </h4>

                            <p>
                                ${formatPrice(item.price)}
                            </p>

                            <div class="quantity">

                                <button
                                    onclick="changeQuantity(${item.id}, -1)"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    onclick="changeQuantity(${item.id}, 1)"
                                >
                                    +
                                </button>

                            </div>

                            <button
                                class="remove-item"
                                onclick="removeFromCart(${item.id})"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `).join("")

            }

        </div>


        <div class="cart-footer">

            <div class="cart-row">

                <span>Subtotal</span>

                <strong>
                    ${formatPrice(subtotal)}
                </strong>

            </div>


            <div class="cart-row">

                <span>Shipping</span>

                <strong>
                    ${
                        shipping === 0
                        ? "FREE"
                        : formatPrice(shipping)
                    }
                </strong>

            </div>


            <div class="cart-row total">

                <span>Total</span>

                <strong>
                    ${formatPrice(total)}
                </strong>

            </div>


            <button
                class="checkout-btn"
                ${cart.length === 0 ? "disabled" : ""}
            >
                PROCEED TO CHECKOUT
            </button>

        </div>

    `;


    sidebar
        .querySelector(".close-cart")
        .addEventListener(
            "click",
            closeCart
        );


    const checkout =
        sidebar.querySelector(".checkout-btn");


    if (checkout) {

        checkout.addEventListener(
            "click",
            () => {

                showNotification(
                    "Checkout coming soon ✨"
                );

            }
        );

    }

}


/* ============================================================
   14. CLOSE CART
   ============================================================ */

function closeCart() {

    const sidebar =
        document.querySelector(".cart-sidebar");

    if (sidebar) {

        sidebar.classList.remove(
            "active"
        );

    }

}


/* ============================================================
   15. WISHLIST
   ============================================================ */

function toggleWishlist(id, button) {

    const index =
        wishlist.indexOf(id);


    if (index !== -1) {

        wishlist.splice(index, 1);

        button.classList.remove("active");

        button.textContent = "♡";

        showNotification(
            "Removed from wishlist"
        );

    } else {

        wishlist.push(id);

        button.classList.add("active");

        button.textContent = "♥";

        showNotification(
            "Added to wishlist ❤️"
        );

    }


    saveWishlist();

}


/* ============================================================
   16. QUICK VIEW
   ============================================================ */

function openQuickView(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;


    recentlyViewed =
        recentlyViewed.filter(
            item => item !== id
        );

    recentlyViewed.unshift(id);

    recentlyViewed =
        recentlyViewed.slice(0, 6);

    saveRecentlyViewed();


    const modal =
        document.createElement("div");

    modal.className =
        "quick-view-modal";


    modal.innerHTML = `

        <div class="quick-view-content">

            <button
                class="quick-close"
            >
                ✕
            </button>

            <div class="quick-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="quick-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h2>
                    ${product.name}
                </h2>

                <div class="quick-rating">
                    ★★★★★
                    <span>
                        ${product.rating}
                    </span>
                </div>

                <div class="quick-price">
                    ${formatPrice(product.price)}
                </div>

                <p>
                    A timeless Ivory Clothing piece
                    designed for effortless style,
                    comfort and confidence.
                </p>

                <div class="size-selection">

                    <strong>
                        Select Size
                    </strong>

                    <div>

                        ${
                            product.size.map(size => `
                                <button>
                                    ${size}
                                </button>
                            `).join("")
                        }

                    </div>

                </div>

                <button
                    class="modal-add-cart"
                >
                    ADD TO BAG
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    modal
        .querySelector(".quick-close")
        .addEventListener(
            "click",
            () => modal.remove()
        );


    modal
        .querySelector(".modal-add-cart")
        .addEventListener(
            "click",
            () => {

                addToCart(product.id);

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                modal.remove();

            }

        }
    );

}


/* ============================================================
   17. SEARCH
   ============================================================ */

function createSearch() {

    const searchIcon =
        document.querySelector(".search-icon");

    if (!searchIcon) return;


    searchIcon.addEventListener(
        "click",
        () => {

            const overlay =
                document.createElement("div");

            overlay.className =
                "search-overlay";


            overlay.innerHTML = `

                <div class="search-box">

                    <button
                        class="search-close"
                    >
                        ✕
                    </button>

                    <p>
                        SEARCH IVORY
                    </p>

                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search products..."
                        autofocus
                    >

                    <div
                        id="searchResults"
                    ></div>

                </div>

            `;


            document.body.appendChild(
                overlay
            );


            const input =
                overlay.querySelector(
                    "#searchInput"
                );

            const results =
                overlay.querySelector(
                    "#searchResults"
                );


            input.addEventListener(
                "input",
                () => {

                    const value =
                        input.value
                            .toLowerCase()
                            .trim();


                    if (!value) {

                        results.innerHTML = "";

                        return;

                    }


                    const matches =
                        products.filter(product =>

                            product.name
                                .toLowerCase()
                                .includes(value)

                            ||

                            product.category
                                .toLowerCase()
                                .includes(value)

                            ||

                            product.color
                                .toLowerCase()
                                .includes(value)

                        );


                    results.innerHTML =
                        matches.length

                        ?

                        matches.map(product => `

                            <div
                                class="search-result"
                                onclick="openQuickView(${product.id})"
                            >

                                <img
                                    src="${product.image}"
                                >

                                <span>
                                    ${product.name}
                                </span>

                                <strong>
                                    ${formatPrice(product.price)}
                                </strong>

                            </div>

                        `).join("")

                        :

                        `
                            <p class="no-result">
                                No products found.
                            </p>
                        `;

                }
            );


            overlay
                .querySelector(".search-close")
                .addEventListener(
                    "click",
                    () => overlay.remove()
                );

        }
    );

}


/* ============================================================
   18. CATEGORY FILTER
   ============================================================ */

function categoryFilter(category) {

    const filtered =
        products.filter(
            product =>
                product.category === category
        );

    displayProducts(filtered);

}


/* ============================================================
   19. SORT PRODUCTS
   ============================================================ */

function sortProducts(type) {

    let sorted =
        [...products];


    if (type === "low") {

        sorted.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (type === "high") {

        sorted.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (type === "rating") {

        sorted.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    displayProducts(sorted);

}


/* ============================================================
   20. NOTIFICATIONS
   ============================================================ */

function showNotification(message) {

    const existing =
        document.querySelector(
            ".ivory-notification"
        );


    if (existing) {

        existing.remove();

    }


    const notification =
        document.createElement("div");

    notification.className =
        "ivory-notification";


    notification.innerHTML = `

        <span>✓</span>

        ${message}

    `;


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => notification.remove(),
        2500
    );

}


/* ============================================================
   21. CART ICON
   ============================================================ */

const cartIcon =
    document.querySelector(".cart-icon");


if (cartIcon) {

    cartIcon.addEventListener(
        "click",
        openCart
    );

}


/* ============================================================
   22. MOBILE MENU
   ============================================================ */

const menuButton =
    document.querySelector(".menu-btn");

const navLinks =
    document.querySelector(".nav-links");


if (menuButton && navLinks) {

    menuButton.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "active"
            );


            menuButton.textContent =
                navLinks.classList.contains("active")
                    ? "✕"
                    : "☰";

        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "active"
                    );

                    menuButton.textContent =
                        "☰";

                }
            );

        });

}


/* ============================================================
   23. CATEGORY CLICK
   ============================================================ */

document
    .querySelectorAll(".category")
    .forEach(category => {

        category.addEventListener(
            "click",
            () => {

                const title =
                    category
                        .querySelector("h3")
                        ?.textContent;


                if (!title) return;


                if (title === "Dresses") {

                    categoryFilter("Dresses");

                }

                else if (title === "Tops") {

                    categoryFilter("Tops");

                }

                else if (title === "Bottoms") {

                    categoryFilter("Bottoms");

                }

                else if (
                    title === "Accessories"
                ) {

                    categoryFilter(
                        "Accessories"
                    );

                }


                document
                    .querySelector("#products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* ============================================================
   24. BACK TO TOP
   ============================================================ */

const topButton =
    document.createElement("button");

topButton.className =
    "back-to-top";

topButton.innerHTML = "↑";

document.body.appendChild(
    topButton
);


window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 500) {

            topButton.classList.add(
                "show"
            );

        } else {

            topButton.classList.remove(
                "show"
            );

        }

    }
);


topButton.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* ============================================================
   25. NEWSLETTER
   ============================================================ */

const newsletter =
    document.querySelector(".newsletter");


if (newsletter) {

    const input =
        newsletter.querySelector("input");

    const button =
        newsletter.querySelector("button");


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const email =
                input.value.trim();


            if (!email) {

                showNotification(
                    "Please enter your email."
                );

                return;

            }


            if (
                !email.includes("@") ||
                !email.includes(".")
            ) {

                showNotification(
                    "Please enter a valid email."
                );

                return;

            }


            input.value = "";


            showNotification(
                "Welcome to the Ivory family ✨"
            );

        }
    );

}


/* ============================================================
   26. SCROLL REVEAL
   ============================================================ */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


document
    .querySelectorAll(
        ".section, .promo, .brands, .features"
    )
    .forEach(element => {

        element.classList.add(
            "scroll-hidden"
        );

        observer.observe(element);

    });


/* ============================================================
   27. INITIALIZE
   ============================================================ */

displayProducts();

updateCartCount();

createSearch();


console.log(
    "✨ Ivory Clothing loaded successfully!"
);
