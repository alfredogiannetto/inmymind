document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
        console.error("Nessun ID post trovato nella URL");
        return;
    }

    fetch("_data/works.json")
        .then(response => response.json())
        .then(posts => {
            const post = posts.find(p => p.url.includes(postId));

            if (!post) {
                console.error("Post non trovato");
                return;
            }

            // Formattazione della data in "DD Mon YYYY"
            const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
            const dateParts = post.date.split("-");
            const day = dateParts[2];
            const month = monthNames[parseInt(dateParts[1], 10) - 1];
            const year = dateParts[0];
            const formattedDate = `${day} ${month} ${year}`;

            document.getElementById("post-title").textContent = post.title;
            document.getElementById("post-author").textContent = post.category;
            document.getElementById("post-date").textContent = formattedDate;

            // Imposta l'immagine di sfondo nel div .background
            const backgroundDiv = document.querySelector(".background");
            if (backgroundDiv && post.image) {
                backgroundDiv.style.backgroundImage = `url('${post.image}')`;
                backgroundDiv.style.backgroundPosition = post.backgroundPosition || "center center";
            } else {
                console.warn("Elemento .background non trovato o immagine mancante");
            }

            // Usa la data ORIGINALE (senza i puntini) per costruire il percorso del file content.md
            return fetch(`_works/${post.date.split('-').reverse().join('-')}-${postId}/content.md`);
        })
        .then(response => response.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(markdown);
            document.getElementById("post-content").innerHTML = htmlContent;
        })
        .catch(error => console.error("Errore nel caricamento del post:", error));
});
