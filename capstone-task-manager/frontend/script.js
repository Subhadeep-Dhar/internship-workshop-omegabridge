const API =
    "http://localhost:3000";


// ---------- TOKEN ----------

function getHeaders() {

    const token =
        localStorage.getItem(
            "token"
        );

    return {

        headers: {
            Authorization:
                `Bearer ${token}`
        }

    };
}



// ---------- SIGNUP ----------

async function signup() {

    try {

        const name =
            document.getElementById(
                "name"
            ).value.trim();

        const email =
            document.getElementById(
                "email"
            ).value.trim();

        const password =
            document.getElementById(
                "password"
            ).value.trim();

        if (
            !name ||
            !email ||
            !password
        ) {

            alert(
                "Fill all fields"
            );

            return;
        }

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

    } catch (error) {

        console.log(error);

        alert(
            "Signup Failed"
        );
    }
}



// ---------- LOGIN ----------

async function login() {

    try {

        const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();

        const password =
            document.getElementById(
                "loginPassword"
            ).value.trim();

        if (
            !email ||
            !password
        ) {

            alert(
                "Fill all fields"
            );

            return;
        }

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

        alert(
            "Login Successful"
        );

        window.location.href =
            "dashboard.html";

    } catch (error) {

        console.log(error);

        alert(
            "Login Failed"
        );
    }
}



// ---------- LOAD TASKS ----------

async function loadTasks() {

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            window.location.href =
                "login.html";

            return;
        }

        const res =
            await axios.get(
                `${API}/tasks`,
                getHeaders()
            );

        displayTasks(
            res.data
        );

    } catch (error) {

        console.log(error);

        localStorage.removeItem(
            "token"
        );

        alert(
            "Login Required"
        );

        window.location.href =
            "login.html";
    }
}



// ---------- DISPLAY TASKS ----------

function displayTasks(
    tasks
) {

    const list =
        document.getElementById(
            "taskList"
        );

    list.innerHTML = "";

    if (
        tasks.length === 0
    ) {

        list.innerHTML = `
<p class="empty-message">

No Tasks Found

</p>
`;

        return;
    }

    const completed =
        tasks.filter(
            t => t.completed
        ).length;

    document.getElementById(
        "totalTasks"
    ).innerText =
        tasks.length;

    document.getElementById(
        "completedTasks"
    ).innerText =
        completed;

    document.getElementById(
        "pendingTasks"
    ).innerText =
        tasks.length -
        completed;

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `${task.category.toLowerCase()}-task`;

        li.innerHTML = `

<div class="task-info">

<span class="${task.completed
                ? "completed"
                : ""
            }">

${task.title}

</span>

<span class="
category
${task.category
                .toLowerCase()}
">

${task.category}

</span>

<small>

Due:
${task.dueDate
                ?
                new Date(
                    task.dueDate
                ).toLocaleDateString()
                :
                "N/A"
            }

</small>

</div>

<div class="task-buttons">

<button
class="complete-btn"
onclick="toggleTask(
'${task._id}',
${!task.completed}
)">

${task.completed
                ? "Undo"
                : "Complete"
            }

</button>

<button
class="edit-btn"
onclick="editTask(
'${task._id}',
'${task.title}'
)">

Edit

</button>

<button
class="delete-btn"
onclick="deleteTask(
'${task._id}'
)">

Delete

</button>

</div>
`;

        list.appendChild(
            li
        );

    });
}



// ---------- ADD TASK ----------

async function addTask() {

    try {

        const title =
            document.getElementById(
                "taskInput"
            ).value.trim();

        const category =
            document.getElementById(
                "category"
            ).value;

        const dueDate =
            document.getElementById(
                "dueDate"
            ).value;

        if (!title) {

            alert(
                "Enter Task"
            );

            return;
        }

        await axios.post(

            `${API}/tasks`,

            {
                title,
                category,
                dueDate
            },

            getHeaders()

        );

        document.getElementById(
            "taskInput"
        ).value = "";

        loadTasks();

    } catch (error) {

        console.log(error);
    }
}



// ---------- COMPLETE ----------

async function toggleTask(
    id,
    completed
) {

    await axios.put(

        `${API}/tasks/${id}`,

        {
            completed
        },

        getHeaders()

    );

    loadTasks();
}



// ---------- EDIT ----------

async function editTask(
    id,
    oldTitle
) {

    const newTitle =
        prompt(
            "Edit Task",
            oldTitle
        );

    if (
        !newTitle ||
        newTitle.trim() === ""
    )
        return;

    await axios.put(

        `${API}/tasks/${id}`,

        {
            title:
                newTitle
        },

        getHeaders()

    );

    loadTasks();
}



// ---------- DELETE ----------

async function deleteTask(
    id
) {

    await axios.delete(

        `${API}/tasks/${id}`,

        getHeaders()

    );

    loadTasks();
}



// ---------- LOGOUT ----------

function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href = "login.html";
}



// ---------- PAGE CHECK ----------

const page =
    window.location.pathname
        .split("/")
        .pop();

const token =
    localStorage.getItem(
        "token"
    );

if (
    page ===
    "dashboard.html"
) {

    if (!token) {

        window.location.href =
            "login.html";

    } else {

        loadTasks();

    }
}

if (
    document.getElementById(
        "taskInput"
    )
) {

    document
        .getElementById(
            "taskInput"
        )

        .addEventListener(
            "keypress",

            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    addTask();

                }
            });
}