 /* 
    Script principal pour l'application PokeProjet
    ------------------------------------------------
    Fonctionnalités :
    - Rechercher un Pokémon par nom, id ou début de nom (ex : "pika" → "pikachu")
    - Lister les Pokémon par type
    - Lister les Pokémon par région (utilise le premier pokédex lié à la région)
    - Combiner région + type (intersection)
    Priorité des filtres :
        1. Recherche exacte nom/id
        2. Début de nom
        3. Région + type (si les deux sont sélectionnés)
        4. Type seul
        5. Région seule
    Limite : pour les listes (type/région/intersection) on limite le rendu pour éviter trop de requêtes simultanées.
*/

// Racine de l'API PokeAPI
const API_ROOT = 'https://pokeapi.co/api/v2';
// Nombre max de Pokémon à afficher pour éviter de surcharger l'API ou le navigateur
const MAX_RENDER = 1025;

// Récupération des éléments du DOM utiles
const elements = {
    searchInput: document.querySelector('#search'), // champ texte de recherche
    btnSearch: document.querySelector('#btn'), // bouton "Rechercher"
    btnClear: document.querySelector('#btn-clear'), // bouton "Effacer"
    typeSelect: document.querySelector('#type-select'), // select des types
    regionSelect: document.querySelector('#region-select'), // select des régions
    resultArea: document.querySelector('#result'), // zone de messages
    answerArea: document.querySelector('#answer_area'), // zone d'affichage des cartes
    template: document.querySelector('#card-template') // template HTML pour une carte Pokémon
};

// Fonction utilitaire pour faire une requête GET et parser le JSON
async function fetchJSON(url){
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
}

// Affiche un message dans la zone de résultat
function showMessage(msg){
    elements.resultArea.innerHTML = `<p class="subtitle">${msg}</p>`;
}

// Vide la zone d'affichage des cartes
function clearResults(){
    elements.answerArea.innerHTML = '';
}

// Affiche une carte Pokémon à partir de l'objet retourné par l'API
function renderPokemonCard(p){
    const tpl = elements.template.content.cloneNode(true);
    const card = tpl.querySelector('.card');
    tpl.querySelector('.poke-name').textContent = p.name;
    tpl.querySelector('.poke-id').textContent = `#${String(p.id).padStart(3,'0')}`;
    const img = tpl.querySelector('.poke-media img');
    img.src = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '';
    img.alt = p.name;

    // Affiche les types du Pokémon
    const typesWrap = tpl.querySelector('.types');
    typesWrap.innerHTML = '';
    p.types.forEach(t => {
        const span = document.createElement('div');
        span.className = `type type-${t.type.name}`;
        span.textContent = t.type.name;
        typesWrap.appendChild(span);
    });

    // Affiche les stats principales (PV, Atk, Def)
    const statNodes = tpl.querySelectorAll('.stat .num');
    const stats = {hp:0, attack:0, defense:0};
    p.stats.forEach(s => { stats[s.stat.name] = s.base_stat; });
    if(statNodes.length>=3){
        statNodes[0].textContent = stats.hp || 0;
        statNodes[1].textContent = stats.attack || 0;
        statNodes[2].textContent = stats.defense || 0;
    }

    // Affiche la taille et le poids
    tpl.querySelector('.card-footer .subtitle').textContent = `${p.height/10} m • ${p.weight/10} kg`;

    elements.answerArea.appendChild(tpl);
        } 
    }
    catch(e){
        console.log(e);
    }

*/

function search(){
    try{//test
    const searchButton = document.querySelector("#btn");
    const searchInput = document.querySelector("#search");
    console.log(searchInput);
        console.log("Input : "+searchInput.value);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://pokeapi.co/api/v2/" + searchInput.value,false);
        xhr.send();
        const response = JSON.parse(xhr.response);

        const searchParagraph = document.querySelector("#result");
        searchParagraph.innerHTML = response.name + " a pour poids " + response.weight +
         " et pour taille " + response.height +
         "<br><img src='" + response.sprites.front_default + "'/>";

        console.log(xhr);
        console.log(response);
        if(response.response_code!==0){
            throw new Error("Erreur dans le retour de l'API");
        } 
    }
    catch(e){
        console.log(e);
    }
}

const searchButton = document.querySelector("#btn");
console.log(searchButton);
const searchInput = document.querySelector("#search");
console.log(searchInput);
searchButton.addEventListener("click",search);