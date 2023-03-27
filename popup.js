document.getElementById('signin-button').addEventListener('click', function() {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Access token:', token);
      // Do something with the access token, such as send it to your server or use it to access Google APIs
    }
  });
});


// Get the add card form
const addCardForm = document.getElementById('add-card-form');

// Load the cards from storage when the popup is opened
chrome.storage.sync.get('cards', function(data) {
  let cards = data.cards || [];
  
  // Update the loyalty cards table
  renderLoyaltyCardsTable(cards);
});

// Handle form submission for adding a new loyalty card
addCardForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Get the input values from the form
  const nameInput = document.getElementById('card-name');
  const numberInput = document.getElementById('card-number');
  const codeInput = document.getElementById('card-code');
  
  const name = nameInput.value;
  const number = numberInput.value;
  const code = codeInput.value;
  
  // Create a new loyalty card object and add it to the cards array
  const card = {
    name: name,
    number: number,
    code: code,
    points: 0
  };
  
  // Get the existing cards from storage
  chrome.storage.sync.get('cards', function(data) {
    let cards = data.cards || [];
    
    // Add the new card to the existing cards array
    cards.push(card);
    
    // Save the updated cards to storage
    chrome.storage.sync.set({cards: cards}, function() {
      // Update the loyalty cards table
      renderLoyaltyCardsTable(cards);
      
      // Clear the input fields
      nameInput.value = '';
      numberInput.value = '';
      codeInput.value = '';
    });
  });
});

// Function to render the loyalty cards table
function renderLoyaltyCardsTable(cards) {
  const tableBody = document.getElementById('loyalty-cards-table-body');
  
  // Remove all existing rows from the table body
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  
  // Add a row for each card to the table body
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    
    const tr = document.createElement('tr');
    
    const nameTd = document.createElement('td');
    nameTd.textContent = card.name;
    tr.appendChild(nameTd);
    
    const numberTd = document.createElement('td');
    numberTd.textContent = card.number;
    tr.appendChild(numberTd);
    
    const codeTd = document.createElement('td');
    codeTd.textContent = card.code;
    tr.appendChild(codeTd);
    
    const pointsTd = document.createElement('td');
    pointsTd.textContent = card.points;
    tr.appendChild(pointsTd);
    
    const sendTd = document.createElement('td');
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.addEventListener('click', function() {
      const message = `Name: ${card.name}\nNumber: ${card.number}\nCode: ${card.code}\nPoints: ${card.points}`;
      const subject = `My loyalty card: ${card.name}`;
      const uri = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(uri);
    });
    sendTd.appendChild(sendButton);
    tr.appendChild(sendTd);
    
    tableBody.appendChild(tr);
  }
}

