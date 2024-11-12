// Get the hamburger button and mobile nav links
const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

// Add a click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the mobile nav links
    navLinksMobile.classList.toggle('active');
});



// Fetch pending proofs and display them
async function fetchPendingProofs() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('You are not logged in');
            return;
        }

        const response = await fetch('http://localhost:7000/api/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch proofs');
        }

        const proofs = await response.json();
        populateProofsTable(proofs);
    } catch (error) {
        console.error('Error fetching proofs:', error);
    }
}

// Populate the proofs table
function populateProofsTable(proofs) {
    const tableBody = document.getElementById('proofTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    proofs.forEach(proof => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${proof.id}</td>
            <td>${proof.video_id}</td>
            <td><img src="${proof.screenshot_path}" alt="Screenshot" width="100"></td>
            <td><a href="${proof.video_link}" target="_blank">View Video</a></td>
            
            <td>${proof.user_id}</td>
            <td>${proof.amount}</td>
            <td>${proof.status}</td>
            <td>
                <button onclick="updateProofStatus(${proof.id}, '${proof.video_id}', ${proof.user_id}, ${proof.amount}, 'verified')">Verify</button>
                <button onclick="updateProofStatus(${proof.id}, '${proof.video_id}', ${proof.user_id}, ${proof.amount}, 'declined')">Decline</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to verify or decline a proof
async function updateProofStatus(proofId, videoId, userId, amount, status) {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('Authentication token missing. Please log in again.');
        return;
    }

    // Confirmation dialog
    if (!confirm(`Are you sure you want to ${status} this proof?`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:7000/api/award/${proofId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoId: videoId,
                userId: userId,
                awardAmount: amount,
                status: status
            })
        });

        if (response.ok) {
            alert(`Proof ${status} successfully`);
            fetchPendingProofs(); // Refresh the proofs list
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error updating proof status:', error);
        alert('An error occurred while updating the proof status');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchPendingProofs();
});
