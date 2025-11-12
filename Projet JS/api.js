/*
  Modification : ne plus afficher tous les Pokémon par défaut.
  - init() charge seulement les filtres et attache les événements.
  - btnAll conserve la possibilité d'afficher tous quand demandé.
*/
const API_ROOT = 'https://pokeapi.co/api/v2';
const MAX_RENDER = 1025;
const CHUNK_SIZE = 40;

function $q(...selectors){
    for(const s of selectors){
        try { const el = document.querySelector(s); if(el) return el; } catch(e){}
    }
    return null;
}

const elements = {
    searchInput: $q('#search', 'input[name="search"]'),
    btnSearch: $q('#btn', 'button[data-action="search"]'),
    btnClear: $q('#btn-clear', '#clear-btn', 'button[data-action="clear"]'),
    btnAll: $q('#btn-all'),
    applyFilters: $q('#apply-filters'),
    resetFilters: $q('#reset-filters'),
    typeSelect: $q('#type-select', '#filter-type', 'select[name="type"]'),
    regionSelect: $q('#region-select', '#filter-region', 'select[name="region"]'),
    resultArea: $q('#result'),
    answerArea: $q('#answer_area', '#answer-area', '.grid'),
    template: $q('#card-template'),
    viewCount: $q('#view-count')
};

// Remplace fetch par XMLHttpRequest SYNCHRONE (conforme à la demande).
// Attention : les requêtes synchrones bloquent l'UI pendant leur exécution.
function fetchJSON(url){
    if(!url) throw new Error('fetchJSON: url manquante');
    try{
        const xhr = new XMLHttpRequest();
        // false -> requête SYNCHRONE (bloquante)
        xhr.open('GET', url, false);
        // Essayer de forcer le type de réponse sur 'json' si supporté
        try { xhr.responseType = 'json'; } catch(e) {}
        xhr.send();

        if(xhr.status >= 200 && xhr.status < 300){
            const raw = (xhr.responseType === 'json' && xhr.response) ? xhr.response : xhr.responseText;
            return (typeof raw === 'string') ? JSON.parse(raw || '{}') : raw;
        }
        throw new Error('HTTP ' + xhr.status + ' for ' + url);
    } catch(e){
        // Remonter l'erreur pour que le code appelant la gère
        throw e;
    }
}

function showMessage(msg){
    if(elements.resultArea) elements.resultArea.innerHTML = msg ? `<p class="subtitle">${msg}</p>` : '';
}

function clearResults(){
    if(elements.answerArea) elements.answerArea.innerHTML = '';
    if(elements.viewCount) elements.viewCount.textContent = '0 Pokémon affichés';
}

function updateCount(n){
    if(elements.viewCount) elements.viewCount.textContent = `${n} Pokémon affichés`;
}

function renderPokemonCard(p){
    if(!elements.template || !elements.answerArea) return;
    const frag = elements.template.content.cloneNode(true);

    const nameNode = frag.querySelector('.poke-name');
    if(nameNode) nameNode.textContent = p.name;

    const idNode = frag.querySelector('.poke-id');
    if(idNode) idNode.textContent = `#${String(p.id).padStart(3,'0')}`;

    const img = frag.querySelector('.poke-media img');
    if(img){
        img.src = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '';
        img.alt = p.name || '';
    }

    const typesWrap = frag.querySelector('.types');
    if(typesWrap){
        typesWrap.innerHTML = '';
        (p.types || []).forEach(t => {
            const span = document.createElement('div');
            span.className = `type type-${t.type.name}`;
            span.textContent = t.type.name;
            typesWrap.appendChild(span);
        });
    }

    const statNodes = frag.querySelectorAll('.stat .num');
    const stats = {hp:0, attack:0, defense:0};
    (p.stats || []).forEach(s => { stats[s.stat.name] = s.base_stat; });
    if(statNodes.length >= 3){
        statNodes[0].textContent = stats.hp || 0;
        statNodes[1].textContent = stats.attack || 0;
        statNodes[2].textContent = stats.defense || 0;
    }

    const footerSubtitle = frag.querySelector('.card-footer .subtitle') || (() => {
        const el = document.createElement('div');
        el.className = 'subtitle';
        const footer = frag.querySelector('.card-footer');
        if(footer) footer.appendChild(el);
        return el;
    })();
    if(footerSubtitle){
        footerSubtitle.textContent = `${(p.height || 0)/10} m • ${(p.weight || 0)/10} kg`;
    }

    elements.answerArea.appendChild(frag);
}

