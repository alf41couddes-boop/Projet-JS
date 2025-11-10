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

// Récupère les détails d'un Pokémon à partir de son nom ou d'une URL
async function getPokemonDetails(nameOrUrl){
    const url = nameOrUrl.startsWith('http') ? nameOrUrl : `${API_ROOT}/pokemon/${encodeURIComponent(nameOrUrl)}`;
    return fetchJSON(url);
}

/*
  Recherche par nom ou id :
  - Si un résultat exact est trouvé, l'affiche.
  - Sinon, tente une recherche par début de nom (ex : "pika" → "pikachu").
  - Affiche jusqu'à 24 correspondances pour éviter trop de requêtes.
*/
async function listByNameOrId(query){
    try{
        showMessage('Recherche en cours...');
        clearResults();
        const p = await getPokemonDetails(query.toLowerCase());
        renderPokemonCard(p);
        showMessage('');
    } catch(e){
        // Si pas trouvé, tente une recherche par début de nom
        try {
            showMessage('Aucun résultat exact, recherche par début de nom...');
            // Récupère la liste complète des Pokémon (limite haute pour la 9G)
            const all = await fetchJSON(`${API_ROOT}/pokemon?limit=1300`);
            const matches = all.results.filter(poke => poke.name.startsWith(query.toLowerCase()));
            if(matches.length === 0){
                clearResults();
                showMessage(`Aucun Pokémon trouvé pour « ${query} »`);
                return;
            }
            // Affiche les correspondances (max 24 pour éviter trop de requêtes)
            const toShow = matches.slice(0, 24);
            showMessage(`Aucun résultat exact. ${toShow.length} résultat(s) commençant par « ${query} » :`);
            const details = await Promise.all(toShow.map(poke => getPokemonDetails(poke.name)));
            details.forEach(renderPokemonCard);
        } catch(e2){
            clearResults();
            showMessage(`Aucun Pokémon trouvé pour « ${query} »`);
            console.error(e2);
        }
    }
}

// Affiche tous les Pokémon d'un type donné (limité à MAX_RENDER)
async function listByType(typeName){
    try{
        showMessage('Chargement des Pokémon pour le type...');
        clearResults();
        const data = await fetchJSON(`${API_ROOT}/type/${encodeURIComponent(typeName)}`);
        // data.pokemon -> array of { pokemon: {name, url} }
        const entries = data.pokemon.slice(0, MAX_RENDER);
        showMessage(`Affichage de ${entries.length} Pokémon de type ${typeName}`);
        // Récupère les détails de chaque Pokémon
        const details = await Promise.all(entries.map(e => getPokemonDetails(e.pokemon.name)));
        details.forEach(renderPokemonCard);
    } catch(e){
        clearResults();
        showMessage('Erreur lors du chargement par type.');
        console.error(e);
    }
}

// Affiche tous les Pokémon d'une région donnée (limité à MAX_RENDER)
async function listByRegion(regionName){
    try{
        showMessage('Chargement des Pokémon pour la région...');
        clearResults();
        // Récupère la région et son pokédex principal
        const region = await fetchJSON(`${API_ROOT}/region/${encodeURIComponent(regionName)}`);
        if(!region.pokedexes || region.pokedexes.length===0){
            showMessage('Aucun pokedex disponible pour cette région.');
            return;
        }
        // Utilise le premier pokedex lié à la région
        const pokedexUrl = region.pokedexes[0].url;
        const pokedex = await fetchJSON(pokedexUrl);
        const entries = pokedex.pokemon_entries.slice(0, MAX_RENDER);
        showMessage(`Affichage de ${entries.length} Pokémon de la région ${regionName}`);
        // Pour chaque entrée, récupère les détails du Pokémon
        const details = [];
        for(const e of entries){
            try{
                const det = await getPokemonDetails(e.pokemon_species.name);
                details.push(det);
            } catch(err){
                // Certains noms de species peuvent ne pas correspondre aux endpoints /pokemon ; on ignore
                console.warn('Ignoré:', e.pokemon_species.name, err.message);
            }
        }
        details.forEach(renderPokemonCard);
    } catch(e){
        clearResults();
        showMessage('Erreur lors du chargement par région.');
        console.error(e);
    }
}

