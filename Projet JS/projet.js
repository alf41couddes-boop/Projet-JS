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
    
    if(elements.searchInput.value!=""){ //si c'est pas vide
        elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage
        const response = fetch("https://pokeapi.co/api/v2/pokemon/" + elements.searchInput.value)
        .then(response => response.json())//transformer la réponse en JSON exploitable
        .then(data => { //obtenir les données JSON
            console.log(response)   //pti test qui print la promise
                elements.answerArea.innerHTML = `
                    <div>
                        <h3>${data.name}</h3>

                        <img src="${data.sprites.front_default}" />
                    </div>
                `;
                if (data.status === 404) {
                    elements.resultArea.innerHTML = `<p class="subtitle">Aucun Pokémon trouvé pour « ${q} ».</p>`;
                    return;
                }
                throw new Error(`HTTP ${data.status}`);
        })
    }

    else if (elements.searchInput.value==""){   //si c vide on affiche tout
        elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage
        const response = fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
        .then(response => response.json())//transformer la réponse en JSON exploitable
        .then(async data => { //obtenir les données JSON + faut mettre tout dans cette accolade + async pour asynchrone
            console.log(response)      //pti test qui print la promise
            console.log(data)          //pti test qui print les données JSON
            const promises = data.results.map(poke =>       //requete pour chaque poke (pour chopper id img)
                fetch(poke.url).then(res => res.json()));

            const pokemons = await Promise.all(promises);   //ca attend que la promesse du fetch soit rempli pour ensuite continuer
            //pokemons.sort((a, b) => a.id - b.id); //trie par id croissant
            
            pokemons.forEach(poke => { //pour chaque poke
                    
                    elements.answerArea.innerHTML += `
                        <div>
                            <h3>${poke.name} (#${poke.id})</h3>

                            <img src="${poke.sprites.front_default}"
                            class="pokemon-img"
                            id="${poke.id}"
                            poke-types="${poke.types.map(t => t.type.name).join(', ')}"
                            generation="${poke.forms[0].url}"
                            region="${poke.location_area_encounters}"
                            species-url="${poke.species.url}"
                            stats="${poke.stats.map(s => s.stat.name + ': ' + s.base_stat).join(', ')}"
                            style="cursor:pointer"
                            />

                        </div>
                    `;
                });

        })
    }
}

function searchNameElement(url) {

    try {
        const response = fetch(url)
        .then(response => response.json())//transformer la réponse en JSON exploitable
        .then(data => {

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        if (data.name) {
            return data.name;
        }

       else throw new Error("No name field in JSON");
        });

    }catch (error) {
        console.error("Erreur dans searchNameElement:", error);
        return null;
    }
}


function afficherCaracteristiques(img){

    const speciesUrl = searchNameElement(img.getAttribute("species-url"));
    const pokeTypes = img.getAttribute("poke-types");
    const generation = searchNameElement(img.getAttribute("generation"));

    const id = img.getAttribute("id");
    let region = 0;
    if(id>0 && id<101){

    }
    else if(id>100 && id<201){

    }


    const stats = img.getAttribute("stats");
    console.log(pokeTypes);
    alert(
        "URL des évolutions : " + speciesUrl +
        "\n Types : " + pokeTypes +
        "\n Génération : " + generation +
        "\n Région : " + region +
        "\n Stats : " + stats

    );
}

const searchButton = document.querySelector("#btn");
searchButton.addEventListener("click",search);
document.addEventListener("DOMContentLoaded", search);

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("pokemon-img")) {
        afficherCaracteristiques(e.target);
    }
});

//ci dessous l'ancien code
/*
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
*/