
// ---------------------------------------------
//  Récupération d’un Pokémon complet depuis le cache
// ---------------------------------------------
function getStoredPokemon(id) {
    const data = localStorage.getItem("pokemon_full_" + id);
    return data ? JSON.parse(data) : null;
}

if (!localStorage.getItem("selectedPokemonId")) {
    localStorage.setItem("selectedPokemonId", "3"); // Venusaur par défaut
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
//  Afficher l'inventaire
// ---------------------------------------------
function displayInventory() {
    const inventoryDiv = document.getElementById("inventory-list");
    inventoryDiv.innerHTML = ""; // Vider l'inventaire avant de le remplir

    // Affichage des Pokémon dans l'inventaire
    for (let i = 1; i <= 1025; i++) { // Supposons que tu as 6 Pokémon max
        const storedPokemon = getStoredPokemon(i); // Récupérer les données du Pokémon

        if (storedPokemon) {
            console.log(storedPokemon); // Vérification dans la console
            // Créer un bouton pour chaque Pokémon
            const pokemonButton = document.createElement("button");
            pokemonButton.textContent = storedPokemon.name;
            pokemonButton.onclick = () => selectPokemonForCombat(i);

            // Afficher son sprite à côté
            const pokemonSprite = document.createElement("img");
            pokemonSprite.src = storedPokemon.sprites.front_default;
            pokemonSprite.alt = storedPokemon.name;
            pokemonButton.appendChild(pokemonSprite);

            // Ajouter un affichage de barre de vie indépendante pour chaque Pokémon
            const hpBarDiv = document.createElement("div");
            hpBarDiv.classList.add("hp-bar");
            const hpProgress = document.createElement("div");
            hpProgress.classList.add("hp-progress");


            // Récupérer les PV maximaux
            const pokemonMaxHP = storedPokemon.stats.find(s => s.stat.name === "hp").base_stat;

            // Récupérer les PV actuels depuis localStorage ou initialiser à plein
            let pokemonCurrentHP = localStorage.getItem(i + "_hp"); // On suppose que les PV actuels sont stockés sous `pokemonId_hp`
            console.log("PV actuels du Pokémon ID " + i + ": " + pokemonCurrentHP);
            if (!pokemonCurrentHP) {
                pokemonCurrentHP = pokemonMaxHP; // Initialisation à plein si pas trouvé
                localStorage.setItem(i + "_hp", pokemonCurrentHP); // Sauvegarder initialement dans le localStorage
            }
            // Calculer le pourcentage de PV actuel
            const hpPercentage = (pokemonCurrentHP / pokemonMaxHP) * 100;

            hpProgress.style.width = `${hpPercentage}%`; // Ajuster la largeur en fonction des PV actuels
            hpBarDiv.appendChild(hpProgress);
            pokemonButton.appendChild(hpBarDiv);

            inventoryDiv.appendChild(pokemonButton);
        }
    }
}

// ---------------------------------------------
//  Selectionner un Pokémon pour le combat
// ---------------------------------------------
function selectPokemonForCombat(pokemonId) {

    // si le pokemon est déjà sélectionné, ne rien faire
    if(localStorage.getItem("selectedPokemonId") == pokemonId){
        return;
    }

    // Mettre à jour le Pokémon sélectionné dans localStorage
    localStorage.setItem("selectedPokemonId", pokemonId.toString());

    // Récupérer les données complètes de ce Pokémon
    const selectedPokemon = getStoredPokemon(pokemonId);

    if (!selectedPokemon) {
        alert("Ce Pokémon n'est pas disponible dans l'inventaire !");
        return;
    }

    // Mettre à jour l'affichage du Pokémon choisi
    document.getElementById("player-name").textContent = selectedPokemon.name;
    document.getElementById("player-sprite").src = selectedPokemon.sprites.front_default;

    // Mettre à jour les PV du joueur sans redémarrer le combat
    playerMaxHP = selectedPokemon.stats.find(s => s.stat.name === "hp").base_stat;
    playerHP = playerMaxHP;
    playerXP = parseInt(localStorage.getItem(pokemonId + "_xp"));

    // AFfichage des informations dans la console pour le débogage
    console.log("XP du Pokémon sélectionné : " + playerXP);
    console.log("id du Pokémon sélectionné : " + selectedId);

    document.getElementById("player-xp").style.width = (playerXP / playerMaxXP * 100) + "%" ;

    // Mettre à jour les attaques
    updateActions(selectedPokemon);
    updateHPBars();
    updateXPBars();

}

// ---------------------------------------------
//  Fonction pour récupérer les actions d'un pokemon sélectionné
// ---------------------------------------------
async function updateActions(selectedPokemon) {
    const actionsDiv = document.getElementById("actions");
    actionsDiv.innerHTML = "";

    const firstMoves = selectedPokemon.moves.slice(0, 4);

    for (let m of firstMoves) {
        const moveInfo = await fetch(m.move.url).then(r => r.json());

        const btn = document.createElement("button");
        btn.textContent = moveInfo.name + " (" + (moveInfo.power || 0) + ")";
        btn.onclick = () => {
            if (playerTurn) {
                useMove(selectedPokemon, enemy, moveInfo, true);
            }
        };

        actionsDiv.appendChild(btn);
    }
}


// ---------------------------------------------
//  Générer un Pokémon adverse (PokéAPI)
// ---------------------------------------------
async function getRandomEnemy() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + randomId);
    return await res.json();
}


