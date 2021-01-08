const ctx = canvas.getContext('2d');

let pages = [];
let page = 0;
let pageUnit = 2;
let book;

window.onload = () => {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    
    const req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', './json/fileData.json');
    req.send();
    req.onload = () =>  {
        book = req.response.find( book => book.file == location.search.substr(1) );
        document.title = book.title + " - 漫画研究部";
        title.innerHTML = book.title;
        slider.min = 1;
        slider.max = book.page;
        slider.value = 1;
        nowpage.innerHTML = `1/${book.page}`;

        for(var i = 1; i <= book.page; i++){
            pages[i] = new Image();
            pages[i].src = `./comic/${book.file}/${i.toString().padStart(2, '0')}.jpg`;
            pages[i].onload = updateImage;
        }
    }
}

const menu = () => {
    if(document.getElementsByClassName('hidden').length == 0){
        header.classList.add('hidden');
        footer.classList.add('hidden');
    }else{
        header.classList.remove('hidden');
        footer.classList.remove('hidden');
    }
    updateImage();
}

const prev = () => {
    if(page <= 1){
        menu();
        return -1;
    }
    
    page -= pageUnit;
    slider.value = page;
    header.classList.add('hidden');
    footer.classList.add('hidden');

    nowpage.innerHTML = `${slider.value}/${book.page}`;
    updateImage();
}

const next = () => {
    if(page == book.page){
        menu();
        return -1;
    }

    page += pageUnit;
    slider.value = page;
    header.classList.add('hidden');
    footer.classList.add('hidden');

    nowpage.innerHTML = `${slider.value}/${book.page}`;
    updateImage();
}

window.onresize = () => {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    
    header.classList.add('hidden');
    footer.classList.add('hidden');

    updateImage();
}

const updateImage = () => {
    if(canvas.height/book.height < canvas.width/book.width/2){
        pageUnit = 2;
        page = page - page%2;
    }else{
        pageUnit = 1;
        page = page == 0? 1:page;
    }

    ctx.fillStyle = '#282828';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(pageUnit == 1 || page == book.page){
        drawPage(page,     1);
    }else if(page == 0){
        drawPage(page + 1, 1);
    }else{
        drawPage(page,     0);
        drawPage(page + 1, 2);
    }
}

const drawPage = (pi, x) => {
    const s = Math.min(canvas.width/book.width, canvas.height/book.height);
    ctx.drawImage(pages[pi], (canvas.width - book.width*s*x)/2, (canvas.height - book.height*s)/2, book.width*s, book.height*s);
}

slider.oninput = () => {
    nowpage.innerHTML = `${slider.value}/${book.page}`;
    page = slider.value - slider.value%pageUnit;
    updateImage();
}

const adjustX = () => {
    
}

nav.onmousedown = (event) => {
    let beforeX = 0;
    let beforeY = 0;

    nav.onmousemove = (e) => {
        if(beforeX && beforeY){
            console.log(e.clientX - beforeX, e.clientY - beforeY);
        }
        beforeX = e.clientX;
        beforeY = e.clientY;

    }
    nav.onmouseup = () => { nav.onmousemove = null; }
    nav.onmouseleave = () => { nav.onmousemove = null; }
}

nav.ontouchstart = (event) => {
    let beforeX = 0;
    let beforeY = 0;
    
    nav.ontouchmove = (e) => {
        if(beforeX && beforeY){
            console.log(
                e.changedTouches[0].clientX - beforeX,
                e.changedTouches[0].clientY - beforeY
            );
        }
        beforeX = e.changedTouches[0].clientX;
        beforeY = e.changedTouches[0].clientY;
    }
    
    nav.ontouchend = () => {  }
    event.preventDefault();
}