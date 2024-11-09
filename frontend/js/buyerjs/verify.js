// Get the hamburger button and mobile nav links
const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

// Add a click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the mobile nav links
    navLinksMobile.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch proofs from the API and populate the table
    const response = await fetch('http://localhost:7000/api/proofs');
    const proofs = await response.json();
    const proofTable = document.getElementById('proofTable');

    proofs.forEach(proof => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${proof.description}</td>
            <td><button onclick="verifyProof(${proof.id})">Verify</button></td>
        `;
        proofTable.appendChild(row);
    });
});

async function verifyProof(proofId) {
    try {
        const response = await fetch(`http://localhost:7000/api/verify/${proofId}`, { method: 'POST' });
        if (response.ok) {
            alert('Verification successful, earnings updated!');
            // Optionally refresh the table or update the UI
        } else {
            alert('Verification failed');
        }
    } catch (error) {
        console.error('Error verifying proof:', error);
        alert('An error occurred');
    }
}



async function fetchProofs() {
    try {
        const response = await fetch('http://localhost:7000/api/verify',{
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            alert('Failed to load proofs. Please log in again.');
            return;
        }
        
        const proofs = await response.json();

        const proofTableBody = document.getElementById('proofTableBody');
        proofTableBody.innerHTML = ''; // Clear any existing rows

        proofs.forEach(proof => {
            const row = document.createElement('tr');

            // Screenshot column
            const screenshotCell = document.createElement('td');
            const screenshotImg = document.createElement('img');
            screenshotImg.src = `http://localhost:7000/uploads/${proof.screenshot_path}`;
            screenshotImg.alt = 'Proof Screenshot';
            screenshotImg.width = 100; // Adjust size as needed
            screenshotCell.appendChild(screenshotImg);
            row.appendChild(screenshotCell);

            // Link column
            const linkCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = proof.video_link;
            link.textContent = 'Share Link';
            link.target = '_blank';
            linkCell.appendChild(link);
            row.appendChild(linkCell);

            // Action column
            const actionCell = document.createElement('td');
            const awardButton = document.createElement('button');
            awardButton.textContent = 'Verify Task';
            awardButton.onclick = () => awardUser(proof.id, 50, proof.video_id, proof.user_id, 'verified'); // Award amount, e.g., 50
            actionCell.appendChild(awardButton);
            row.appendChild(actionCell);

            proofTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching proofs:', error);
    }
}

async function awardUser(proofId, awardAmount, videoId, userId, status) {

    try {
        const response = await fetch(`http://localhost:7000/api/award/${proofId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
            },
            body: JSON.stringify({ awardAmount,  userId, videoId, status })
        });

        if (response.ok) {
            alert('User awarded successfully');
            fetchProofs(); // Refresh the proofs table
        } else {
            alert('Error awarding user');
        }
    } catch (error) {
        console.error('Error awarding user:', error);
    }
}


// Call fetchProofs on page load
document.addEventListener('DOMContentLoaded', fetchProofs);
