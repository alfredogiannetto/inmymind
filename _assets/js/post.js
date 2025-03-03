document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
        console.error("Nessun ID post trovato nella URL");
        return;
    }

    fetch("_data/posts.json")
        .then(response => response.json())
        .then(posts => {
            const post = posts.find(p => p.url.includes(postId));

            if (!post) {
                console.error("Post non trovato");
                return;
            }

            // Riformatta la data in "DD ∙ MM ∙ YYYY"
            const dateParts = post.date.split("-");
            const formattedDate = `${dateParts[2]} ∙ ${dateParts[1]} ∙ ${dateParts[0]}`;

            document.getElementById("post-title").textContent = post.title;
            document.getElementById("post-author").textContent = post.category;
            document.getElementById("post-date").textContent = formattedDate;

            // Imposta l'immagine di sfondo nel div .background
            const backgroundDiv = document.querySelector(".background");
            if (backgroundDiv && post.image) {
                backgroundDiv.style.backgroundImage = `url('${post.image}')`;
                backgroundDiv.style.backgroundPosition = post.backgroundPosition || "center center"; // Default se non specificato
            } else {
                console.warn("Elemento .background non trovato o immagine mancante");
            }

            // Usa la data ORIGINALE (senza i puntini) per costruire il percorso del file content.md
            return fetch(`_posts/${post.date.split('-').reverse().join('-')}-${postId}/content.md`);
        })
        .then(response => response.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(markdown);
            document.getElementById("post-content").innerHTML = htmlContent;
        })
        .catch(error => console.error("Errore nel caricamento del post:", error));
});