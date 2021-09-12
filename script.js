const API_PREFIX = "https://www.googleapis.com/books/v1/volumes?q=";
const API_SUFFIX =
  "&maxResults=10&&printType=books&key=AIzaSyA7vn7B2iQne6mG3df5m2So8nMprFisxBc";

const booksCardsContainer = document.querySelector(".books_results");
let searchEl = document.querySelector(".form");

const loadingSpinner = function (parentEL) {
  const markup = `
  <div class="spinner">
  </div>`;
  parentEL.innerHTML = "";
  parentEL.insertAdjacentHTML("afterbegin", markup);
};

const getBooks = async function (API) {
  try {
    //Loading books
    let markup;
    loadingSpinner(booksCardsContainer);

    const res = await fetch(API);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    if (data.items === undefined) {
      markup =
        "<p> Oops... looks like no one here knows about this book 🤷‍♀️🤷‍♂️ Try another one </p>";
    } else {
      const results = data.items;
      const books = results.map(function (book) {
        let bookImg;
        typeof book.volumeInfo.imageLinks === "undefined"
          ? (bookImg = "https://i.imgur.com/sJ3CT4V.gif")
          : (bookImg = book.volumeInfo.imageLinks.thumbnail);
        return {
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors,
          description: book.volumeInfo.description,
          img: bookImg,
        };
      });
      //Rendering books
      markup = `
        <div class="cards_list">
        ${books.map((book) => {
          return `
          <div class="card">
          <div class="img_book_container">
          <div class="book_info">
          <h1>${book.title}</h1>
          <h2>${book.author}</h2>
          <br/>
          </div>
          <div class="book_img">
          <img src=${book.img} alt="book img"/>
          </div>
          </div>
          <div class="book_desc">
          <p>${book.description}</p>
           </div>
          </div>
          `;
        })}
        
        </div>
    `;
    }
    booksCardsContainer.innerHTML = "";
    booksCardsContainer.insertAdjacentHTML("afterbegin", markup);
  } catch (err) {
    console.log(err);
  }
};

searchEl.addEventListener("submit", function (e) {
  e.preventDefault();
  let input = document.getElementById("userInput").value;
  //checks if only spaces
  if (input.replace(/\s/g, "").length) {
    getBooks(prepareAPI(input));
  }
});

//prepare API
const prepareAPI = function (userInput) {
  let input = userInput
    .split(" ")
    .filter((str) => str !== "")
    .join("+")
    .toLowerCase();

  return API_PREFIX + input + API_SUFFIX;
};
