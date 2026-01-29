document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-winner-form');
    const formContainer = document.getElementById('add-winner-form-container');
    const loginLink = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-btn');
    const prizeList = document.getElementById('prize-list');
    const userIdDisplay = document.getElementById('user-id-display');

    const winners = [];

    const currentUser = JSON.parse(localStorage.getItem('vbuck_user'));
    const isLogged = !!currentUser;

    if (isLogged) {
        formContainer.style.display = 'block';
        loginLink.style.display = 'none';
        logoutBtn.style.display = 'block';
        userIdDisplay.innerText = currentUser.name;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('winner-name').value;
        const amount = document.getElementById('vbucks-amount').value;
        winners.push({ id: Date.now(), name, amount: parseInt(amount), claimed: false });
        renderWinners();
        form.reset();
    });

    window.quickAdd = (val) => {
        const input = document.getElementById('vbucks-amount');
        input.value = (parseInt(input.value) || 0) + val;
    };

    window.clearVbucks = () => {
        document.getElementById('vbucks-amount').value = '';
    };

    window.toggleClaim = (id) => {
        const idx = winners.findIndex(w => w.id === id);
        winners[idx].claimed = !winners[idx].claimed;
        renderWinners();
    };

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
                    <button onclick="toggleClaim(${w.id})" class="form-button" style="background: ${w.claimed ? '#555' : 'var(--vbuck-green)'}">
                        ${w.claimed ? 'Sent' : 'Mark Sent'}
                    </button>
                ` : ''}
            `;
            prizeList.appendChild(item);
        });
    }
});