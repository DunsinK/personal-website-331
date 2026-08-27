(function () {
    const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

    const EGG_PNG =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5V1i0AAAAASUVORK5CYII=";
    const EGG_SEQUENCE = [
        "ArrowLeft",
        "ArrowLeft",
        "ArrowUp",
        "ArrowUp",
        "ArrowRight",
        "ArrowRight",
        "ArrowDown",
        "ArrowDown"
    ];
    let keyBuffer = [];

    const featuredContainer = document.getElementById("featured-projects");
    const allContainer = document.getElementById("projects-list");

    if (featuredContainer) {
        renderProjects(featuredContainer, projects.filter((project) => project.featured));
    }

    if (allContainer) {
        renderProjects(allContainer, projects);
    }

    window.addEventListener("keydown", (event) => {
        if (event.repeat) {
            return;
        }
        keyBuffer.push(event.key);
        if (keyBuffer.length > EGG_SEQUENCE.length) {
            keyBuffer = keyBuffer.slice(-EGG_SEQUENCE.length);
        }
        if (keyBuffer.join("|") === EGG_SEQUENCE.join("|")) {
            triggerEasterEgg();
            keyBuffer = [];
        }
    });

    function renderProjects(container, items) {
        container.innerHTML = "";
        items.forEach((project) => {
            const card = document.createElement("li");
            card.className = "project-card";

            if (project.detailsUrl) {
                card.classList.add("is-clickable");
                card.setAttribute("role", "button");
                card.setAttribute("tabindex", "0");
                card.addEventListener("click", (event) => {
                    if (event.target.closest("a")) {
                        return;
                    }
                    window.location.href = project.detailsUrl;
                });
                card.addEventListener("keydown", (event) => {
                    if (event.target.closest("a")) {
                        return;
                    }
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        window.location.href = project.detailsUrl;
                    }
                });
            }

            const image = document.createElement("div");
            image.className = "project-image";
            if (project.imageUrl) {
                const img = document.createElement("img");
                img.src = project.imageUrl;
                img.alt = project.title + " screenshot";
                img.loading = "lazy";
                image.appendChild(img);
            } else {
                image.textContent = project.emoji || "📌";
            }

            const content = document.createElement("div");
            content.className = "project-content";

            const title = document.createElement("h3");
            title.textContent = project.title;

            const description = document.createElement("p");
            description.textContent = project.description;

            const tags = document.createElement("div");
            tags.className = "project-tags";
            (project.tags || []).forEach((tag) => {
                const tagEl = document.createElement("span");
                tagEl.className = "tag";
                tagEl.textContent = tag;
                tags.appendChild(tagEl);
            });

            const links = document.createElement("div");
            links.className = "project-links";

            addLink(links, project.detailsUrl, "More Info →");
            addLink(links, project.websiteUrl, "View Website →");
            addLink(links, project.demoUrl, "Live Demo →");
            addLink(links, project.repoUrl, "View Repo →");

            content.append(title, description, tags, links);
            card.append(image, content);
            container.appendChild(card);
        });
    }

    function addLink(container, href, label) {
        if (!href) {
            return;
        }
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        link.className = "project-link";
        if (href.startsWith("http")) {
            link.target = "_blank";
            link.rel = "noopener";
        }
        container.appendChild(link);
    }

    function triggerEasterEgg() {
        const count = 10;
        for (let i = 0; i < count; i += 1) {
            const egg = document.createElement("div");
            egg.className = "easter-egg";
            egg.style.left = Math.random() * 90 + 5 + "vw";
            egg.style.animationDuration = 3 + Math.random() * 2 + "s";
            egg.style.animationDelay = Math.random() * 0.6 + "s";
            egg.style.backgroundImage = `url("${EGG_PNG}")`;
            document.body.appendChild(egg);
            egg.addEventListener("animationend", () => {
                egg.remove();
            });
        }
    }
})();
