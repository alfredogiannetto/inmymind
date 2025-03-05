document.addEventListener("DOMContentLoaded", function () {
  const postsContainer = document.getElementById("posts-container");
  const yearFilter = document.getElementById("yearFilter");
  const topicFilter = document.getElementById("topicFilter");
  
  let allPosts = []; // Array con tutti i post

  const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

  // Carica i post dal JSON
  fetch("_data/works.json")
      .then(response => response.json())
      .then(data => {
          allPosts = data;
          renderPosts(allPosts);
      })
      .catch(error => console.error("Errore nel caricamento dei post:", error));

  function renderPosts(posts) {
      postsContainer.innerHTML = ""; // Pulisce il contenitore

      if (posts.length === 0) {
          postsContainer.innerHTML = `<div class="no-post">nun ce stanno poste qua  🦹🏻‍♂️</div>`;
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
              <div class="image" ${backgroundImage}>
                  <div class="info">
                  <p class="date">${formattedDate}</p>
                  <a class="title" href="${post.url}">${post.title}</a>
              </div></div>
          
          `;

          postsContainer.appendChild(postElement);
      });
  }

  function filterPosts() {
      const selectedYear = yearFilter.value;
      const selectedCategory = topicFilter.value;

      const filteredPosts = allPosts.filter(post => {
          const postYear = post.date.split("-")[0];
          const matchesYear = selectedYear === "anno" || selectedYear === "" || postYear === selectedYear;
          const matchesCategory = selectedCategory === "" || post.category.toLowerCase() === selectedCategory.toLowerCase();
          return matchesYear && matchesCategory;
      });

      renderPosts(filteredPosts);
  }

  yearFilter.addEventListener("change", filterPosts);
  topicFilter.addEventListener("change", filterPosts);
});
