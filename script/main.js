const books = new Vue({
    el: '#works',
    data: {
        books: []
    },
    mounted(){
        const req = new XMLHttpRequest();
        req.responseType = 'json';
        req.open('GET', './json/fileData.json');
        req.onload = () =>  {this.books = req.response;}
        req.send();
    },
    computed: {
        searchBooks(){
            const keyword = decodeURI(location.search.substr(8));
            return this.books.filter(book =>
                book.title.indexOf(keyword) != -1 ||
                book.year.toString().indexOf(keyword) != -1 ||
                book.contents.find(content =>
                    content.title.indexOf(keyword) != -1 ||
                    content.author.indexOf(keyword) != -1
                ) != undefined
            )
        }
    },
    methods: {
        link(filename){
            return `./viewer.html?${filename}`;
        },
        thumb(filename){
            return `./comic/${filename}/01.jpg`;
        }
    }
})

const book = new Vue({
    el: '#header',
    computed: {
        book(){
            return books.books[0];
        }
    },
    methods: {
        link(filename){
            return `./viewer.html?${filename}`;
        },
        thumb(filename){
            return `./comic/${filename}/01.jpg`;
        }
    }
})

window.onscroll = () => {
    const articles = document.getElementsByTagName('article');
    for(const a of articles){
        a.classList.add("hidden");
    }

    const y = document.documentElement.clientHeight;
    for(const a of articles){
        if(a.getBoundingClientRect().top < y*2/3)
            a.classList.remove("hidden");
    }
}

window.onload = () => {
    const articles = document.getElementsByTagName('article');
    const y = document.documentElement.clientHeight;
    for(const a of articles){
        if(a.getBoundingClientRect().top < y*2/3)
            a.classList.remove("hidden");
    }
}