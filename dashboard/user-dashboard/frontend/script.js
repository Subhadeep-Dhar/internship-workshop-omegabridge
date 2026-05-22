const API = "http://localhost:3000";


// ---------- SIGNUP ----------

function signup() {

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    axios.post(`${API}/signup`, {
        name,
        email,
        password
    })

    .then(res => {

        alert(res.data.message);

        window.location.href =
            "login.html";
    })

    .catch(err =>
        console.log(err));
}


// ---------- LOGIN ----------

function login() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value;

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    axios.post(`${API}/login`, {
        email,
        password
    })

    .then(res => {

        localStorage.setItem(
            "token",
            res.data.token
        );

        alert("Login Successful");

        window.location.href =
            "dashboard.html";
    })

    .catch(err =>
        console.log(err));
}


// ---------- GET TOKEN ----------

function getToken() {

    return {
        headers: {
            Authorization:
            `Bearer ${
                localStorage.getItem(
                    "token"
                )
            }`
        }
    };
}


// ---------- LOAD USERS ----------

function loadUsers() {

    axios.get(
        `${API}/users`,
        getToken()
    )

    .then(res => {

        const users = res.data;

        let output = "";

        users.forEach(user => {

            output += `
            <tr>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>

                <button
                onclick="editUser(
                '${user._id}',
                '${user.name}'
                )">

                Edit

                </button>

                <button
                onclick="deleteUser(
                '${user._id}'
                )">

                Delete

                </button>

                </td>

            </tr>
            `;
        });

        document.getElementById(
            "userTable"
        ).innerHTML = output;
    })

    .catch(err => {

        alert("Login Required");

        window.location.href =
            "login.html";
    });
}


// ---------- ADD USER ----------

function addUser() {

    const name =
        document.getElementById(
            "newName"
        ).value;

    const email =
        document.getElementById(
            "newEmail"
        ).value;

    const password =
        document.getElementById(
            "newPassword"
        ).value;

    axios.post(
        `${API}/users`,
        {
            name,
            email,
            password
        },
        getToken()
    )

    .then(() => {

        alert("User Added");

        loadUsers();
    });
}


// ---------- DELETE ----------

function deleteUser(id) {

    axios.delete(
        `${API}/users/${id}`,
        getToken()
    )

    .then(() => {

        alert("Deleted");

        loadUsers();
    });
}


// ---------- UPDATE ----------

function editUser(id, oldName) {

    const newName =
        prompt(
            "Enter New Name",
            oldName
        );

    axios.put(
        `${API}/users/${id}`,
        {
            name: newName
        },
        getToken()
    )

    .then(() => {

        alert("Updated");

        loadUsers();
    });
}


// ---------- SEARCH ----------

function searchUser() {

    const name =
        document.getElementById(
            "search"
        ).value;

    axios.get(
        `${API}/search/${name}`,
        getToken()
    )

    .then(res => {

        let output = "";

        res.data.forEach(user => {

            output += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
            </tr>
            `;
        });

        document.getElementById(
            "userTable"
        ).innerHTML = output;
    });
}


// ---------- LOGOUT ----------

function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "login.html";
}


// ---------- AUTO LOAD ----------

const currentPage =
window.location.pathname
.split("/")
.pop();

if (currentPage === "dashboard.html") {
    loadUsers();
}