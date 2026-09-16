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
    const THUMB_LIMIT = 4;
    let keyBuffer = [];

    const featuredContainer = document.getElementById("featured-projects");
    const allContainer = document.getElementById("projects-list");

    const lightbox = createLightbox();
    const details = createDetailsModal();

    window.openPopup = function (projectId) {
        const project = projects.find((item) => item.id === projectId);
        if (project) {
            details.open(project, getPhotos(project));
        }
    };
    window.closePopup = function () {
        details.dialog.close();
    };

    if (featuredContainer) {
        renderProjects(featuredContainer, projects.filter((project) => project.featured));
    }

    if (allContainer) {
        renderProjects(allContainer, projects);
    }

    window.addEventListener("keydown", (event) => {
        if (event.repeat || document.querySelector("dialog[open]")) {
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

    // Accepts either "photos/x.jpg" or { src, caption } so captions stay optional.
    function toPhoto(entry) {
        if (!entry) {
            return null;
        }
        if (typeof entry === "string") {
            return { src: entry, caption: "" };
        }
        return entry.src ? { src: entry.src, caption: entry.caption || "" } : null;
    }

    function getPhotos(project) {
        return (project.photos || []).map(toPhoto).filter(Boolean);
    }

    function renderProjects(container, items) {
        container.innerHTML = "";
        items.forEach((project) => {
            const photos = getPhotos(project);

            const card = document.createElement("li");
            card.className = "project-card";
            if (project.featured) {
                card.classList.add("is-featured");
            }

            card.classList.add("is-clickable");
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-haspopup", "dialog");
            card.addEventListener("click", (event) => {
                if (event.target.closest("a, button")) {
                    return;
                }
                details.open(project, photos);
            });
            card.addEventListener("keydown", (event) => {
                if (event.target.closest("a, button")) {
                    return;
                }
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    details.open(project, photos);
                }
            });

            const image = document.createElement("div");
            image.className = "project-image";
            const coverSrc =
                project.cover || project.imageUrl || (photos[0] && photos[0].src);
            if (coverSrc) {
                const img = document.createElement("img");
                img.src = coverSrc;
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

            content.append(title, description, tags);

            const thumbs = buildThumbs(project, photos);
            if (thumbs) {
                content.appendChild(thumbs);
            }

            content.appendChild(links);
            card.append(image, content);
            container.appendChild(card);
        });
    }

    function buildThumbs(project, photos) {
        if (!photos.length) {
            return null;
        }

        const strip = document.createElement("div");
        strip.className = "project-photos";

        photos.slice(0, THUMB_LIMIT).forEach((photo, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "photo-thumb";
            button.title = photo.caption || project.title + " photo";
            button.setAttribute(
                "aria-label",
                "Open photo " + (index + 1) + " of " + photos.length + " for " + project.title
            );

            const img = document.createElement("img");
            img.src = photo.src;
            img.alt = photo.caption || project.title + " photo";
            img.loading = "lazy";
            button.appendChild(img);

            button.addEventListener("click", (event) => {
                event.stopPropagation();
                lightbox.open(project, photos, index);
            });
            strip.appendChild(button);
        });

        const extra = photos.length - THUMB_LIMIT;
        if (extra > 0) {
            const more = document.createElement("button");
            more.type = "button";
            more.className = "photo-thumb photo-more";
            more.textContent = "+" + extra;
            more.setAttribute(
                "aria-label",
                "Open remaining " + extra + " photos for " + project.title
            );
            more.addEventListener("click", (event) => {
                event.stopPropagation();
                lightbox.open(project, photos, THUMB_LIMIT);
            });
            strip.appendChild(more);
        }

        return strip;
    }

    // One dialog shared by every card, not one per project.
    function createLightbox() {
        const dialog = document.createElement("dialog");
        dialog.id = "photo-lightbox";
        dialog.className = "centered-dialog";

        const figure = document.createElement("figure");
        figure.className = "lightbox-frame";
        const img = document.createElement("img");
        const caption = document.createElement("figcaption");
        figure.append(img, caption);

        const bar = document.createElement("div");
        bar.className = "lightbox-bar";
        const prev = document.createElement("button");
        prev.type = "button";
        prev.textContent = "← Prev";
        const count = document.createElement("span");
        count.className = "lightbox-count";
        const next = document.createElement("button");
        next.type = "button";
        next.textContent = "Next →";
        const close = document.createElement("button");
        close.type = "button";
        close.textContent = "Close";
        bar.append(prev, count, next, close);

        dialog.append(figure, bar);
        document.body.appendChild(dialog);

        let photos = [];
        let index = 0;

        function paint() {
            const photo = photos[index];
            if (!photo) {
                return;
            }
            img.src = photo.src;
            img.alt = photo.caption || "Project photo";
            caption.textContent = photo.caption || "";
            caption.hidden = !photo.caption;
            count.textContent = index + 1 + " / " + photos.length;
            const single = photos.length < 2;
            prev.hidden = single;
            next.hidden = single;
        }

        function step(delta) {
            if (!photos.length) {
                return;
            }
            index = (index + delta + photos.length) % photos.length;
            paint();
        }

        prev.addEventListener("click", () => step(-1));
        next.addEventListener("click", () => step(1));
        close.addEventListener("click", () => dialog.close());

        // stopPropagation keeps arrow keys from feeding the easter-egg buffer.
        dialog.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.stopPropagation();
                event.preventDefault();
                step(event.key === "ArrowLeft" ? -1 : 1);
            }
        });

        // Click the backdrop (outside the figure and bar) to dismiss.
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        return {
            dialog,
            open(project, list, startIndex) {
                photos = list;
                index = startIndex || 0;
                dialog.setAttribute("aria-label", project.title + " photos");
                paint();
                dialog.showModal();
            }
        };
    }

    // Bigger centered card: one dialog reused for every project.
    function createDetailsModal() {
        const dialog = document.createElement("dialog");
        dialog.id = "popup";
        dialog.className = "project-modal centered-dialog";
        dialog.setAttribute("aria-labelledby", "popup-title");

        const close = document.createElement("button");
        close.type = "button";
        close.className = "modal-close";
        close.setAttribute("aria-label", "Close project details");
        close.textContent = "×";

        const media = document.createElement("div");
        media.className = "modal-media";
        const hero = document.createElement("img");
        const heroCaption = document.createElement("p");
        heroCaption.className = "modal-caption";
        media.append(hero, heroCaption);

        const body = document.createElement("div");
        body.className = "modal-body";

        const title = document.createElement("h2");
        title.id = "popup-title";

        const summary = document.createElement("p");
        summary.className = "modal-summary";

        const detailText = document.createElement("p");
        detailText.className = "modal-details";

        const highlights = document.createElement("ul");
        highlights.className = "modal-highlights";

        const tags = document.createElement("div");
        tags.className = "project-tags";

        const gallery = document.createElement("div");
        gallery.className = "modal-gallery";

        const links = document.createElement("div");
        links.className = "project-links";

        body.append(title, summary, detailText, highlights, tags, gallery, links);
        dialog.append(close, media, body);
        document.body.appendChild(dialog);

        close.addEventListener("click", () => dialog.close());

        // Click the backdrop (outside the panel) to dismiss.
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        function showPhoto(photo, project) {
            hero.src = photo.src;
            hero.alt = photo.caption || project.title + " screenshot";
            heroCaption.textContent = photo.caption || "";
            heroCaption.hidden = !photo.caption;
        }

        return {
            dialog,
            open(project, photos) {
                title.textContent = project.title;
                summary.textContent = project.description || "";
                summary.hidden = !project.description;

                detailText.textContent = project.details || "";
                detailText.hidden = !project.details;

                highlights.innerHTML = "";
                (project.highlights || []).forEach((item) => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    highlights.appendChild(li);
                });
                highlights.hidden = !highlights.children.length;

                tags.innerHTML = "";
                (project.tags || []).forEach((tag) => {
                    const tagEl = document.createElement("span");
                    tagEl.className = "tag";
                    tagEl.textContent = tag;
                    tags.appendChild(tagEl);
                });
                tags.hidden = !tags.children.length;

                const coverSrc =
                    project.cover || project.imageUrl || (photos[0] && photos[0].src);
                if (coverSrc) {
                    showPhoto({ src: coverSrc, caption: "" }, project);
                    media.hidden = false;
                    media.classList.remove("is-emoji");
                    media.dataset.emoji = "";
                } else {
                    hero.removeAttribute("src");
                    heroCaption.hidden = true;
                    media.hidden = false;
                    media.classList.add("is-emoji");
                    media.dataset.emoji = project.emoji || "📌";
                }

                gallery.innerHTML = "";
                if (photos.length > 1) {
                    photos.forEach((photo, index) => {
                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = "photo-thumb";
                        button.setAttribute(
                            "aria-label",
                            "Show photo " + (index + 1) + " of " + photos.length
                        );
                        const img = document.createElement("img");
                        img.src = photo.src;
                        img.alt = photo.caption || project.title + " photo";
                        img.loading = "lazy";
                        button.appendChild(img);
                        button.addEventListener("click", () => showPhoto(photo, project));
                        gallery.appendChild(button);
                    });
                }
                gallery.hidden = !gallery.children.length;

                links.innerHTML = "";
                addLink(links, project.detailsUrl, "More Info →");
                addLink(links, project.websiteUrl, "View Website →");
                addLink(links, project.demoUrl, "Live Demo →");
                addLink(links, project.repoUrl, "View Repo →");
                links.hidden = !links.children.length;

                dialog.showModal();
            }
        };
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
