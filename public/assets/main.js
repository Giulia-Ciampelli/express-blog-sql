// #region variabili globali
let rowElement = document.querySelector('.row');
let postElements = '';
// #endregion variabili globali

// chiamata ajax dalla rotta posts
axios.get('http://localhost:3000/posts')
    .then(response => {
        let posts = response.data.data;

        // ciclo nell'array db
        posts.forEach(post => {
            
            // destrutturazione oggetto
            const {title, content, image, tags} = post;

            // creazione markup
            const markup = `
            <ul>
                <li>
                    <div class="card">
                        <div class="card-title">
                            ${title}
                        </div>
                        <div class="card-img">
                            <img src="/assets/imgs/posts/${image}" alt="">
                            <div class="card-desc">
                                ${content}
                            </div>
                            <div class="card-tags">
                                <p>
                                    Tags: ${tags}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>`;

            // assegnazione markup
            postElements += markup;
        });

        // stampa markup
        rowElement.innerHTML = postElements;
    })
    .catch(err => {
        console.error(err);
    })