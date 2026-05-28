const API =
    "http://localhost:3000";

let allNotes =
    [];

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
        document
            .getElementById(
                "name"
            ).value;

    const email =
        document
            .getElementById(
                "email"
            ).value;

    const password =
        document
            .getElementById(
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
        document
            .getElementById(
                "loginEmail"
            ).value;

    const password =
        document
            .getElementById(
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



// ---------- LOAD NOTES ----------

async function loadNotes() {

    const res =
        await axios.get(

            `${API}/notes`,

            getHeaders()

        );

    allNotes =
        res.data;

    displayNotes(
        allNotes
    );
}



// ---------- DISPLAY NOTES ----------

function displayNotes(
    notes
) {

    const notesDiv =
        document
            .getElementById(
                "notes"
            );

    const pinnedDiv =
        document
            .getElementById(
                "pinnedNotes"
            );

    notesDiv.innerHTML =
        "";

    pinnedDiv.innerHTML =
        "";

    // Empty state

    if (
        notes.length === 0
    ) {

        notesDiv.innerHTML =

            `<h2 class="empty">

No Notes Yet

</h2>`;

        return;
    }

    notes.forEach(
        note => {

            const html =

                `
<div
class="note-card"

style=
"background:
${note.color};">

<div>

<h3>

${note.title}

</h3>

<p>

${note.content}

</p>

</div>

<div
class=
"note-actions">

<button
class=
"pin-btn"

onclick=
"togglePin(
'${note._id}',
${note.pinned}
)">

${note.pinned ?
                    "Unpin"
                    :
                    "Pin"}

</button>

<button
class=
"edit-btn"

onclick=
"editNote(
'${note._id}',
\`${note.title}\`,
\`${note.content}\`
)">

Edit

</button>

<button
class=
"delete-btn"

onclick=
"deleteNote(
'${note._id}'
)">

Delete

</button>

</div>

</div>
`;

            // Show pinned separately

            if (
                note.pinned
            ) {

                pinnedDiv
                    .innerHTML +=
                    html;
            }

            // Show ALL notes

            notesDiv
                .innerHTML +=
                html;
        });
}



// ---------- CREATE NOTE ----------

async function createNote() {

    const title =
        document
            .getElementById(
                "title"
            ).value;

    const content =
        document
            .getElementById(
                "content"
            ).value;

    const color =
        document
            .getElementById(
                "color"
            ).value;

    await axios.post(

        `${API}/notes`,

        {
            title,
            content,
            color
        },

        getHeaders()

    );

    loadNotes();
}



// ---------- DELETE ----------

async function deleteNote(
    id
) {

    await axios.delete(

        `${API}/notes/${id}`,

        getHeaders()

    );

    loadNotes();
}



// ---------- PIN ----------

async function togglePin(
    id,
    current
) {

    await axios.put(

        `${API}/notes/${id}`,

        {
            pinned:
                !current
        },

        getHeaders()

    );

    loadNotes();
}



// ---------- EDIT ----------

async function editNote(
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

        `${API}/notes/${id}`,

        {
            title,
            content
        },

        getHeaders()

    );

    loadNotes();
}



// ---------- SEARCH ----------

function searchNotes() {

    const value =
        document
            .getElementById(
                "search"
            )

            .value
            .toLowerCase();

    const filtered =
        allNotes.filter(
            note =>

                note.title
                    .toLowerCase()
                    .includes(value)

                ||

                note.content
                    .toLowerCase()
                    .includes(value)
        );

    displayNotes(
        filtered
    );
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

const token =
    localStorage.getItem(
        "token"
    );


// Protect Dashboard

if (
    (page === "index.html"
        ||
        page === "")
    &&
    !token
) {

    window.location.href =
        "login.html";
}


// Redirect logged user

if (
    (page === "login.html"
        ||
        page === "signup.html")
    &&
    token
) {

    window.location.href =
        "index.html";
}


// Load notes

if (
    (page === "index.html"
        ||
        page === "")
    &&
    token
) {

    loadNotes();
}