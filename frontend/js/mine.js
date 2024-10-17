// Function to mark the current page link as active
window.onload = function() {
    const currentPath = window.location.pathname;

   // Select all nav links
   const navLinks = document.querySelectorAll('.nav-link');

   // Loop through links and add 'active' class to the one that matches the current URL
   navLinks.forEach(link => {
       if (link.getAttribute('href') === currentPath) {
           link.classList.add('active');
       }
   });
}

// Array of mining machines data
const miningMachines = [
    {
        name: "Mining Machine A",
        rate: "5% in 30 days",
        imgPath: "../img/bitcoin- mine.jpg", 
    },
    {
        name: "Stocks",
        rate: "10% in 60 days",
        imgPath: "../img/Stocks.PNG", 
    },
    {
        name: "Mining Machine C",
        rate: "8% in 45 days",
        imgPath: "../img/farm 2.jpg", 
    },

    {
        name: "Mining Machine D",
        rate: "8% in 45 days",
        imgPath: "../img/mining 2.PNG", 
    },

    {
        name: "Mining Machine E",
        rate: "8% in 45 days",
        imgPath: "../img/farm 2.jpg", 
    },
    {
        name: "Shares",
        rate: "8% in 45 days",
        imgPath: "../img/shares.PNG", 
    },

    // Add more machines as needed
];

// Function to create a card for each machine
function createMachineCard(machine) {
    const card = document.createElement('div');
    card.classList.add('cards');

    card.innerHTML = `
        <img src="${machine.imgPath}" alt="${machine.name} Image">
        <h3>${machine.name}</h3>
        <p>Investment Rate: <strong>${machine.rate}</strong></p>
        <button class="btn">Start Investment</button>
    `;

    return card;
}

// Function to populate the machine cards
function populateMachineCards() {
    const machineCardsContainer = document.getElementById('machine-cards');

    // Loop through the mining machines array and create a card for each machine
    miningMachines.forEach(machine => {
        const machineCard = createMachineCard(machine);
        machineCardsContainer.appendChild(machineCard);
    });
}

// Call the function to populate machine cards on page load
populateMachineCards();


// Get the hamburger button and mobile nav links
const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

// Add a click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the mobile nav links
    navLinksMobile.classList.toggle('active');
});