async function getPokemonDetails(nameOrUrl){
    if(!nameOrUrl) throw new Error('getPokemonDetails: nom/url manquant');
    const url = (typeof nameOrUrl === 'string' && nameOrUrl.startsWith('http')) ? nameOrUrl : `${API_ROOT}/pokemon/${encodeURIComponent(nameOrUrl)}`;
    return fetchJSON(url);
}

/**
 * Récupère et affiche tous les Pokémon (chunked).
 * Trie d'abord la liste renvoyée par /pokemon?limit=... selon l'id extrait de l'URL,
 * puis récupère les détails chunk par chunk pour afficher dans l'ordre d'id.
 */
async function fetchAllAndRender(limit = MAX_RENDER){
    try{
        showMessage(`Chargement de la liste (${limit})...`);
        clearResults();

        const listData = await fetchJSON(`${API_ROOT}/pokemon?limit=${limit}`);
        const all = listData.results || [];

        // extraire l'id depuis l'URL et trier
        const withId = all.map(r => {
            const m = r.url.match(/\/pokemon\/(\d+)\/?$/);
            const id = m ? Number(m[1]) : Infinity;
            return { name: r.name, url: r.url, id };
        }).sort((a,b) => a.id - b.id);

        showMessage(`Chargement des détails (${withId.length}) — cela peut prendre quelques secondes...`);

        let rendered = 0;
        for(let i = 0; i < withId.length; i += CHUNK_SIZE){
            const chunk = withId.slice(i, i + CHUNK_SIZE);
            // récupérer par name (ou id) ; on utilise name disponible dans chunk
            const details = await Promise.all(chunk.map(r => getPokemonDetails(r.name).catch(() => null)));
            details.filter(Boolean).forEach(d => { renderPokemonCard(d); rendered++; });
            updateCount(rendered);
        }

        showMessage(`Affichage de ${withId.length} Pokémon (triés par ID).`);
    } catch(e){
        console.error('fetchAllAndRender:', e);
        showMessage('Erreur lors du chargement initial.');
    }
}

