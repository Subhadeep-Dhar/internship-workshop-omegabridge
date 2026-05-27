const API =
    "http://localhost:3000";

let allProducts = [];


// ---------- TOKEN ----------

function getHeaders() {

    return {

        headers: {

            Authorization:
                `Bearer ${localStorage.getItem(
                    "token"
                )
                }`

        }
    };
}



// ---------- SIGNUP ----------

async function signup() {

    const name =
        document.getElementById(
            "name"
        ).value;

    const email =
        document.getElementById(
            "email"
        ).value;

    const password =
        document.getElementById(
            "password"
        ).value;

    const res =
        await axios.post(

            `${API}/signup`,

            {
                name,
                email,
                password
            }

        );

    alert(
        res.data.message
    );

    window.location.href =
        "login.html";
}



// ---------- LOGIN ----------

async function login() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value;

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    const res =
        await axios.post(

            `${API}/login`,

            {
                email,
                password
            }

        );

    if (
        !res.data.token
    ) {

        alert(
            res.data.message
        );

        return;
    }

    localStorage.setItem(
        "token",
        res.data.token
    );

    window.location.href =
        "index.html";
}



// ---------- PRODUCTS ----------

async function loadProducts() {

    const res =
        await axios.get(
            `${API}/products`
        );

    allProducts =
        res.data;

    displayProducts(
        allProducts
    );
}

function displayProducts(
    products
) {

    const container =
        document.getElementById(
            "products"
        );

    container.innerHTML =
        "";

    if (
        products.length === 0
    ) {

        container.innerHTML =

            `<h2 class="empty">

No Products Found

</h2>`;

        return;
    }

    products.forEach(
        product => {

            container.innerHTML += `

<div class="card">

<img src=
"${product.image}">

<div class="card-content">

<h3>
${product.name}
</h3>

<p class="category">
${product.category}
</p>

<p>
${product.description}
</p>

<h4 class="price">
₹${product.price}
</h4>

<button
onclick=
"addToCart(
'${product._id}'
)">

Add To Cart

</button>

</div>
`;
        });
}

function searchProducts() {

    const value =
        document
            .getElementById(
                "search"
            )

            .value
            .toLowerCase();

    const filtered =
        allProducts.filter(
            product =>

                product.name
                    .toLowerCase()

                    .includes(
                        value
                    )

        );

    displayProducts(
        filtered
    );
}



// ---------- ADD TO CART ----------

async function addToCart(
    productId
) {

    if (
        !localStorage.getItem(
            "token"
        )
    ) {

        alert(
            "Login First"
        );

        window.location.href =
            "login.html";

        return;
    }

    const res =
        await axios.post(

            `${API}/cart`,

            {
                productId
            },

            getHeaders()

        );

    alert(
        res.data.message
    );
}



// ---------- LOAD CART ----------

async function loadCart() {

    const res =
        await axios.get(

            `${API}/cart`,

            getHeaders()

        );

    const cart =
        document.getElementById(
            "cartItems"
        );

    let total = 0;

    cart.innerHTML = "";

    if (
        res.data.length === 0
    ) {

        cart.innerHTML =

            `<h2 class="empty">

Cart Is Empty

</h2>`;

        document.getElementById(
            "total"
        ).innerText =
            "";

        return;
    }

    res.data.forEach(
        item => {

            total +=
                item.productId.price *
                item.quantity;

            cart.innerHTML += `

<div class=
"cart-item">

<div>

<h3>

${item.productId.name}

</h3>

<p>

₹
${item.productId.price}

x
${item.quantity}

</p>

</div>

<button
onclick=
"removeCart(
'${item._id}'
)">

Remove

</button>

</div>
`;
        });

    document.getElementById(
        "total"
    ).innerText =
        `Total:
₹${total}`;
}


async function loadOrders() {

    const res =
        await axios.get(

            `${API}/orders`,

            getHeaders()

        );

    const orders =
        document.getElementById(
            "orders"
        );

    orders.innerHTML =
        "";

    if (
        res.data.length === 0
    ) {

        orders.innerHTML =

            `<h2 class="empty">

No Orders Yet

</h2>`;

        return;
    }

    res.data.forEach(
        order => {

            orders.innerHTML += `

<div class=
"order-card">

<h3>

Order Total:
₹${order.total}

</h3>

<p>

Status:
${order.status}

</p>

<p>

${new Date(
                order.createdAt
            ).toLocaleString()}

</p>

</div>
`;
        });
}


// ---------- REMOVE CART ----------

async function removeCart(
    id
) {

    await axios.delete(

        `${API}/cart/${id}`,

        getHeaders()

    );

    loadCart();
}



// ---------- CHECKOUT ----------

async function checkout() {

    const res =
        await axios.post(

            `${API}/checkout`,

            {},

            getHeaders()

        );

    alert(
        res.data.message
    );

    loadCart();
}



// ---------- LOGOUT ----------

function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "login.html";
}



// ---------- PAGE LOAD ----------

const page =
    window.location.pathname
        .split("/")
        .pop();

if (
    page ===
    "index.html"
    ||
    page ===
    ""
) {

    loadProducts();
}

if (
    page ===
    "cart.html"
) {

    loadCart();
}

if (
    page ===
    "orders.html"
) {

    loadOrders();
}