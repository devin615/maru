document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-winner-form');
    const formContainer = document.getElementById('add-winner-form-container');
    const loginLink = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-btn');
    const prizeList = document.getElementById('prize-list');
    const userIdDisplay = document.getElementById('user-id-display');
    const profilePic = document.getElementById('profile-pic');

    // Winner Data (Currently resets on refresh unless using a database)
    let winners = [];

    // Auth Check: See if a user is logged in
    const currentUser = JSON.parse(localStorage.getItem('vbuck_user'));
    const isLogged = !!currentUser;

    if (isLogged) {
        formContainer.style.display = 'block';
        loginLink.style.display = 'none';
        logoutBtn.style.display = 'block';
        userIdDisplay.innerText = currentUser.name;

        // --- Profile Picture Logic ---
        profilePic.style.display = 'block';
        if (currentUser.name === 'nayr') {
            profilePic.src = 'nayrProfile.png';
        } else if (currentUser.name === 'maru') {
            profilePic.src = 'moocow.png';
        } else {
            profilePic.src = 'default-profile.png'; 
        }
    }

    // Add New Winner
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('winner-name').value;
        const amount = document.getElementById('vbucks-amount').value;
        
        winners.push({ 
            id: Date.now(), 
            name, 
            amount: parseInt(amount), 
            claimed: false 
        });
        
        renderWinners();
        form.reset();
    });

    // Button Logic: +500, +1000, +2000
    window.quickAdd = (val) => {
        const input = document.getElementById('vbucks-amount');
        input.value = (parseInt(input.value) || 0) + val;
    };

    // Button Logic: Clear Field
    window.clearVbucks = () => {
        document.getElementById('vbucks-amount').value = '';
    };

    // Button Logic: Toggle "Sent" status
    window.toggleClaim = (id) => {
        const idx = winners.findIndex(w => w.id === id);
        winners[idx].claimed = !winners[idx].claimed;
        renderWinners();
    };

    // Logout Logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('vbuck_user');
        window.location.reload();
    });

    function renderWinners() {
        if (winners.length === 0) {
            prizeList.innerHTML = '<p class="loading-text">No winners recorded yet.</p>';
            return;
        }

        prizeList.innerHTML = '';
        winners.forEach(w => {
            const item = document.createElement('div');
            item.className = `prize-item ${w.claimed ? 'claimed' : ''}`;
            item.innerHTML = `
                <div>
                    <strong>${w.name}</strong><br>
                    <span class="vbucks-display">${w.amount.toLocaleString()} V-Bucks</span>
                </div>
                ${isLogged ? `
                    <button onclick="toggleClaim(${w.id})" class="form-button" 
                            style="background: ${w.claimed ? '#555' : 'var(--vbuck-green)'}">
                        ${w.claimed ? 'Sent' : 'Mark Sent'}
                    </button>
                ` : ''}
            `;
            prizeList.appendChild(item);
        });
    }
});