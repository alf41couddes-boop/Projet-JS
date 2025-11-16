function $q(...selectors){
    for(const s of selectors){
        try { const el = document.querySelector(s); if(el) return el; } catch(e){}
    }
    return null;
}

const elements = {
    searchInput: $q('#search', 'input[name="search"]'),
    btnSearch: $q('#btn', 'button[data-action="search"]'),
    btnRandom: $q('#btn-random', 'button[data-action="random"]'),
    btnClear: $q('#btn-clear', '#clear-btn', 'button[data-action="clear"]'),
    btnAll: $q('#btn-all'),
    applyFilters: $q('#apply-filters'),
    resetFilters: $q('#reset-filters'),
    typeSelect: $q('#type-select', '#filter-type', 'select[name="type"]'),
    regionSelect: $q('#region-select', '#filter-region', 'select[name="region"]'),
    generationSelect: $q('#filter-generation', '#generation-select', 'select[name="generation"]'),
    resultArea: $q('#result'),
    answerArea: $q('#answer_area', '#answer-area', '.grid'),
    template: $q('#card-template'),
    viewCount: $q('#view-count')
};

function search(){
    try{

        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://pokeapi.co/api/v2/pokemon/" + elements.searchInput.value,false);
        xhr.send();
        const response = JSON.parse(xhr.response);

        elements.answerArea.innerHTML = `
                <div>
                    <h3>${response.name}</h3>

                    <img src="${response.sprites.front_default}" />
                </div>
            `;


        console.log(xhr);
        console.log(response);

        if(!response.ok){
            if (response.status === 404) {
                elements.resultArea.innerHTML = `<p class="subtitle">Aucun Pokémon trouvé pour « ${q} ».</p>`;
                return;
            }
            throw new Error(`HTTP ${res.status}`);
        } 
    }
    catch(e){
        console.log(e);
    }
}

const searchButton = document.querySelector("#btn");
searchButton.addEventListener("click",search);

function afficheTousLesPokemons() {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://pokeapi.co/api/v2/pokemon?limit=100", false); // Limite à 100 Pokémon pour la démonstration
        xhr.send();
        const response = JSON.parse(xhr.response);

        elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage

        response.results.forEach(pokemon => {
            const pokemonName = pokemon.name;
            const pokemonUrl = pokemon.url;

            // Récupérer les détails de chaque Pokémon
            const detailsXhr = new XMLHttpRequest();
            detailsXhr.open("GET", pokemonUrl, false);
            detailsXhr.send();
            const detailsResponse = JSON.parse(detailsXhr.response);

            elements.answerArea.innerHTML += `
                <div>
                    <h3>${pokemonName}</h3>
                    <img src="${detailsResponse.sprites.front_default}" alt="${pokemonName}" />
                </div>
            `;
        });

        console.log(xhr);
        console.log(response);
    } catch (e) {
        console.log(e);
    }
}

document.addEventListener("DOMContentLoaded", afficheTousLesPokemons);



