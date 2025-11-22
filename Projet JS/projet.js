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
        .then(response => {
            
            if (response.status === 404) {
                    elements.resultArea.innerHTML = `<p class="subtitle">Aucun Pokémon trouvé pour « ${q} ».</p>`;
                    return;
                }
            else if (!response.ok) { 
                    throw new Error(`HTTP ${response.status}`);
                }

            return response.json();  //transformer la réponse en JSON exploitable
        })
        .then(data => { //obtenir les données JSON
            console.log(response)   //pti test qui print la promise
                elements.answerArea.innerHTML = `
                    <div>
                            <h3>${data.name} (#${data.id})</h3>

                            <img src="${data.sprites.front_default}"
                            class="pokemon-img"
                            id="${data.id}"
                            poke-types="${data.types.map(t => t.type.name).join(', ')}"
                            
                            region="${data.location_area_encounters}"
                            species-url="${data.species.url}"
                            stats="${data.stats.map(s => s.stat.name + ': ' + s.base_stat).join(', ')}"
                            style="cursor:pointer"
                            />

                        </div>
                `;
                    
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
function filtre(){
if (elements.typeSelect.value!=="Tous les types" || elements.regionSelect.value!=="Toutes les régions" || elements.generationSelect.value!=="Toutes les générations"){   //si un type est sélectionné
        elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage
        const response = fetch("https://pokeapi.co/api/v2/pokemon?limit=100" )
        .then(response => response.json())//transformer la réponse en JSON exploitable
        .then(async data => { //obtenir les données JSON + faut mettre tout dans cette accolade + async pour asynchrone
            console.log(response)      //pti test qui print la promise
            console.log(data)          //pti test qui print les données JSON
            const promises = data.results.map(poke =>       //requete pour chaque poke (pour chopper id img)
                fetch(poke.url).then(res => res.json()));

            const pokemons = await Promise.all(promises);   //ca attend que la promesse du fetch soit rempli pour ensuite continuer
            //pokemons.sort((a, b) => a.id - b.id); //trie par id croissant
            
            pokemons.forEach(poke => { //pour chaque poke

                let i = `<div>
                            <h3>${poke.name} (#${poke.id})</h3>

                            <img src="${poke.sprites.front_default}"
                            class="pokemon-img"
                            id="${poke.id}"
                            poke-types="${poke.types.map(t => t.type.name).join(', ')}"
                            
                            region="${poke.location_area_encounters}"
                            species-url="${poke.species.url}"
                            stats="${poke.stats.map(s => s.stat.name + ': ' + s.base_stat).join(', ')}"
                            style="cursor:pointer"
                            />

                        </div>
                    `;
                        if(elements.typeSelect.value!=="Tous les types" && poke.types.some(t => t.type.name === elements.typeSelect.value)){ elements.answerArea.innerHTML += i;}

                        if(elements.regionSelect.value!=="Toutes les régions"){
                        if(elements.regionSelect.value===1 && poke.id>0 && poke.id<=151){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===2 && poke.id>151 && poke.id<=251){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===3 && poke.id>251 && poke.id<=386){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===4 && poke.id>386 && poke.id<=493){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===5 && poke.id>493 && poke.id<=649){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===6 && poke.id>649 && poke.id<=721){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===7 && poke.id>721 && poke.id<=809){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===8 && poke.id>809 && poke.id<=905){ elements.answerArea.innerHTML += i;}
                        else if(elements.regionSelect.value===9 && poke.id>905 && poke.id<=1025){ elements.answerArea.innerHTML += i;}
                        }

                        if(elements.generationSelect.value!=="Toutes les générations"){
                        if(elements.generationSelect.value==="Gen I" && poke.id>0 && poke.id<=151){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen II" && poke.id>151 && poke.id<=251){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen III" && poke.id>251 && poke.id<=386){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen IV" && poke.id>386 && poke.id<=493){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen V" && poke.id>493 && poke.id<=649){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen VI" && poke.id>649 && poke.id<=721){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen VII" && poke.id>721 && poke.id<=809){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen VIII" && poke.id>809 && poke.id<=905){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Gen IX" && poke.id>905 && poke.id<=1025){ elements.answerArea.innerHTML += i;}
                        else if(elements.generationSelect.value==="Toutes les générations"){ elements.answerArea.innerHTML += i;}    
                        }
                });

        })
    }
}

async function searchUrlEvolutionChain(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // debug

        // Vérifier si evolution_chain existe
        if (data.evolution_chain && data.evolution_chain.url) {
            return data.evolution_chain.url;
        } else {
            throw new Error("Pas de champ evolution_chain.url dans ce JSON");
        }

    }catch (error) {
        console.error("Erreur dans searchUrlEvolutionChain:", error);
        return null;
    }
}

async function searchEvolutions(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.chain) throw new Error("Structure chain absente dans la réponse");

        const chain = data.chain;

        // ---- Fonction interne récursive ----
        function extractEvolutionNames(node, list = []) {
            if (node?.species?.name) {
                list.push(node.species.name);
            }
            if (node?.evolves_to?.length) {
                for (const evo of node.evolves_to) {
                    extractEvolutionNames(evo, list);
                }
            }
            return list;
        }

        // Extraction complète
        const family = extractEvolutionNames(chain);

        return family

    }catch (error) {
        console.error("Erreur dans searchEvolutions:", error);
        return null;
    }
}

async function afficherCaracteristiques(img){

    const speciesUrl = await searchUrlEvolutionChain(img.getAttribute("species-url"));
    const evolutions = await searchEvolutions(speciesUrl);
    const pokeTypes = img.getAttribute("poke-types");
    

    const id = img.getAttribute("id");
    let region = 0;
    let generation = 0;
    if(id>0 && id<=151){
        region = "Kanto";
        generation = "Gen I";
    }
    else if(id>151 && id<=251){
        region = "Johto";
        generation = "Gen II";
    }
    else if(id>251 && id<=386){
        region = "Hoenn";
        generation = "Gen III";
    }
    else if(id>386 && id<=493){
        region = "Sinnoh";
        generation = "Gen IV";
    }
    else if(id>493 && id<=649){
        region = "Unys";
        generation = "Gen V";
    }
    else if(id>649 && id<=721){
        region = "Kalos";
        generation = "Gen VI";
    }
    else if(id>721 && id<=809){
        region = "Alola";
        generation = "Gen VII";
    }
    else if(id>809 && id<=905){
        region = "Galar";
        generation = "Gen VIII";
    }
    else if(id>905 && id<=1025){
        region = "Paldea";
        generation = "Gen IX";
    }


    const stats = img.getAttribute("stats");
    console.log(pokeTypes);
    alert(
        "\n Famille : " + evolutions.join(" → ") +
        "\n Types : " + pokeTypes +
        "\n Génération : " + generation +
        "\n Région : " + region +
        "\n Stats : " + stats

    );
}

const searchButton = document.querySelector("#btn");
searchButton.addEventListener("click",search);
document.addEventListener("DOMContentLoaded", search);

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("pokemon-img")) {
        afficherCaracteristiques(e.target);
    }
});

elements.applyFilters.addEventListener("click", filtre);
elements.resetFilters.addEventListener("click", search);

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