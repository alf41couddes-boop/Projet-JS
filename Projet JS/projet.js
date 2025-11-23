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
    viewCount: $q('#view-count'),
    btnMode: $q('#btn-mode')
};





function search(){
    if(searchMode==1){  //mode pokemon  
        if(elements.searchInput.value!=""){ //si c'est pas vide
            elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage
            let j = 0;
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
                j += 1;
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
            elements.resultArea.innerHTML = `<p class="subtitle"> ${j} Pokémon(s) trouvé(s) </p>`;

        
        }
        else if (elements.searchInput.value==""){   //si c vide on affiche tout
            elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage
            let j = 0;
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
                        j += 1;
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
                    elements.resultArea.innerHTML = `<p class="subtitle"> ${j} Pokémon(s) trouvé(s) </p>`;

            })
        }
    }else //mode item
        if(elements.searchInput.value!=""){ //si c'est pas vide
            elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage
            const response = fetch("https://pokeapi.co/api/v2/item/" + elements.searchInput.value)
            .then(response => {
                
                if (response.status === 404) {
                        elements.resultArea.innerHTML = `<p class="subtitle">Aucun item trouvé pour « ${q} ».</p>`;
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
                                <h3>${data.category.name} (#${data.id})</h3>

                                <img src="${data.sprites.default}"
                                class="pokemon-img"
                                id="${data.id}"
                                name="${data.category.name}"
                                short_description="${data.effect_entries[0].short_effect}"
                                description="${data.effect_entries[0].effect}"
                                style="cursor:pointer"
                                />

                            </div>
                    `;
                        
            })
        
        }
        else if (elements.searchInput.value==""){   //si c vide on affiche tout
            elements.answerArea.innerHTML = ''; // Réinitialiser l'affichage
            const response = fetch("https://pokeapi.co/api/v2/item?limit=100")
            .then(response => response.json())//transformer la réponse en JSON exploitable
            .then(async data => { //obtenir les données JSON + faut mettre tout dans cette accolade + async pour asynchrone
                console.log(response)      //pti test qui print la promise
                console.log(data)          //pti test qui print les données JSON
                const promises = data.results.map(item =>       //requete pour chaque item (pour chopper id img)
                    fetch(item.url).then(res => res.json()));

                const items = await Promise.all(promises);   //ca attend que la promesse du fetch soit rempli pour ensuite continuer
                //pokemons.sort((a, b) => a.id - b.id); //trie par id croissant
                
                items.forEach(data => { //pour chaque item
                        
                        elements.answerArea.innerHTML += `
                            <div>
                                <h3>${data.name} (#${data.id})</h3>

                                <img src="${data.sprites.default}"
                                class="pokemon-img"
                                id="${data.id}"
                                name="${data.category.name}"
                                short_description="${data.effect_entries[0].short_effect}"
                                description="${data.effect_entries[0].effect}"
                                style="cursor:pointer"
                                />

                            </div>
                        `;
                    });

            })
        }
}
function filtre() {
    const typeFilter = elements.typeSelect.value;   // ex: "fire" ou ""
    const regionFilter = elements.regionSelect.value; // ex: "3" ou ""
    const genFilter = elements.generationSelect.value; // ex: "3" ou ""
    let j = 0;

    elements.answerArea.innerHTML = '';

    fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
        .then(res => res.json())
        .then(async data => {

            const pokemons = await Promise.all(
                data.results.map(p => fetch(p.url).then(r => r.json()))
            );

            pokemons.forEach(poke => {
                const id = poke.id;

                // ----- TYPE -----
                const matchType =
                    typeFilter === "" ||
                    poke.types.some(t => t.type.name === typeFilter);

                // ----- REGION -----
                const matchRegion =
                    regionFilter === "" ||
                    (
                        (regionFilter === "1" && id <= 151) ||
                        (regionFilter === "2" && id > 151 && id <= 251) ||
                        (regionFilter === "3" && id > 251 && id <= 386) ||
                        (regionFilter === "4" && id > 386 && id <= 493) ||
                        (regionFilter === "5" && id > 493 && id <= 649) ||
                        (regionFilter === "6" && id > 649 && id <= 721) ||
                        (regionFilter === "7" && id > 721 && id <= 809) ||
                        (regionFilter === "8" && id > 809 && id <= 905) ||
                        (regionFilter === "9" && id > 905 && id <= 1025)
                    );

                // ----- GENERATION -----
                const matchGen =
                    genFilter === "" ||
                    (
                        (genFilter === "1" && id <= 151) ||
                        (genFilter === "2" && id > 151 && id <= 251) ||
                        (genFilter === "3" && id > 251 && id <= 386) ||
                        (genFilter === "4" && id > 386 && id <= 493) ||
                        (genFilter === "5" && id > 493 && id <= 649) ||
                        (genFilter === "6" && id > 649 && id <= 721) ||
                        (genFilter === "7" && id > 721 && id <= 809) ||
                        (genFilter === "8" && id > 809 && id <= 905) ||
                        (genFilter === "9" && id > 905 && id <= 1025)
                    );

                // ----- COMBINAISON DES 3 -----
                if (matchType && matchRegion && matchGen) {
                    j += 1;
                    elements.resultArea.innerHTML = `<p class="subtitle"> ${j} Pokémon(s) trouvé(s) </p>`;
                    elements.answerArea.innerHTML += `
                        <div>
                            <h3>${poke.name} (#${poke.id})</h3>
                            <img
                                src="${poke.sprites.front_default}"
                                class="pokemon-img"
                                id="${poke.id}"
                                poke-types="${poke.types.map(t => t.type.name).join(', ')}"
                                species-url="${poke.species.url}"
                                stats="${poke.stats.map(s => s.stat.name + ': ' + s.base_stat).join(', ')}"
                                style="cursor:pointer"
                            />
                        </div>
                    `;
                }
                
            });

            if (j==0){
                    elements.resultArea.innerHTML = `<p class="subtitle"> Aucun Pokémon trouvé ;( </p>`;
                }
        });
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
    if (searchMode==1){ //mode pokemon

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
}else{ //mode item
    alert(
        "\n Catégorie : " + img.getAttribute("name") +
        "\n Effet court : " + img.getAttribute("short_description") +
        "\n Description : " + img.getAttribute("description")
    );
}
}



let searchMode = 1; //1 = pokemon, 2 =item
elements.btnMode.addEventListener("click", () => {  
    if(searchMode==1){
        searchMode = 2;
        elements.btnMode.textContent= 'OBJETS';
        search();
    }else{
        searchMode = 1;
        elements.btnMode.textContent= 'POKEMON';
        search();
    }
});

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