// Fonction unifiée pour recherche (texte/type/region)
async function performSearch(query, type, region){
    return await (async () => {
        // réutilise la logique centralisée déjà définie plus haut
        // renvoie simplement après exécution
        if(typeof query === 'string' && query.trim() !== ''){
            await performTextSearch(query);
            return;
        }
        // pas de texte -> type/region
        await (async () => {
            if(type && region){
                // combinaison
                try{
                    showMessage('Chargement des Pokémon pour la région et le type...');
                    clearResults();
                    const regionData = await fetchJSON(`${API_ROOT}/region/${encodeURIComponent(region)}`);
                    if(!regionData.pokedexes || regionData.pokedexes.length===0){ showMessage('Aucun pokedex disponible pour cette région.'); return; }
                    const pokedex = await fetchJSON(regionData.pokedexes[0].url);
                    const regionNames = new Set((pokedex.pokemon_entries || []).map(e => e.pokemon_species.name));
                    const typeData = await fetchJSON(`${API_ROOT}/type/${encodeURIComponent(type)}`);
                    const typeNames = new Set((typeData.pokemon || []).map(e => e.pokemon.name));
                    const intersection = Array.from(regionNames).filter(n => typeNames.has(n));
                    if(intersection.length === 0){ showMessage(`Aucun Pokémon trouvé pour la région ${region} et le type ${type}.`); return; }
                    showMessage(`Affichage de ${intersection.length} Pokémon de la région ${region} et de type ${type}`);
                    let rendered = 0;
                    for(let i=0;i<intersection.length;i+=CHUNK_SIZE){
                        const chunk = intersection.slice(i, i+CHUNK_SIZE);
                        const details = await Promise.all(chunk.map(n => getPokemonDetails(n).catch(() => null)));
                        details.filter(Boolean).forEach(d => { renderPokemonCard(d); rendered++; });
                        updateCount(rendered);
                    }
                } catch(e){ clearResults(); showMessage('Erreur lors du chargement combiné région + type.'); console.error(e); }
                return;
            }
            if(type){
                try{
                    showMessage('Chargement des Pokémon pour le type...');
                    clearResults();
                    const data = await fetchJSON(`${API_ROOT}/type/${encodeURIComponent(type)}`);
                    const entries = (data.pokemon || []).map(p => p.pokemon).slice(0, MAX_RENDER);
                    showMessage(`Affichage de ${entries.length} Pokémon de type ${type}`);
                    let rendered = 0;
                    for(let i=0;i<entries.length;i+=CHUNK_SIZE){
                        const chunk = entries.slice(i, i+CHUNK_SIZE);
                        const details = await Promise.all(chunk.map(e => getPokemonDetails(e.name).catch(() => null)));
                        details.filter(Boolean).forEach(d => { renderPokemonCard(d); rendered++; });
                        updateCount(rendered);
                    }
                } catch(e){ clearResults(); showMessage('Erreur lors du chargement par type.'); console.error(e); }
                return;
            }
            if(region){
                try{
                    showMessage('Chargement des Pokémon pour la région...');
                    clearResults();
                    const regionData = await fetchJSON(`${API_ROOT}/region/${encodeURIComponent(region)}`);
                    if(!regionData.pokedexes || regionData.pokedexes.length===0){ showMessage('Aucun pokedex disponible pour cette région.'); return; }
                    const pokedex = await fetchJSON(regionData.pokedexes[0].url);
                    const entries = (pokedex.pokemon_entries || []).map(e => e.pokemon_species).slice(0, MAX_RENDER);
                    showMessage(`Affichage de ${entries.length} Pokémon de la région ${region}`);
                    let rendered = 0;
                    for(let i=0;i<entries.length;i+=CHUNK_SIZE){
                        const chunk = entries.slice(i, i+CHUNK_SIZE);
                        const details = await Promise.all(chunk.map(e => getPokemonDetails(e.name).catch(() => null)));
                        details.filter(Boolean).forEach(d => { renderPokemonCard(d); rendered++; });
                        updateCount(rendered);
                    }
                } catch(e){ clearResults(); showMessage('Erreur lors du chargement par région.'); console.error(e); }
                return;
            }
            // aucun filtre -> afficher tout
            await fetchAllAndRender();
        })();
    })();
}

// helper: recherche textuelle (exacte puis préfixe)
async function performTextSearch(q){
    const query = (q || '').trim();
    if(!query) return;
    try{
        showMessage('Recherche en cours...');
        clearResults();
        const p = await getPokemonDetails(query.toLowerCase());
        renderPokemonCard(p);
        updateCount(1);
        showMessage('');
        return;
    } catch(e){
        try{
            showMessage('Aucun résultat exact, recherche par début de nom...');
            const all = await fetchJSON(`${API_ROOT}/pokemon?limit=${MAX_RENDER}`);
            const matches = (all.results || []).filter(poke => poke.name.startsWith(query.toLowerCase()));
            if(matches.length === 0){ clearResults(); showMessage(`Aucun Pokémon trouvé pour « ${query} »`); return; }
            const toShow = matches.slice(0, 200);
            showMessage(`${toShow.length} résultat(s) commençant par « ${query} » :`);
            let details = [];
            for(let i=0;i<toShow.length;i+=CHUNK_SIZE){
                const chunk = toShow.slice(i, i+CHUNK_SIZE);
                const chunkDetails = await Promise.all(chunk.map(p => getPokemonDetails(p.name).catch(() => null)));
                details = details.concat(chunkDetails.filter(Boolean));
                details.forEach(renderPokemonCard);
                updateCount(details.length);
            }
            return;
        } catch(e2){ clearResults(); showMessage(`Aucun Pokémon trouvé pour « ${query} »`); console.error(e2); return; }
    }
}

