
async function getData(starter_nb) {
    let list = []
    const url = "https://pokeapi.co/api/v2/pokedex/36";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
     
      for (i=0; i<starter_nb; i++) {
        const url = json.pokemon_entries[Math.floor(Math.random() * json.pokemon_entries.length)].pokemon_species.url
        console.log(json.pokemon_entries.length);
        
        const parts = url.split("/");
        const number = parts[parts.length - 2];
        list.push(number)
      }

    } catch (error) {
      console.error(error.message);
    }
    return list
}

async function getPokemonById(id) {
    const url = "https://tyradex.app/api/v1/pokemon/" + id;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      
      showPokemon(json)
    } catch (error) {
      console.error(error.message);
    }
}


function isShiny() {
  var shiny_chance = document.getElementById('shiny_chance');

  const isShiny = Math.floor(Math.random() * shiny_chance.value) +1

  if (isShiny == 1) {
    return true
  } else {
    return false
  }
}

async function showPokemon(pokemon) {
  var template = document.createElement('template')
  template.innerHTML = await(await fetch('./pokemon.html')).text()

  const shinyornot = isShiny()
  let sprite
  if (shinyornot && pokemon.sprites.shiny) {
    sprite = pokemon.sprites.shiny
  } else {
    sprite = pokemon.sprites.regular
  }
  template.content.querySelector('.pkmn_img').innerHTML = '<img class="pkmn_sprite" src="' + sprite + '" alt="' + pokemon.name.fr + ' image">'
  template.content.querySelector('.pkmn_type1').innerHTML = '<img src="' + pokemon.types[0].image + '" alt="' + pokemon.name.fr + ' image">'
  if (pokemon.types[1]) {
    template.content.querySelector('.pkmn_type2').innerHTML = '<img src="' + pokemon.types[1]?.image + '" alt="' + pokemon.name.fr + ' image">'
  }
  template.content.querySelector('.pkmn_name').innerHTML = pokemon.name.fr
  template.content.querySelector('.pkmn_gen').innerHTML += pokemon.generation
  template.content.querySelector('.pkmn_id').innerHTML += pokemon.pokedex_id
  pokemon.talents.forEach(element => {
    template.content.querySelector('.pkmn_abilities').innerHTML += element.name + " "
  });
  template.content.querySelector('.pkmn_weight').innerHTML += pokemon.weight
  template.content.querySelector('.pkmn_height').innerHTML += pokemon.height
  const BST = pokemon.stats.hp + pokemon.stats.atk + pokemon.stats.def + pokemon.stats.spe_atk + pokemon.stats.spe_def + pokemon.stats.vit
  template.content.querySelector('.pkmn_bst').innerHTML += BST

  var pokemons = document.getElementById('pokemons');
  pokemons.innerHTML += template.innerHTML
}


async function generate() {
  var pokemons = document.getElementById('pokemons');
  pokemons.innerHTML = ""

  var starter_nb = document.getElementById('starter_nb');
  const starters = await getData(starter_nb.value)
  
  for (i=0; i<starters.length; i++) {
    await getPokemonById(starters[i])
  }
}

async function initial() {
  await getPokemonById(1)
  await getPokemonById(4)
  await getPokemonById(7)
}


initial()