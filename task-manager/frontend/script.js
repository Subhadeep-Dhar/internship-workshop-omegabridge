const API =
    "http://localhost:3000/tasks";

let allTasks = [];


// ---------- LOAD TASKS ----------

async function loadTasks() {

    try {

        const res =
            await axios.get(API);

        allTasks =
            res.data;

        applyCurrentSort();

    } catch (error) {

        console.log(error);

    }
}

function applyCurrentSort() {

    let sortedTasks =
        [...allTasks];

    if (
        currentSort ===
        "oldest"
    ) {

        sortedTasks.sort(
            (a, b) =>
                new Date(
                    a.createdAt
                )
                -
                new Date(
                    b.createdAt
                )
        );

    } else {

        sortedTasks.sort(
            (a, b) =>
                new Date(
                    b.createdAt
                )
                -
                new Date(
                    a.createdAt
                )
        );

    }

    displayTasks(
        sortedTasks
    );
}



// ---------- DISPLAY TASKS ----------

function displayTasks(tasks) {

    const list =
        document.getElementById(
            "taskList"
        );

    list.innerHTML = "";

    if (tasks.length === 0) {

        list.innerHTML = `
            <p class="empty-message">

            No Tasks Available

            </p>
        `;

        return;
    }

    tasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className =
            `${task.category.toLowerCase()}-task`;

        li.innerHTML = `

<div class="task-info">

<span class="${task.completed
                ? "completed"
                : ""
            }">

${task.title}

</span>

<span class="category">

${task.category}

</span>

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

        list.appendChild(li);

    });
}



// ---------- ADD TASK ----------

async function addTask() {

    const title =
        document.getElementById(
            "taskInput"
        ).value;

    const category =
        document.getElementById(
            "category"
        ).value;

    if (!title) {

        alert(
            "Enter Task"
        );

        return;
    }

    await axios.post(
        API,
        {
            title,
            category
        }
    );

    document.getElementById(
        "taskInput"
    ).value = "";

    loadTasks();
}



// ---------- TOGGLE TASK ----------

let currentSort =
    "newest";

async function toggleTask(
    id,
    completed
) {

    await axios.put(
        `${API}/${id}`,
        {
            completed
        }
    );

    await loadTasks();

}



// ---------- EDIT TASK ----------

async function editTask(
    id,
    oldTitle
) {

    const newTitle =
        prompt(
            "Edit Task",
            oldTitle
        );

    if (!newTitle)
        return;

    await axios.put(
        `${API}/${id}`,
        {
            title:
                newTitle
        }
    );

    loadTasks();
}



// ---------- DELETE TASK ----------

async function deleteTask(id) {

    await axios.delete(
        `${API}/${id}`
    );

    loadTasks();
}



// ---------- SORT ----------

function sortNewest() {

    currentSort =
        "newest";

    applyCurrentSort();

}


function sortOldest() {

    currentSort =
        "oldest";

    applyCurrentSort();

}

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

// ---------- INITIAL LOAD ----------

loadTasks();