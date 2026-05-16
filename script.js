let projects = [
    "Calculator App",
    "To-Do List",
    "Number Guessing Game",
    "Weather App",
    "Portfolio Website"
];

let projectList = document.getElementById("project-list");

projects.forEach(project => {

    let li = document.createElement("li");

    li.innerText = project;

    projectList.appendChild(li);
});

document.getElementById("contactForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("name").value.trim();

    let email = document.getElementById("email").value.trim();

    let phone = document.getElementById("phone").value.trim();

    let message = document.getElementById("message").value.trim();

    let msg = document.getElementById("formMessage");

    let phonePattern = /^[0-9]{10}$/;

    if(name === "" || email === "" || phone === "" || message === "") {

        msg.innerText = "All fields are required!";
        msg.style.color = "red";

    }
    else if(!email.includes("@")) {

        msg.innerText = "Please enter a valid email!";
        msg.style.color = "red";

    }
    else if(!phonePattern.test(phone)) {

        msg.innerText = "Phone number must be 10 digits!";
        msg.style.color = "red";

    }
    else {

        msg.innerText = "Message sent successfully!";
        msg.style.color = "green";

        document.getElementById("contactForm").reset();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e) {

        e.preventDefault();

        document.querySelector(this.getAttribute("href"))
        .scrollIntoView({
            behavior: "smooth"
        });
    });
});

let darkBtn = document.getElementById("darkModeBtn");

darkBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")) {
        darkBtn.innerText = "Light";
    } else {
        darkBtn.innerText = "Dark";
    }
});