// Toast
const toastBlock = document.getElementById("toastblock");
function clearBlock(){
    toastBlock.innerHTML = "";
};
function toast(msg, bg){
    let toastMsg = `<p style="background-color: ${bg};">${msg}</p>`;
    toastBlock.innerHTML = toastMsg;
    setTimeout(clearBlock , 3000);
};


// Fetch Meme
var fetchTarget;
updateFetchTarget();
function meme(){
    fetch(fetchTarget)
    .then(res => {
        if (res.ok){
            res.json().then(res => inputMeme(res))
        };
    })
    .catch(err => {
        console.log(err);
        toast(`Error getting memes..<br>${err}`, "#ff2929");
    })
};
//window.onload = meme();
var fire = true;
window.onscroll = function(ev){
    let windowHight = Math.ceil(window.innerHeight + window.pageYOffset);
    let bodyHight = Math.ceil(document.body.offsetHeight);
    if (fire && (windowHight >= bodyHight) && (load == "auto")){
        fire = false;
        meme();
    } else if (!fire && (windowHight < bodyHight)){
        fire = true;
    };
};
// Input Memes
const memeUl = document.getElementById('memes-ul');
function inputMeme(resObj){
    let count = resObj.count,
        memes = resObj.memes;
    toast(`Got ${count} memes..`, "#00ff80");
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
                            <img class="${nsfwClass}" src="${preview[parseInt(localStorage.quality)]}" alt="meme from reddit by ${author}">
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
updateConfigForm();
function updateConfigForm(){
    if (localStorage.load == "auto"){
        loader.style.display = 'none';
    } else {
        loader.style.display = 'inline-block';
    };
    configForm[0].value = localStorage.favSub;
    configForm[1].value = (localStorage.count);
    countShower.innerText = localStorage.count;
    if (((localStorage.favSub || localStorage.count) == ("undefined")) || (localStorage.count == 0)){
        configMenu.style.display = 'block';
    };
};
function memeConfig(){
    configMenu.style.display = 'block';
};
var load;
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
    if (configForm[7].checked){
        load = "auto";
        loader.style.display = 'none';
    } else {
        load = "manual";
        loader.style.display = 'inline-block';
    }; 
    storeLocal(favSub, count, quality, nsfw, load);
    updateFetchTarget();
};
function updateFetchTarget(){
    if (localStorage.load == "auto"){
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${localStorage.favSub}/1`;
    } else if ((localStorage.load == "manual") && (localStorage.favSub != '') && (parseInt(localStorage.count > 0))){
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${localStorage.favSub}/${parseInt(localStorage.count)}`;
    } else {
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${parseInt(localStorage.count)}`;
    };
    console.log("Gonna fetch " + fetchTarget);
};
function storeLocal(favSub, count, quality, nsfw, load){
    localStorage.favSub = favSub;
    localStorage.count = count;
    localStorage.quality = quality;
    localStorage.nsfw = nsfw;
    localStorage.load = load;
};