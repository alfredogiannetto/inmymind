document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById("posts-container");
    const yearFilter = document.getElementById("yearFilter");
    const topicFilter = document.getElementById("topicFilter");

    let allPosts = [];

    // Carica i dati dal JSON
    fetch("_data/posts.json")
        .then(response => response.json())
        .then(data => {
            allPosts = data;
            renderPosts(allPosts);
        })
        .catch(error => console.error("Errore nel caricamento dei post:", error));

    // Funzione per mostrare i post filtrati
    function renderPosts(posts) {
        postsContainer.innerHTML = ""; // Pulisce la lista

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>Nessun post trovato.</p>";
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <div class="image" style="background-image: url('${post.image}');"></div>
                <div class="info">
                    <span class="date">${post.date}</span>
                    <a class="title" href="${post.url}">${post.title}</a>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Funzione per filtrare i post
    function filterPosts() {
        const selectedYear = yearFilter.value;
        const selectedCategory = topicFilter.value;

        console.log("Anno selezionato:", selectedYear);
        console.log("Categoria selezionata:", selectedCategory);

        const filteredPosts = allPosts.filter(post => {
            const postYear = post.date.split("-")[0]; // Prende l'anno dalla data
            const matchesYear = selectedYear === "anno" || selectedYear === "" || postYear === selectedYear;
            const matchesCategory = selectedCategory === "" || post.category.toLowerCase() === selectedCategory.toLowerCase();

            return matchesYear && matchesCategory;
        });

        console.log("Post filtrati:", filteredPosts);
        renderPosts(filteredPosts);
    }

    // Event listeners per il filtraggio
    yearFilter.addEventListener("change", filterPosts);
    topicFilter.addEventListener("change", filterPosts);
});