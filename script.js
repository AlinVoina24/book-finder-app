// Selectăm elementele pe baza ID-urilor din HTML
const form = document.getElementById("search-form");
const button = document.getElementById("search-button");
const searchInput = document.getElementById("keyword-input");
const resultsSection = document.getElementById("results");
const bookList = resultsSection.querySelector(".book-list");
const emptyMessage = resultsSection.querySelector(".empty-message");

// Funcție pentru afișarea cardurilor de cărți
function displayBooks(books) {
  bookList.innerHTML = "";
  bookList.setAttribute("aria-hidden", "false");

  books.forEach((book) => {
    const title = book.title || "Titlu necunoscut";
    const author = book.author_name?.join(", ") || "Autor necunoscut";
    const coverId = book.cover_i;

    // URL imagine
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "https://via.placeholder.com/150x200?text=No+Cover";

    // Construim un <li> cu structura unui item
    const li = document.createElement("li");
    li.classList.add("book-item");

    li.innerHTML = `
        <strong>${title}</strong><br>
        <em>${author}</em><br>
        <img src="${coverUrl}" 
             alt="Coperta pentru ${title}" 
             style="margin-top: .5rem; width:100px; border-radius:4px;">
    `;

    bookList.appendChild(li);
  });
}

// Funcția principală de căutare
async function searchBooks() {
    const query = searchInput.value.trim();

    // Golim lista de rezultate
    bookList.innerHTML = "";

    console.log("Se cauta cartea.");

    if (query === "") {
        emptyMessage.textContent = "Introduceți un cuvânt cheie pentru a căuta cărți.";
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.textContent = "Se caută...";
    emptyMessage.style.display = "block";

    try {
        // Fetch din Open Library API
        const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        console.log(data);

        // Dacă nu sunt rezultate
        if (!data.docs || data.docs.length === 0) {
        emptyMessage.textContent = "Nu au fost găsite cărți pentru acest cuvânt cheie.";
        return;
        }

        // Ascundem mesajul, afișăm lista
        emptyMessage.style.display = "none";

        // Afișăm primele 20 de rezultate
        displayBooks(data.docs.slice(0, 20));

    } catch (error) {
        console.error("Eroare la API:", error);
        emptyMessage.textContent = "A apărut o eroare la încărcarea datelor.";
    }
    }

// Event listener pentru submit (click pe buton sau Enter)
form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchBooks();
});



