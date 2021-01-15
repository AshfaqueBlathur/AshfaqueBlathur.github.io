// Toast
const toastBlock = document.getElementById("toastblock");
function clearBlock(){
    toastBlock.innerHTML = "";
};
function toast(msg, bg, c, t){
    let toastMsg = `<p style="background-color: ${bg}; color: ${c}; animation-duration: ${t}ms;">${msg}</p>`;
    toastBlock.innerHTML = toastMsg;
    setTimeout(clearBlock , t);
};


// Fetch Meme
var fetchTarget;
function loadMeme(){
    fetch(fetchTarget)
    .then(res => {
        if (res.ok){
            res.json().then(res => inputMeme(res))
        };
    })
    .catch(err => {
        console.log(err);
        toast(`Error getting memes..<br>${err}`, "#ff2929", "#fff", 2000);
    })
};

var fire = true;
window.onscroll = function(){
    let windowHight = Math.ceil(window.innerHeight + window.pageYOffset) + 130;
    let bodyHight = Math.ceil(document.body.offsetHeight);
    //console.log(windowHight, bodyHight);
    if (fire && (windowHight >= bodyHight) && (load == "auto")){
        fire = false;
        loadMeme();
    } else if (!fire && (windowHight < bodyHight)){
        fire = true;
    };
};


// Input Memes
const memeUl = document.getElementById('memes-ul');
function inputMeme(resObj){
    let count = resObj.count,
        memes = resObj.memes;
    toast(`Got ${count} memes..`, "#00ff80", "#000", 2000);
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
        if ((nsfw || spoiler) && (nsfw == "blur")){
            var nsfwClass = "blur";
        } else {
            var nsfwClass = "show";
        };
        li.innerHTML = `<div class="meme-img">
                            <img class="${nsfwClass}" src="${preview[quality]}" alt="meme from reddit by ${author}">
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


// Fetch Configuratio
const configMenu = document.querySelector(".meme-config");
const configForm = document.getElementById('config');
const countShower = document.getElementById("now-selected");
const loader = document.getElementById("meme-loader");

function showCount(){
    countShower.innerText = configForm[1].value;
};

var favSub, count, quality, nsfw, load;
function openConfig(){
    configMenu.style.display = 'block';
};
openConfig();

function closeConfig(){
    configMenu.style.display = 'none';
    favSub = configForm[0].value;
    count = configForm[1].value;
    if (configForm[2].checked){
        quality = 0;
    } else if (configForm[3].checked){
        quality = 1;
    } else if (configForm[4].checked){
        quality = 2;
    } else if (configForm[5].checked){
        quality = 3;
    };
    if (configForm[6].checked){
        nsfw = "blur";
    } else {
        nsfw = "show";
    }; 
    if (configForm[7].checked){
        load = "auto";
        loader.style.display = 'none';
    } else {
        load = "manual";
        loader.style.display = 'inline-block';
    }; 
    updateFetchTarget();
};

function updateFetchTarget(){
    if (load == "auto"){
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${favSub}/1`;
        console.log("Gonna fetch " + fetchTarget);

    } else if ((load == "manual") && (favSub != '') && (count > 0)){
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${favSub}/${count}`;
        console.log("Gonna fetch " + fetchTarget);

    } else {
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${count}`;
        console.log("Gonna fetch " + fetchTarget);

    };
    toast(`configuration updated`, "#00ff80", "#000", 2000)
};