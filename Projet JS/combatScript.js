/**************************************************
 *  combat.js — utilise UNIQUEMENT le cache local
 **************************************************/

// ---------------------------------------------
//  Récupération d’un Pokémon complet depuis le cache
// ---------------------------------------------
function getStoredPokemon(id) {
    const data = localStorage.getItem("pokemon_full_" + id);
    return data ? JSON.parse(data) : null;
}

if (!localStorage.getItem("selectedPokemonId")) {
    localStorage.setItem("selectedPokemonId", "3"); // Bulbasaur par défaut
}


// Pokémon choisi par le joueur
const selectedId = localStorage.getItem("selectedPokemonId");

// Sécurité
if (!selectedId) {
    alert("Aucun Pokémon sélectionné pour le combat !");
    throw new Error("selectedPokemonId n'existe pas dans localStorage.");
}

// Pokémon du joueur (COMPLET, aucune requête API)
const player = getStoredPokemon(selectedId);

if (!player) {
    alert("Les données complètes de ce Pokémon ne sont pas en cache !");
    throw new Error("pokemon_full_" + selectedId + " non trouvé.");
}

// ---------------------------------------------
//  Générer un Pokémon adverse (PokéAPI)
//  (Tu peux aussi le remplacer par un Pokémon du cache)
// ---------------------------------------------
async function getRandomEnemy() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + randomId);
    return await res.json();
}


// Données du combat
let enemy;

let playerHP, enemyHP;
let playerMaxHP, enemyMaxHP;

let playerTurn = true;


// ---------------------------------------------
//  Mise à jour de l'affichage des PV
// ---------------------------------------------
function updateHPBars() {
    document.getElementById("player-hp").style.width =
        (playerHP / playerMaxHP * 100) + "%";

    document.getElementById("enemy-hp").style.width =
        (enemyHP / enemyMaxHP * 100) + "%";
}


// ---------------------------------------------
//  Journal du combat
// ---------------------------------------------
function log(msg) {
    document.getElementById("log").innerHTML += "<p>" + msg + "</p>";
}


// ---------------------------------------------
//  Calcul des dégâts
// ---------------------------------------------
function calculateDamage(attacker, defender, move) {

    const power = move.power || 40;

    const atk = attacker.stats.find(s => s.stat.name === "attack").base_stat;
    const def = defender.stats.find(s => s.stat.name === "defense").base_stat;

    const dmg = Math.max(5, Math.floor((atk / def) * power / 5));

    return dmg;
}


// ---------------------------------------------
//  Exécuter une attaque
// ---------------------------------------------
async function useMove(attacker, defender, move, attackerIsPlayer) {

    log(`${attacker.name} utilise ${move.name} !`);

    const damage = calculateDamage(attacker, defender, move);

    if (attackerIsPlayer) {
        enemyHP -= damage;
        if (enemyHP < 0) enemyHP = 0;
    } else {
        playerHP -= damage;
        if (playerHP < 0) playerHP = 0;
    }

    updateHPBars();

    // Défaite / victoire
    if (enemyHP === 0) {
        log("🎉 Victoire !");
        endCombat();
        return;
    }
    if (playerHP === 0) {
        log("💀 Défaite...");
        endCombat();
        return;
    }

    // Changement de tour
    playerTurn = !playerTurn;

    if (!playerTurn) {
        setTimeout(enemyAttack, 1200); // petite attente
    }
}


// ---------------------------------------------
//  Tour de l'adversaire : attaque aléatoire
// ---------------------------------------------
function enemyAttack() {

    const moveData = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];

    fetch(moveData.move.url)
        .then(r => r.json())
        .then(fullMove => {
            useMove(enemy, player, fullMove, false);
        });
}


// ---------------------------------------------
//  Fin du combat
// ---------------------------------------------
function endCombat() {
    document.getElementById("actions").innerHTML = "";
    log("<strong>Combat terminé.</strong>");
}


// ---------------------------------------------
//  Initialisation du combat
// ---------------------------------------------
async function startCombat() {

    // Récupération de l’ennemi
    enemy = await getRandomEnemy();

    // PV
    playerMaxHP = player.stats.find(s => s.stat.name === "hp").base_stat;
    enemyMaxHP = enemy.stats.find(s => s.stat.name === "hp").base_stat;

    playerHP = playerMaxHP;
    enemyHP = enemyMaxHP;

    // Affichage des sprites + noms
    document.getElementById("player-name").textContent = player.name;
    document.getElementById("player-sprite").src = player.sprites.front_default;

    document.getElementById("enemy-name").textContent = enemy.name;
    document.getElementById("enemy-sprite").src = enemy.sprites.front_default;

    updateHPBars();

    // Génération des boutons d’attaque
    const actionsDiv = document.getElementById("actions");
    actionsDiv.innerHTML = "";

    // On limite à 4 attaques comme dans Pokémon
    const firstMoves = player.moves.slice(0, 4);

    for (let m of firstMoves) {

        const moveInfo = await fetch(m.move.url).then(r => r.json());

        const btn = document.createElement("button");
        btn.textContent = moveInfo.name + " (" + (moveInfo.power || 0) + ")";
        btn.onclick = () => {
            if (playerTurn) {
                useMove(player, enemy, moveInfo, true);
            }
        };

        actionsDiv.appendChild(btn);
    }

    log("⚔️ Le combat commence !");
}


// ---------------------------------------------
startCombat();