// remplace l'ancien onSearchClick pour utiliser performSearch
async function onSearchClick(){
    const q = (elements.searchInput && elements.searchInput.value || '').trim();
    const type = elements.typeSelect && elements.typeSelect.value;
    const region = elements.regionSelect && elements.regionSelect.value;
    await performSearch(q, type, region);
}

// Note: la fonctionnalité 'Aléatoire' a été supprimée — getTotalPokemonCount supprimée.

function onClear(){
    if(elements.searchInput) elements.searchInput.value = '';
    if(elements.typeSelect) elements.typeSelect.value = '';
    if(elements.regionSelect) elements.regionSelect.value = '';
    clearResults();
    fetchAllAndRender();
    showMessage('Filtres réinitialisés. Chargement de tous les Pokémon…');
}

async function populateTypes(){
    if(!elements.typeSelect) return;
    try{
        const data = await fetchJSON(`${API_ROOT}/type`);
        (data.results || []).forEach(t => {
            if(t.name==='shadow' || t.name==='unknown') return;
            const opt = document.createElement('option');
            opt.value = t.name;
            opt.textContent = t.name;
            elements.typeSelect.appendChild(opt);
        });
    } catch(e){ console.error('types:', e); }
}

async function populateRegions(){
    if(!elements.regionSelect) return;
    try{
        const data = await fetchJSON(`${API_ROOT}/region`);
        (data.results || []).forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.name;
            opt.textContent = r.name;
            elements.regionSelect.appendChild(opt);
        });
    } catch(e){ console.error('regions:', e); }
}

function attachEvents(){
    if(elements.btnSearch) elements.btnSearch.addEventListener('click', () => onSearchClick());
    // La fonctionnalité aléatoire a été supprimée — aucun gestionnaire attaché.
    if(elements.btnAll) elements.btnAll.addEventListener('click', async () => { await fetchAllAndRender(); });
    if(elements.btnClear) elements.btnClear.addEventListener('click', onClear);
    if(elements.applyFilters) elements.applyFilters.addEventListener('click', async () => {
        const type = elements.typeSelect && elements.typeSelect.value;
        const region = elements.regionSelect && elements.regionSelect.value;
        // utilise la fonction unifiée
        await performSearch('', type, region);
    });
    if(elements.resetFilters) elements.resetFilters.addEventListener('click', onClear);

    if(elements.typeSelect) elements.typeSelect.addEventListener('change', () => {
        // comportement : appliquer automatiquement au changement si rien dans la recherche
        if((elements.searchInput && elements.searchInput.value || '').trim() === '') {
            const type = elements.typeSelect.value;
            const region = elements.regionSelect && elements.regionSelect.value;
            if(type && region) performSearch('', type, region);
            else if(type) performSearch('', type, region);
            else if(region) performSearch('', type, region);
            else fetchAllAndRender();
        }
    });

    if(elements.regionSelect) elements.regionSelect.addEventListener('change', () => {
        if((elements.searchInput && elements.searchInput.value || '').trim() === '') {
            const type = elements.typeSelect && elements.typeSelect.value;
            const region = elements.regionSelect.value;
            if(type && region) performSearch('', type, region);
            else if(type) performSearch('', type, region);
            else if(region) performSearch('', type, region);
            else fetchAllAndRender();
        }
    });

    if(elements.searchInput) elements.searchInput.addEventListener('keydown', (ev) => { if(ev.key === 'Enter') onSearchClick(); });
}

async function init(){
    showMessage('Initialisation — chargement des filtres...');
    await Promise.all([populateTypes(), populateRegions()]);
    attachEvents();

    // afficher tous les Pokémon par défaut, triés par id
    showMessage('Chargement initial de tous les Pokémon triés par id…');
    fetchAllAndRender().catch(e => {
        console.error(e);
        showMessage('Erreur lors du chargement initial.');
    });
}

// démarrage
init().catch(e => console.error(e));