// Données du combat
let enemy;

let playerHP, enemyHP;

let playerXP, playerMaxXP = 100;

let playerMaxHP, enemyMaxHP;

let playerTurn = true;

// ---------------------------------------------
//  Récupération de la barre d'XP
// ---------------------------------------------
function initializeXPBar() {
        if(localStorage.getItem(selectedId + "_xp")){
            playerXP = parseInt(localStorage.getItem(selectedId + "_xp"));
            document.getElementById("player-xp").style.width = (playerXP / playerMaxXP * 100) + "%" ;
        }
        else {
            playerXP = 0;
            localStorage.setItem(selectedId + "_xp", playerXP);
            document.getElementById("player-xp").style.width = 0;
        }
    }
initializeXPBar();
// ---------------------------------------------
//  Mise à jour de la barre d'XP
// ---------------------------------------------
function updateXPBars() {

    localStorage.setItem(selectedId + "_xp", playerXP);

    if (enemyHP !== 0) {
        playerXP = parseInt(localStorage.getItem(selectedId + "_xp"));

    }
    if (enemyHP === 0) {
        playerXP += 20; // Gagne 20 XP par victoire

        // Mettre à jour l'XP du Pokémon dans localStorage
        localStorage.setItem(selectedId + "_xp", playerXP);
    }
        // Mettre à jour la barre d'XP
        document.getElementById("player-xp").style.width = (playerXP / playerMaxXP) * 100 + "%";
    
}



// ---------------------------------------------
//  Mise à jour de l'affichage des HP
// ---------------------------------------------
function updateHPBars() {
    document.getElementById("player-hp").style.width =
        (playerHP / playerMaxHP * 100) + "%";

    document.getElementById("enemy-hp").style.width =
        (enemyHP / enemyMaxHP * 100) + "%";
}

// Après chaque attaque, met à jour les PV du joueur
function updatePlayerHP(newHP) {
    localStorage.setItem(selectedId + "_hp", newHP); // Met à jour les PV dans localStorage
    updateHPBars(); // Mets à jour les barres d'HP dans l'interface
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
        updatePlayerHP(playerHP);
    }

    updateHPBars();
    updateXPBars();


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
    displayInventory(); // Afficher l'inventaire au début du combat

    // Récupération de l’ennemi
    enemy = await getRandomEnemy();

    // Récupérer les données du joueur sélectionné
    const selectedId = localStorage.getItem("selectedPokemonId");
    const player = getStoredPokemon(selectedId);

    if (!player) {
        alert("Aucun Pokémon sélectionné pour le combat !");
        return;
    }

    // Initialiser les PV, attaques, et autres données du combat comme avant
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

