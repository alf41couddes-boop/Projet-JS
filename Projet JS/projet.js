 /* 
  try{
    for(let i = 0; i< 20; i++){
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://pokeapi.co/api/v2/pokemon" + i,false);
        xhr.send();
        const response = JSON.parse(xhr.response);

        const searchParagraph = document.querySelector("#result");
        searchParagraph.innerHTML = response.name + " a pour poids " + response.weight +
         " et pour taille " + response.height +
         "<br><img src='" + response.sprites.front_default + "'/>";

        console.log(xhr);
        console.log(response);
    }
        if(response.response_code!==0){
            throw new Error("Erreur dans le retour de l'API");
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