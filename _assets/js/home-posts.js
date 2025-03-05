document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById("posts-container");
    const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  
    fetch("_data/posts.json")
      .then(response => response.json())
      .then(data => {
        const latestPosts = data.slice(-4).reverse(); // Prende gli ultimi 4 post e li inverte (dal più recente)
        renderPosts(latestPosts);
      })
      .catch(error => console.error("Errore nel caricamento dei post:", error));
  
    function renderPosts(posts) {
      postsContainer.innerHTML = ""; // Pulisce il contenitore
  
      if (posts.length === 0) {
        postsContainer.innerHTML = `<div class="no-post">Nun ce stanno poste qua 🦹🏻‍♂️</div>`;
        return;
      }
  
      posts.forEach((post, index) => {
        const dateParts = post.date.split("-");
        if (dateParts.length !== 3) return;
  
        const day = dateParts[2];
        const month = monthNames[parseInt(dateParts[1], 10) - 1];
        const year = dateParts[0];
        const formattedDate = `${day} ${month} ${year}`;
  
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.id = `post-${index}`;
  
        const backgroundImage = post.image ? `style="background-image: url('${post.image}'); background-size: cover; background-position: center;"` : "";
  
        postElement.innerHTML = `
          <div class="image" ${backgroundImage}></div>
          <div class="info">
            <p class="date">${formattedDate}</p>
            <p>∙</p>
            <a class="title" href="${post.url}">${post.title}</a>
          </div>
        `;
  
        postsContainer.appendChild(postElement);
      });
    }
  });
  