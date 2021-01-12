function meme(){
    fetch("https://meme-api.herokuapp.com/gimme")
    .then(res => {
        if (res.ok){
            res.json().then(res => inputMeme(res))
        }
    })
    .catch(err => console.log(err))
};

const memeUl = document.getElementById('memes-ul');
function inputMeme(memeObj){
    let postLink = memeObj.postLink;
    let subreddit = memeObj.subreddit;
    let title = memeObj.title;
    let url = memeObj.url;
    let nsfw = memeObj.nsfw;
    let spoiler = memeObj.spoiler;
    let author = memeObj.author;
    let ups = memeObj.ups;
    let preview = memeObj.preview;
    let li = document.createElement('li');
    li.innerHTML = `<div class="meme-img">
                        <img src="${url}" alt="meme from reddit by ${author}">
                    </div>
                    <div class="meme-detail">
                        <p class="detail">
                            <span class="title">"${title}"</span>
                            by <span class="author">${author}</span>
                            from <span class="subreddit">${subreddit}</span>
                            subreddit with <span class="ups">${ups}</span> upvotes
                        </p>
                        <p class="sourece">Source: <a href="${postLink}">${postLink}</a></p>
                    </div>`
    memeUl.appendChild(li);
}