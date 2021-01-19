// Toast
var toastBlock = document.getElementById("toastblock");
function toast(msg, bg, c, t){
    let id = (Math.floor((Math.random()*90000000)+10000000)).toString();
    let msgP = document.createElement('p');
    msgP.setAttribute("id", id);
    msgP.setAttribute("style", `border-bottom-color: ${bg}; color: ${c};`);
    msgP.innerText = msg;
    toastBlock.appendChild(msgP);
    clearMsg(id, t);
};
function clearMsg(id, t){
    let msgP = document.getElementById(id);
    setTimeout(function(){
        toastBlock.removeChild(msgP);
    }, t)
};

// golobal vars
var loaded = [],
    favSub = '',
    count = 1,
    quality = 1,
    load = true,
    adult = true,
    fetchTarget;

// update url
function updateFetchTarget(){
    if (favSub != ''){
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${favSub}/${count}`;
    } else {
        fetchTarget = `https://meme-api.herokuapp.com/gimme/${count}`;
    };
    toast("configuration updated!", "#fffb00", "#fff", 1000);
    toast(`will fetch | ${fetchTarget} | & will show with ${quality}x quality!`, "#fffb00", "#fff", 1500);
    toast(`will ${adult ? 'not' : ''}  show you explicit contents!`, "#4e768d", "#fff", 1000);
};
updateFetchTarget();


// Fetch Meme
function loadMeme(){
    toast("started fetching memes..", "#0e0f0a", "#fff", 1000);
    let requestMeme = new XMLHttpRequest;
    requestMeme.onreadystatechange = () => {
        if (requestMeme.readyState == 4){
            let resJson = JSON.parse(requestMeme.response);
            if (requestMeme.status == 200){
                inputMeme(resJson);
            } else {
                toast("Error: " + resJson.code +  " | " + resJson.message, "#f51e1e", "#fff", 3000);
            };
        };
    };
    requestMeme.open("GET", fetchTarget);
    requestMeme.send();
};

// responsive resolution
if ((window.screen.width * window.devicePixelRatio) > 860){
    quality = 2;
    loadMeme();
};

// Input Memes
const memeUl = document.getElementById('memes-ul');
function inputMeme(resObj){
    let count = resObj.count,
        memes = resObj.memes;
    toast(`Got ${count} memes..`, "#00ff80", "#fff", 1000);
    memes.forEach(meme => {
        let postLink = meme.postLink,
            subreddit = meme.subreddit,
            title = meme.title,
            url = meme.url,
            nsfw = meme.nsfw,
            spoiler = meme.spoiler,
            author = meme.author,
            ups = meme.ups,
            preview = meme.preview;
        if (!loaded.includes(url)){
            loaded.push(url);
            let li = document.createElement('li');
            li.innerHTML = `<div class="meme-img">
                                <img ${((nsfw || spoiler) && !adult) ? `class="blur" src="resources/img/warning.png" onclick="showNsfw(this)" url="${preview[quality]}"` : `src="${preview[quality]}"`} alt="meme from reddit by ${author}">
                                <div class="other-qualities">
                                    <p url="${preview[0]}" onclick="changeRes(this);">0x</p>
                                    <p url="${preview[1]}" onclick="changeRes(this);">1x</p>
                                    <p url="${preview[2]}" onclick="changeRes(this);">2x</p>
                                    <p url="${preview[3]}" onclick="changeRes(this);">3x</p>
                                    <p url="${url}" onclick="changeRes(this);">HD</p>
                                </div>
                            </div>
                            <div class="meme-detail">
                                <p class="detail">
                                    <span class="title">${title}</span>
                                    by <span class="author">${author}</span>
                                    from <span class="subreddit">${subreddit}</span>
                                    subreddit with <span class="ups">${ups}</span> votes
                                </p>
                                <p class="sourece">Source: <a href="${postLink}">${postLink}</a></p>
                            </div>`
            memeUl.appendChild(li);
        } else {
            toast(`Meme skipped being already on screen!`, "#ffc400", "#fff", 1000);
        };
    });
};

// resolution changer
function changeRes(el){
    let url = el.getAttribute('url');
    el.parentElement.previousElementSibling.setAttribute('src', url);
    toast(`loading in the selected quality`, "#00ff80", "#fff", 1500);
};


// Fetch Configuratio
const configMenu = document.querySelector(".meme-config");
const configForm = document.getElementById('config');
const countShower = document.getElementById("now-selected");

showCount();
function showCount(){
    countShower.innerText = `selected to load ${configForm.number_of_memes.value} memes per request`;
};

function openConfig(){
    configMenu.style.display = 'block';
};

const rangeExpnter = document.getElementById('change_range');
function changeRange(){
    if (rangeExpnter.previousElementSibling.getAttribute('max') == '5'){
        rangeExpnter.previousElementSibling.setAttribute('max', '50');
        rangeExpnter.innerText = 'revert back to select upto 5 meme';
    } else {
        rangeExpnter.previousElementSibling.setAttribute('max', '5');
        rangeExpnter.innerText = 'force celect upto 50 meme';
    };
};

configForm.addEventListener('submit', function(e){
    e.preventDefault();
    configMenu.style.display = 'none';
    favSub = configForm.subreddit.value;
    count = configForm.number_of_memes.value;
    if (configForm[2].checked){
        quality = 0;
    } else if (configForm[3].checked){
        quality = 1;
    } else if (configForm[4].checked){
        quality = 2;
    } else if (configForm[5].checked){
        quality = 3;
    };
    if (configForm.adult.checked){
        adult = true;
    } else {
        adult = false;
    };
    updateFetchTarget();
});

// to top
function toTop(){
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"});
        toast("window scrolled to top", "#ffc400", "#fff", 1000);
};

// auto loading
function autoLoad(el){
    if (load){
        load = false;
        el.firstElementChild.setAttribute('src', 'resources/img/btn-icos/manual.png');
    } else {
        load = true;
        el.firstElementChild.setAttribute('src', 'resources/img/btn-icos/auto.png');
    };
    toast(`switched to ${load ? "auto" : "manual"} meme loading mode`, "#ffc400", "#fff", 1500);
};

// auto loader
var fire = true;
window.onscroll = function(){
    let windowHight = Math.ceil(window.innerHeight + window.pageYOffset);
    let bodyHight = Math.ceil(document.body.offsetHeight);
    if (fire && load && ((windowHight + 100) >= bodyHight)){
        fire = false;
        loadMeme();
    } else if (!fire && ((windowHight + 100) < bodyHight)){
        fire = true;
    };
};

// show nsfw
function showNsfw(el){
    let url = el.getAttribute("url");
    el.setAttribute("src", url);
    el.setAttribute("onclick", "");
    el.classList.remove("blur");
};

// clearMemes
function clearMemes(){
    if (event.detail === 1){
        toast('tap twice to clear all memes', '#fff', '#fff', 1500);
    } else {
        memeUl.innerHTML = '';
        loaded = [];
        toast("all of them cleared", "#ffc400", "#fff", 1500);
    };
};