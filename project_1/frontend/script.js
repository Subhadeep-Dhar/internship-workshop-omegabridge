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

    if (
        res.data.message ===
        "Signup Successful"
    ) {

        window.location.href =
            "login.html";
    }
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
        "dashboard.html";
}



// ---------- LOAD POSTS ----------

async function loadPosts() {

    try {

        const page =
            window.location.pathname
                .split("/")
                .pop();

        let res;

        if (
            page ===
            "dashboard.html"
        ) {

            res =
                await axios.get(

                    `${API}/my-posts`,

                    getHeaders()

                );

        } else {

            res =
                await axios.get(
                    `${API}/posts`
                );

        }

        displayPosts(
            res.data
        );

    } catch (
    error
    ) {

        console.log(
            error
        );
    }
}



// ---------- DISPLAY POSTS ----------

function displayPosts(
    posts
) {

    const container =
        document.getElementById(
            window.location.pathname
                .includes(
                    "dashboard"
                )
                ?
                "dashboardPosts"
                :
                "posts"
        );

    container.innerHTML = "";

    if (
        posts.length === 0
    ) {

        container.innerHTML = `

            <p class="empty-message">

            No Blog Posts Yet

            </p>

        `;

        return;
    }

    const token =
        localStorage.getItem(
            "token"
        );

    let currentUserId =
        null;

    if (token) {

        currentUserId =
            JSON.parse(
                atob(
                    token.split(".")[1]
                )
            ).id;
    }

    posts.forEach(post => {

        const isOwner =
            currentUserId ===
            post.authorId;

        container.innerHTML += `

<div class="card">

<h2 class="post-title">

${post.title}

</h2>

<p class="post-content">

${post.content}

</p>

<div class="post-meta">

<span>

By
${post.authorName}

</span>

<span>

${new Date(
            post.createdAt
        ).toLocaleDateString()}

</span>

</div>

${window.location.pathname
                .includes(
                    "dashboard"
                )

                ?

                isOwner

                    ?

                    `

<div class="post-actions">

<button
class="edit-btn"
onclick="editPost(
'${post._id}',
\`${post.title}\`,
\`${post.content}\`
)">

Edit

</button>

<button
class="delete-btn"
onclick="deletePost(
'${post._id}'
)">

Delete

</button>

</div>

`

                    :

                    ""

                :

                ""
            }

</div>
`;
    });
}



// ---------- CREATE POST ----------

async function createPost() {

    try {

        const title =
            document.getElementById(
                "title"
            ).value.trim();

        const content =
            document.getElementById(
                "content"
            ).value.trim();

        if (
            !title ||
            !content
        ) {

            alert(
                "Fill all fields"
            );

            return;
        }

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            alert(
                "Login Required"
            );

            window.location.href =
                "login.html";

            return;
        }

        const res =
            await axios.post(

                `${API}/posts`,

                {
                    title,
                    content
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );

        console.log(
            res.data
        );

        alert(
            "Post Published"
        );

        document.getElementById(
            "title"
        ).value = "";

        document.getElementById(
            "content"
        ).value = "";

        loadPosts();

    } catch (error) {

        console.log(error);

        alert(
            "Failed to Publish Post"
        );
    }
}



// ---------- EDIT POST ----------

async function editPost(
    id,
    oldTitle,
    oldContent
) {

    const title =
        prompt(
            "Edit Title",
            oldTitle
        );

    if (!title)
        return;

    const content =
        prompt(
            "Edit Content",
            oldContent
        );

    if (!content)
        return;

    await axios.put(

        `${API}/posts/${id}`,

        {
            title,
            content
        },

        getHeaders()

    );

    loadPosts();
}



// ---------- DELETE POST ----------

async function deletePost(
    id
) {

    await axios.delete(

        `${API}/posts/${id}`,

        getHeaders()

    );

    loadPosts();
}



// ---------- LOGOUT ----------

function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "index.html";
}



// ---------- PAGE CHECK ----------

const page =
    window.location.pathname
        .split("/")
        .pop();

if (
    page ===
    "index.html"
    ||
    page ===
    "dashboard.html"
    ||
    page ===
    ""
) {

    loadPosts();
}

if (
    page ===
    "dashboard.html"
    &&
    !localStorage.getItem(
        "token"
    )
) {

    window.location.href =
        "login.html";
}