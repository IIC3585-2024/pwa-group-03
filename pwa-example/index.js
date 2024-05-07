import { url } from './newsApi.js'
import './news-articles.js'

window.addEventListener('load', () => {
    fetchNews();
    registerSW();
})

const fetchNews = async () => {
    const response = await fetch(url);
    const data = await response.json();

    const main = document.querySelector('main');

    data.articles.forEach( article => {
        const el = document.createElement('news-article'); 
        el.article = article;
        main.appendChild(el);
    })
}

const registerSW = async () => {
    if ('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (error) {
            console.log('Failed to register service worker', error);
        }
    }
}