window.data = {
  coffee: 0,
  totalCPS: 0,
  producers: [
    {
      id: 'chemex',
      price: 10,
      unlocked: false,
      cps: 1,
      qty: 0,
    },
    {
      id: 'french_press',
      price: 50,
      unlocked: false,
      cps: 2,
      qty: 0,
    },
    {
      id: 'mr._coffee',
      price: 100,
      unlocked: false,
      cps: 5,
      qty: 0,
    },
    {
      id: 'ten_cup_urn',
      price: 500,
      unlocked: false,
      cps: 10,
      qty: 0,
    },
    {
      id: 'espresso_machine',
      price: 1000,
      unlocked: false,
      cps: 20,
      qty: 0,
    },
    {
      id: 'ten_gallon_urn',
      price: 5000,
      unlocked: false,
      cps: 50,
      qty: 0,
    },
    {
      id: 'coffeeshop',
      price: 10000,
      unlocked: false,
      cps: 75,
      qty: 0,
    },
    {
      id: 'coffee_factory',
      price: 50000,
      unlocked: false,
      cps: 100,
      qty: 0,
    },
    {
      id: 'coffee_fountain',
      price: 100000,
      unlocked: false,
      cps: 200,
      qty: 0,
    },
    {
      id: 'coffee_river',
      price: 500000,
      unlocked: false,
      cps: 500,
      qty: 0,
    },
    {
      id: 'coffee_ocean',
      price: 1000000,
      unlocked: false,
      cps: 1000,
      qty: 0,
    },
    {
      id: 'coffee_planet',
      price: 5000000,
      unlocked: false,
      cps: 2000,
      qty: 0,
    },
  ],
};

/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.getElementById('coffee_counter').innerText = coffeeQty;

  return document.getElementById('big_coffee')[0];
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

//this unlocks producers when the count is high enough
function unlockProducers(producers, coffeeCount) {
  for (let i = 0; i < producers.length; i++) {
    if (coffeeCount >= producers[i].price / 2) {
      producers[i].unlocked = true;
    }
  }
}

//this function returns an array of producer objects
function getUnlockedProducers(data) {
  const producers = [...data.producers];
  return producers.filter((elem) => elem.unlocked === true);
}

//this funciton may use more code than needed
//but turns an id tag into a pretty string!
function makeDisplayNameFromId(id) {
  let stringArr = id.split('');

  for (let i = 0; i < stringArr.length; i++) {
    if (stringArr[i] === '_') {
      stringArr[i] = ' ';
    }
  }

  return stringArr
    .join('')
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}
//this clears the children nodes from a parent node
function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//this fills the producers container on the DOM with some child nodes
function renderProducers(data) {
  let container = document.getElementById('producer_container'); //gets container node

  deleteAllChildNodes(container); //deletes child nodes of producer container

  unlockProducers(data.producers, data.coffee); //unlocks producers

  const unlockedData = getUnlockedProducers(data); //returns array of unlocked producer objects

  for (let i = 0; i < unlockedData.length; i++) {
    //adds child nodes for each unlocked producer

    container.appendChild(makeProducerDiv(unlockedData[i]));
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) {
      return data.producers[i];
    }
  }
}

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  return data.coffee >= producer.price;
}

function updateCPSView(cps) {
  document.getElementById('cps').innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  const producer = getProducerById(data, producerId);

  if (canAffordProducer(data, producerId)) {
    producer.qty++;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  if (event.target.tagName === 'BUTTON') {
    const producerId = event.target.id.slice(4);

    if (attemptToBuyProducer(data, producerId) === false) {
      window.alert('Not enough coffee!');
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
