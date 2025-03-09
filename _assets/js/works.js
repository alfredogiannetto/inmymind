document.addEventListener("DOMContentLoaded", function () {
    const worksContainer = document.getElementById("works-container");
    const yearFilter = document.getElementById("yearFilter");
    const topicFilter = document.getElementById("topicFilter");
    
    let allWorks = []; // Array con tutti i lavori
  
    const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  
    // Carica i lavori dal JSON
    fetch("_data/works.json")
        .then(response => response.json())
        .then(data => {
            allWorks = data;
            renderWorks(allWorks);
        })
        .catch(error => console.error("Errore nel caricamento dei lavori:", error));
  
    function renderWorks(works) {
        worksContainer.innerHTML = ""; // Pulisce il contenitore
  
        if (works.length === 0) {
            worksContainer.innerHTML = `<div class="no-work">Nun ce stanno lavori qua 🦹🏻‍♂️</div>`;
            return;
        }
  
        works.forEach((work, index) => {
            const dateParts = work.date.split("-");
            if (dateParts.length !== 3) return;
  
            const day = dateParts[2];
            const month = monthNames[parseInt(dateParts[1], 10) - 1];
            const year = dateParts[0];
            const formattedDate = `${day} ${month} ${year}`;
  
            const workElement = document.createElement("div");
            workElement.classList.add("work");
            workElement.id = `work-${index}`;
  
            const backgroundImage = work.image ? `style="background-image: url('${work.image}'); background-size: cover; background-position: center;"` : "";
  
            workElement.innerHTML = `
                <a class="image-container" href="${work.url}">
                    <div class="image" ${backgroundImage}>
                        <div class="info">
                            <p class="date">${formattedDate}</p>
                            <p class="title">${work.title}</p>
                        </div>
                    </div>
                </a>
            `;
  
            worksContainer.appendChild(workElement);
        });
    }
  
    function filterWorks() {
        const selectedYear = yearFilter.value;
        const selectedCategory = topicFilter.value.toLowerCase().trim(); // Evita errori con `null`
  
        const filteredWorks = allWorks.filter(work => {
            const workYear = work.date.split("-")[0];
            const matchesYear = selectedYear === "" || workYear === selectedYear;
            const matchesCategory = selectedCategory === "" || work.category.toLowerCase() === selectedCategory;
            return matchesYear && matchesCategory;
        });
  
        renderWorks(filteredWorks);
    }
  
    yearFilter.addEventListener("change", filterWorks);
    topicFilter.addEventListener("change", filterWorks);
  });