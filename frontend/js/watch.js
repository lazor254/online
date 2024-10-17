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

// Define an object of video categories with their respective videos
const videoCategories = {
    learn: [
        // videos
        {
            title: "Intro to Tasking",
            youtubeLink: "https://www.youtube.com/watch?v=7TO-xOhohrQ",  // Link to the YouTube video
            // earnings: "$0",  // Learn videos don't have earnings
            // verificationRate: "1 day",
        },
        {
            title: "Understanding Basics",
            youtubeLink: "https://www.youtube.com/watch?v=7TO-xOhohrQ",
            // earnings: "$0",
            // verificationRate: "1 day",
        },

        {
            title: "Understanding Basics",
            youtubeLink: "https://www.youtube.com/watch?v=7TO-xOhohrQ",
            // earnings: "$0",
            // verificationRate: "1 day",
        },

        {
            title: "Understanding Basics",
            youtubeLink: "https://www.youtube.com/watch?v=7TO-xOhohrQ",
            // earnings: "$0",
            // verificationRate: "1 day",
        },
       
    ],
    watchToEarn: [
        {
            title: "Advanced Tasking Techniques",
            youtubeLink: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
            earnings: "ksh. 5.00",
            verificationRate: "1 day ",

        },
        {
            title: "Boosting Efficiency",
            youtubeLink: "https://www.youtube.com/watch?v=ghRXlzRnxAg",
            earnings: "ksh. 5.00",
            verificationRate: "1 day ",
           
        },

        {
            title: "Boosting Efficiency",
            youtubeLink: "https://www.youtube.com/watch?v=ghRXlzRnxAg",
            earnings: "ksh. 5.00",
            verificationRate: "1 day ",
           
        },

        {
            title: "Boosting Efficiency",
            youtubeLink: "https://www.youtube.com/watch?v=ghRXlzRnxAg",
            earnings: "ksh. 5.00",
            verificationRate: "1 day ",
           
        },
       
    ],
    subscribeTasks: [
        {
            title: "Subscribe to Channel X",
            youtubeLink: "https://www.youtube.com/watch?v=u72r7YB6F-A",
            earnings: "ksh. 10.00",
            verificationRate: "5 hours",

            
        },
        {
            title: "Follow Channel Y",
            youtubeLink: "https://www.youtube.com/watch?v=u72r7YB6F-A",
            earnings: "ksh. 10.00",
            verificationRate: "4  hours",
        },

        {
            title: "Follow Channel Y",
            youtubeLink: "https://www.youtube.com/watch?v=u72r7YB6F-A",
            earnings: "ksh. 10.00",
            verificationRate: "5  hours",
        },

        {
            title: "Follow Channel Y",
            youtubeLink: "https://www.youtube.com/watch?v=u72r7YB6F-A",
            earnings: "ksh. 10.00",
            verificationRate: "24  hours",
        },
       
    ]
};

// Function to create a video card
function createVideoCard(video, type) {
    const videoId = video.youtubeLink.split('v=')[1];


    // Create a card div
    const card = document.createElement('div');
    card.classList.add('card');

    //Button based on the type either watch or subscribe
    const buttonText = (type === 'subscribeTasks') ? 'Subscribe' : 'Watch';

    // Set the inner HTML for the card
    card.innerHTML = `
        <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video Preview" class="video-preview">
        <h3>${video.title}</h3>
        <p>Earnings: <strong>${video.earnings}</strong></p>
        <p>Rate: <strong>${video.verificationRate}</strong></p>
        <button class="action-btn" data-link="${video.youtubeLink}">${buttonText}</button>
        <button class="verify-btn">Verify</button>
    `;

    // Add event listener to the "Watch" button
    card.querySelector('.action-btn').addEventListener('click', function () {
        window.open(this.getAttribute('data-link'), '_blank');
    });

    // Add event listener to the "Verify" button
    card.querySelector('.verify-btn').addEventListener('click', function () {
        alert("Verification submitted for video: " + video.title);
    });

    return card;
}

// Function to populate video cards for each category
function populateVideoCards() {
    // Get the containers for each category
    const learnContainer = document.getElementById('learn-cards');
    const watchToEarnContainer = document.getElementById('subscribe-cards');
    const subscribeTasksContainer = document.getElementById('watch-cards');

    // Loop through "Learn" category and create cards
    videoCategories.learn.forEach(video => {
        const videoCard = createVideoCard(video, 'learn');
        learnContainer.appendChild(videoCard);
    });

    // Loop through "Watch to Earn" category and create cards
    videoCategories.watchToEarn.forEach(video => {
        const videoCard = createVideoCard(video, 'WatchToEarn');
        watchToEarnContainer.appendChild(videoCard);
    });

    // Loop through "Subscribe Tasks" category and create cards
    videoCategories.subscribeTasks.forEach(video => {
        const videoCard = createVideoCard(video, 'SubscribeTasks');
        subscribeTasksContainer.appendChild(videoCard);
    });
}

// Call the function to populate video cards on page load
populateVideoCards();



// Get the hamburger button and mobile nav links
const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

// Add a click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the mobile nav links
    navLinksMobile.classList.toggle('active');
});
