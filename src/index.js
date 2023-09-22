const quotesDatabaseWithLikes = 'http://localhost:3000/quotes?_embed=likes';
const quotesDatabase = 'http://localhost:3000/quotes';
const likesDatabase = 'http://localhost:3000/likes';

const quoteList = document.getElementById('quote-list');

function quotesFetcher() {
    fetch(quotesDatabaseWithLikes)
    .then(response => response.json())
    .then(pagePopulator)
}
quotesFetcher();

function pagePopulator(quotes) {
    quoteList.innerHTML = '';
    quotes.forEach(quote => {
        let li = document.createElement('li');
        li.className = 'quote-card';

        let blockquote = document.createElement('blockquote');
        blockquote.className = 'blockquote';
        blockquote.dataset.quoteId = quote.id;
        li.append(blockquote);
        
        let p = document.createElement('p');
        p.className = 'mb-0';
        p.textContent = quote.quote;

        let footer = document.createElement('footer');
        footer.className = 'blockquote-footer';
        footer.textContent = quote.author;

        let br = document.createElement('br');

        let successButton = document.createElement('button');
        successButton.className = 'btn-success';
        successButton.innerText = 'Likes: ';
        successButton.addEventListener('click', likeQuote)

        let likes = document.createElement('span')
        likes.innerText = quote.likes.length;

        successButton.append(likes);

        let dangerButton = document.createElement('button');
        dangerButton.className = 'btn-danger';
        dangerButton.innerText = 'Delete'
        dangerButton.addEventListener('click', deleteQuote)

        blockquote.append(p, footer, br, successButton, dangerButton);
        
        quoteList.append(li)
    })
}

function likeQuote(event) {
    let quoteIdstring = event.target.parentElement.dataset.quoteId;
    let quoteId = parseInt(quoteIdstring, 10);

    fetch(likesDatabase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            'quoteId': quoteId,
        }),
    })
    .then(quotesFetcher)
}

function deleteQuote(event) {
    let quoteId = parseInt(event.target.parentElement.dataset.quoteId, 10)

    fetch(quotesDatabase+'/'+quoteId, {
        method: 'DELETE',
    })
    .then(quotesFetcher)
}

const form = document.getElementById('new-quote-form');
form.addEventListener('submit', addQuote);

function addQuote(event) {
    event.preventDefault();

    let quote = event.target.quote.value;
    let author = event.target.author.value;

    fetch(quotesDatabase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            quote: quote,
            author: author,
        })
    })
    .then(quotesFetcher)
}
