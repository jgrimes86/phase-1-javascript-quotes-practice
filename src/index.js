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
        dangerButton.addEventListener('click', deleteQuote);

        let editButton = document.createElement('button');
        editButton.className = 'btn-success';
        editButton.innerText = 'Edit';
        editButton.style.backgroundColor = 'blue';
        editButton.style.borderColor = 'blue';
        editButton.addEventListener('click', openEditForm);

        let editForm = document.createElement('form');
        editForm.id = 'edit-form';
        editForm.hidden = true;

        let quoteInput = document.createElement('input');
        quoteInput.name = 'quote';
        quoteInput.type = 'text';
        quoteInput.style.class = "form-control";
        quoteInput.defaultValue = quote.quote;

        let authorInput = document.createElement('input');
        authorInput.name = 'author';
        authorInput.type = 'text';
        authorInput.style.class = "form-control";
        authorInput.defaultValue = quote.author;

        let submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.style.class = "btn btn-primary";
        submitButton.innerText = 'Submit';

        editForm.append(quoteInput, authorInput, submitButton);
        editForm.addEventListener('submit', editBookInfo)

        blockquote.append(p, footer, br, successButton, dangerButton, editButton, editForm);
        
        quoteList.append(li)
    })
}

function likeQuote(event) {
    let quoteIdstring = event.target.parentElement.dataset.quoteId;
    let quoteId = parseInt(quoteIdstring, 10);

    // let createdAt = new Date();

    fetch(likesDatabase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            'quoteId': quoteId,
            'createdAt': createdAt,
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

function openEditForm(event) {
    let editForm = event.target.parentElement.querySelector('#edit-form');
    if (editForm.hidden == true) {
        editForm.hidden = false;
    } else if (editForm.hidden == false) {
        editForm.hidden = true
    }
}

function editBookInfo(event) {
    event.preventDefault();
    let targetQuote = event.target.parentElement.querySelector('p');
    let targetAuthor = event.target.parentElement.querySelector('footer');
    let quoteId = parseInt(event.target.parentElement.dataset.quoteId, 10)

    let newQuote = event.target.quote.value;
    let newAuthor = event.target.author.value;
    
    targetQuote.innerText = newQuote;
    targetAuthor.innerText = newAuthor;

    updateDatabaseItem(newQuote, newAuthor, quoteId);
    // event.target.reset()
}

function updateDatabaseItem(newQuote, newAuthor, quoteId) {
    fetch(quotesDatabase+'/'+quoteId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'quote': newQuote,
            'author': newAuthor
        })
    })
}
