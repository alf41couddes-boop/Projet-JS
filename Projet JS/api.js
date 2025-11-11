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
    btnRandom: $q('#btn-random', 'button[data-action="random"]'),
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

async function fetchJSON(url){
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
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

async function listByNameOrId(query){
    try{
        showMessage('Recherche en cours...');
        clearResults();
        const p = await getPokemonDetails(query.toLowerCase());
        renderPokemonCard(p);
        updateCount(1);
        showMessage('');
    } catch(e){
        try {
            showMessage('Aucun résultat exact, recherche par début de nom...');
            const all = await fetchJSON(`${API_ROOT}/pokemon?limit=${MAX_RENDER}`);
            const matches = (all.results || []).filter(poke => poke.name.startsWith(query.toLowerCase()));
            if(matches.length === 0){
                clearResults();
                showMessage(`Aucun Pokémon trouvé pour « ${query} »`);
                return;
            }
            const toShow = matches.slice(0, 200);
            showMessage(`${toShow.length} résultat(s) commençant par « ${query} » :`);
            const details = await Promise.all(toShow.map(poke => getPokemonDetails(poke.name).catch(() => null)));
            details.filter(Boolean).forEach(renderPokemonCard);
            updateCount(details.filter(Boolean).length);
        } catch(e2){
            clearResults();
            showMessage(`Aucun Pokémon trouvé pour « ${query} »`);
            console.error(e2);
        }
    }
}

async function listByType(typeName){
    if(!typeName){
        await fetchAllAndRender();
        return;
    }
    try{
        showMessage('Chargement des Pokémon pour le type...');
        clearResults();
        const data = await fetchJSON(`${API_ROOT}/type/${encodeURIComponent(typeName)}`);
        const entries = (data.pokemon || []).map(p => p.pokemon).slice(0, MAX_RENDER);
        showMessage(`Affichage de ${entries.length} Pokémon de type ${typeName}`);
        let rendered = 0;
        for(let i=0;i<entries.length;i+=CHUNK_SIZE){
            const chunk = entries.slice(i, i+CHUNK_SIZE);
            const details = await Promise.all(chunk.map(e => getPokemonDetails(e.name).catch(() => null)));
            details.filter(Boolean).forEach(d => { renderPokemonCard(d); rendered++; });
            updateCount(rendered);
        }
    } catch(e){
        clearResults();
        showMessage('Erreur lors du chargement par type.');
        console.error(e);
    }
}

async function listByRegion(regionName){
    if(!regionName){
        await fetchAllAndRender();
        return;
    }
    try{
        showMessage('Chargement des Pokémon pour la région...');
        clearResults();
        const region = await fetchJSON(`${API_ROOT}/region/${encodeURIComponent(regionName)}`);
        if(!region.pokedexes || region.pokedexes.length===0){
            showMessage('Aucun pokedex disponible pour cette région.');
            return;
        }
        const pokedexUrl = region.pokedexes[0].url;
        const pokedex = await fetchJSON(pokedexUrl);
        const entries = (pokedex.pokemon_entries || []).map(e => e.pokemon_species).slice(0, MAX_RENDER);
        showMessage(`Affichage de ${entries.length} Pokémon de la région ${regionName}`);
        let rendered = 0;
        for(let i=0;i<entries.length;i+=CHUNK_SIZE){
            const chunk = entries.slice(i, i+CHUNK_SIZE);
            const details = await Promise.all(chunk.map(e => getPokemonDetails(e.name).catch(() => null)));
            details.filter(Boolean).forEach(d => { renderPokemonCard(d); rendered++; });
            updateCount(rendered);
        }
    } catch(e){
        clearResults();
        showMessage('Erreur lors du chargement par région.');
        console.error(e);
    }
}

async function listByRegionAndType(regionName, typeName) {
    if(!regionName && !typeName){
        await fetchAllAndRender();
        return;
    }
    if(regionName && !typeName) return listByRegion(regionName);
    if(typeName && !regionName) return listByType(typeName);

    try {
        showMessage('Chargement des Pokémon pour la région et le type...');
        clearResults();
        const region = await fetchJSON(`${API_ROOT}/region/${encodeURIComponent(regionName)}`);
        if (!region.pokedexes || region.pokedexes.length === 0) {
            showMessage('Aucun pokedex disponible pour cette région.');
            return;
        }
        const pokedexUrl = region.pokedexes[0].url;
        const pokedex = await fetchJSON(pokedexUrl);
        const regionNames = new Set((pokedex.pokemon_entries || []).map(e => e.pokemon_species.name));

        const typeData = await fetchJSON(`${API_ROOT}/type/${encodeURIComponent(typeName)}`);
        const typeNames = new Set((typeData.pokemon || []).map(e => e.pokemon.name));

        const intersection = Array.from(regionNames).filter(name => typeNames.has(name));
        if (intersection.length === 0) {
            showMessage(`Aucun Pokémon trouvé pour la région ${regionName} et le type ${typeName}.`);
            return;
        }
        showMessage(`Affichage de ${intersection.length} Pokémon de la région ${regionName} et de type ${typeName}`);
        let rendered = 0;
        for(let i=0;i<intersection.length;i+=CHUNK_SIZE){
            const chunk = intersection.slice(i, i+CHUNK_SIZE);
            const details = await Promise.all(chunk.map(n => getPokemonDetails(n).catch(() => null)));
            details.filter(Boolean).forEach(d => { renderPokemonCard(d); rendered++; });
            updateCount(rendered);
        }
    } catch (e) {
        clearResults();
        showMessage('Erreur lors du chargement combiné région + type.');
        console.error(e);
    }
}

async function onSearchClick(){
    const q = (elements.searchInput && elements.searchInput.value || '').trim();
    const type = elements.typeSelect && elements.typeSelect.value;
    const region = elements.regionSelect && elements.regionSelect.value;

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
    // si rien -> afficher tout
    await fetchAllAndRender();
}

async function getTotalPokemonCount(){
    const data = await fetchJSON(`${API_ROOT}/pokemon?limit=1`);
    return data.count || 1000;
}

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
    if(elements.btnRandom){
        elements.btnRandom.addEventListener('click', async () => {
            try{
                const total = await getTotalPokemonCount();
                const id = Math.floor(Math.random() * Math.max(total, 1)) + 1;
                const det = await getPokemonDetails(String(id));
                clearResults();
                renderPokemonCard(det);
                updateCount(1);
                showMessage('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch(err){
                console.error('random:', err);
                showMessage('Erreur lors de la sélection aléatoire.');
            }
        });
    }
    if(elements.btnAll) elements.btnAll.addEventListener('click', async () => { await fetchAllAndRender(); });
    if(elements.btnClear) elements.btnClear.addEventListener('click', onClear);
    if(elements.applyFilters) elements.applyFilters.addEventListener('click', async () => {
        const type = elements.typeSelect && elements.typeSelect.value;
        const region = elements.regionSelect && elements.regionSelect.value;
        if(type && region) await listByRegionAndType(region, type);
        else if(type) await listByType(type);
        else if(region) await listByRegion(region);
        else await fetchAllAndRender();
    });
    if(elements.resetFilters) elements.resetFilters.addEventListener('click', onClear);

    if(elements.typeSelect) elements.typeSelect.addEventListener('change', () => {
        // comportement : appliquer automatiquement au changement si rien dans la recherche
        if((elements.searchInput && elements.searchInput.value || '').trim() === '') {
            const type = elements.typeSelect.value;
            const region = elements.regionSelect && elements.regionSelect.value;
            if(type && region) listByRegionAndType(region, type);
            else if(type) listByType(type);
            else if(region) listByRegion(region);
            else fetchAllAndRender();
        }
    });

    if(elements.regionSelect) elements.regionSelect.addEventListener('change', () => {
        if((elements.searchInput && elements.searchInput.value || '').trim() === '') {
            const type = elements.typeSelect && elements.typeSelect.value;
            const region = elements.regionSelect.value;
            if(type && region) listByRegionAndType(region, type);
            else if(type) listByType(type);
            else if(region) listByRegion(region);
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