/*
  Affiche les Pokémon qui sont à la fois dans une région ET d'un type donné (intersection)
  - Récupère la liste des Pokémon de la région
  - Récupère la liste des Pokémon du type
  - Affiche ceux qui sont dans les deux listes
*/
async function listByRegionAndType(regionName, typeName) {
    try {
        showMessage('Chargement des Pokémon pour la région et le type...');
        clearResults();
        // Récupère la liste des Pokémon de la région
        const region = await fetchJSON(`${API_ROOT}/region/${encodeURIComponent(regionName)}`);
        if (!region.pokedexes || region.pokedexes.length === 0) {
            showMessage('Aucun pokedex disponible pour cette région.');
            return;
        }
        const pokedexUrl = region.pokedexes[0].url;
        const pokedex = await fetchJSON(pokedexUrl);
        const regionNames = new Set(
            pokedex.pokemon_entries.slice(0, MAX_RENDER).map(e => e.pokemon_species.name)
        );

        // Récupère la liste des Pokémon du type
        const typeData = await fetchJSON(`${API_ROOT}/type/${encodeURIComponent(typeName)}`);
        const typeNames = new Set(
            typeData.pokemon.map(e => e.pokemon.name)
        );

        // Intersection des deux listes
        const intersection = Array.from(regionNames).filter(name => typeNames.has(name));
        if (intersection.length === 0) {
            showMessage(`Aucun Pokémon trouvé pour la région ${regionName} et le type ${typeName}.`);
            return;
        }
        showMessage(`Affichage de ${intersection.length} Pokémon de la région ${regionName} et de type ${typeName}`);
        // Récupère les détails et affiche
        const details = [];
        for (const name of intersection) {
            try {
                const det = await getPokemonDetails(name);
                details.push(det);
            } catch (err) {
                console.warn('Ignoré:', name, err.message);
            }
        }
        details.forEach(renderPokemonCard);
    } catch (e) {
        clearResults();
        showMessage('Erreur lors du chargement combiné région + type.');
        console.error(e);
    }
}

/*
  Fonction appelée lors du clic sur "Rechercher" :
  - Applique la priorité des filtres (voir en haut du fichier)
  - Appelle la fonction adaptée selon les champs renseignés
*/
async function onSearchClick(){
    const q = elements.searchInput.value.trim();
    const type = elements.typeSelect.value;
    const region = elements.regionSelect.value;

    // Priorité : recherche par nom/id > combinaison région+type > type > région
    if(q){
        await listByNameOrId(q);
        return;
    }
    if(type && region){
        await listByRegionAndType(region, type);
        return;
    }
    if(type){
        await listByType(type);
        return;
    }
    if(region){
        await listByRegion(region);
        return;
    }
    showMessage('Aucun filtre sélectionné — saisis un nom/id ou choisis un type/région.');
}

// Récupère le nombre total de Pokémon dans l'API (pour la recherche aléatoire)
async function getTotalPokemonCount(){
    const data = await fetchJSON(`${API_ROOT}/pokemon?limit=1`);
    return data.count || 1000;
}


// Réinitialise tous les filtres et la zone de résultats
function onClear(){
    elements.searchInput.value = '';
    elements.typeSelect.value = '';
    elements.regionSelect.value = '';
    elements.answerArea.innerHTML = '';
    showMessage('Saisis un nom ou un numéro puis clique sur Rechercher.');
}

// Remplit le select des types avec les types disponibles dans l'API
async function populateTypes(){
    try{
        const data = await fetchJSON(`${API_ROOT}/type`);
        // data.results -> liste des types
        data.results.forEach(t => {
            // ignore 'shadow' et 'unknown' si présents
            if(t.name==='shadow' || t.name==='unknown') return;
            const opt = document.createElement('option');
            opt.value = t.name;
            opt.textContent = t.name;
            elements.typeSelect.appendChild(opt);
        });
    } catch(e){ console.error('types:', e); }
}

// Remplit le select des régions avec les régions disponibles dans l'API
async function populateRegions(){
    try{
        const data = await fetchJSON(`${API_ROOT}/region`);
        data.results.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.name;
            opt.textContent = r.name;
            elements.regionSelect.appendChild(opt);
        });
    } catch(e){ console.error('regions:', e); }
}

// Attache les événements aux boutons et au champ de recherche
function attachEvents(){
    elements.btnSearch.addEventListener('click', () => onSearchClick());
    elements.btnRandom.addEventListener('click', () => onRandomClick());
    elements.btnClear.addEventListener('click', onClear);

    // Appuyer sur Entrée dans le champ lance la recherche
    elements.searchInput.addEventListener('keydown', (ev) => {
        if(ev.key === 'Enter') onSearchClick();
    });
}

// Fonction d'initialisation appelée au chargement de la page
async function init(){
    showMessage('Initialisation — chargement des filtres...');
    await Promise.all([populateTypes(), populateRegions()]);
    attachEvents();
    showMessage('Prêt. Saisis un nom ou un numéro puis clique sur Rechercher.');
}

// Démarrage de l'application
init().catch(e => console.error(e));
