function meme(){
    fetch(fetchTarget)
    .then(res => {
        if (res.ok){
            res.json().then(res => inputMeme(res))
        }
    })
    .catch(err => console.log(err))
};

const memeUl = document.getElementById('memes-ul');
function inputMeme(resObj){
    let count = resObj.count,
        memes = resObj.memes;
    memes.forEach(meme => {
        let postLink = meme.postLink,
            subreddit = meme.subreddit,
            title = meme.title,
            url = meme.url,
            nsfw = meme.nsfw,
            spoiler = meme.spoiler,
            author = meme.author,
            ups = meme.ups,
            preview = meme.preview,
            li = document.createElement('li');
        if ((nsfw || spoiler) && (localStorage.nsfw == "blur")){
            var nsfwClass = "blur";
        } else {
            var nsfwClass = "show";
        };
        li.innerHTML = `<div class="meme-img">
                            <img class="blur" src="${preview[parseInt(localStorage.quality)]}" alt="meme from reddit by ${author}">
                        </div>
                        <div class="meme-detail">
                            <p class="detail">
                                <span class="title">${title}</span>
                                by <span class="author">${author}</span>
                                from <span class="subreddit">${subreddit}</span>
                                subreddit with <span class="ups">${ups}</span> upvotes
                            </p>
                            <p class="sourece">Source: <a href="${postLink}">${postLink}</a> & <a href="${url}">HD meme</a></p>
                        </div>`
        memeUl.appendChild(li);
    });
};

const configMenu = document.querySelector(".meme-config");
const configForm = document.getElementById('config');

function memeConfig(){
    configMenu.style.display = 'block';
};
function closeConfig(){
    configMenu.style.display = 'none';
    var favSub = configForm[0].value;
    var count = configForm[1].value;
    if (configForm[2].checked){
        var quality = 0;
    } else if (configForm[3].checked){
        var quality = 1;
    } else if (configForm[4].checked){
        var quality = 2;
    } else if (configForm[5].checked){
        var quality = 3;
    };
    if (configForm[6].checked){
        var nsfw = "blur";
    } else {
        var nsfw = "show";
    }; 
    storeLocal(favSub, count, quality, nsfw);
};
function storeLocal(favSub, count, quality, nsfw){
    localStorage.favSub = favSub;
    localStorage.count = count;
    localStorage.quality = quality;
    localStorage.nsfw = nsfw;
};

if (localStorage.favSub != ''){
    var fetchTarget = `https://meme-api.herokuapp.com/gimme/${localStorage.favSub}/${parseInt(localStorage.count)}`;
} else {
    var fetchTarget = `https://meme-api.herokuapp.com/gimme/${parseInt(localStorage.count)}`;
};

const countShower = document.getElementById("now-selected");
function showCount(){
    countShower.innerText = configForm[1].value;
};