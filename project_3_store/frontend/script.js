const API =
    "http://localhost:3000";


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

    const container =
        document.getElementById(
            "products"
        );

    container.innerHTML =
        "";

    res.data.forEach(
        product => {

            container.innerHTML += `

<div class="card">

<img src=
"${product.image}">

<h3>

${product.name}

</h3>

<p>

${product.description}

</p>

<h4>

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