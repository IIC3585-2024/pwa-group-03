// web components Pog

class NewsArticle extends HTMLElement {

    set article(article) {
        this.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${article.urlToImage}" alt="${article.title}">
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
    }
}

customElements.define('news-article', NewsArticle);