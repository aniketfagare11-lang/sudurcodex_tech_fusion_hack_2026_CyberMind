
// nav scroll 
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });
}

// sidebar mobile
const mobileSidebarBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
if (mobileSidebarBtn && sidebar) {
    mobileSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileSidebarBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const group = this.closest('.filter-bar');
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterTournaments(this.dataset.filter);
    });
});

function filterTournaments(filter) {
    const cards = document.querySelectorAll('.tournament-card[data-status]');
    cards.forEach(card => {
        if (!filter || filter === 'all') {
            card.closest('.tournament-card-wrap')?.style && (card.closest('.tournament-card-wrap').style.display = '');
            card.style.display = '';
        } else {
            const show = card.dataset.status === filter || card.dataset.game === filter;
            card.style.display = show ? '' : 'none';
        }
    });
}

// join tournament modal
function openJoinModal(name, fee) {
    const modal = document.getElementById('joinModal');
    if (!modal) return;
    document.getElementById('modalTournamentName').textContent = name;
    document.getElementById('modalEntryFee').textContent = fee;
    modal.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

// close modal on backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
        if (e.target === this) this.classList.remove('active');
    });
});

// invite player
function invitePlayer(name) {
    showNotification(`🎮 Invite sent to ${name}!`);
}

// notification toast
function showNotification(message) {
    let notif = document.querySelector('.notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.className = 'notification';
        notif.innerHTML = `<span class="notification-icon">✅</span><span class="notification-text"></span>`;
        document.body.appendChild(notif);
    }
    notif.querySelector('.notification-text').textContent = message;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3500);
}

// profile form
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showNotification('✨ Profile updated successfully!');
    });
}

// confirm join
function confirmJoin() {
    closeModal('joinModal');
    setTimeout(() => showNotification('🏆 You joined the tournament! Good luck!'), 300);
}

// animated counter
function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const from = 0;
    const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(from + (target - from) * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// animate stat counters on page load
window.addEventListener('load', () => {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounter(el, target);
                observer.disconnect();
            }
        });
        observer.observe(el);
    });
});

// active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// parallax hero
const heroOrbs = document.querySelectorAll('.hero-orb');
if (heroOrbs.length) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroOrbs.forEach((orb, i) => {
            const factor = (i + 1) * 0.5;
            orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
}

// squad modal
function openSquadModal(playerName, game) {
    const modal = document.getElementById('squadModal');
    if (!modal) return;
    document.getElementById('squadModalPlayerName').textContent = playerName;
    const gameEl = document.getElementById('squadModalGame');
    if (gameEl) gameEl.textContent = game || 'Unknown Game';
    modal.classList.add('active');
}

function acceptSquadInvite() {
    const playerName = document.getElementById('squadModalPlayerName')?.textContent || 'Player';
    closeModal('squadModal');
    setTimeout(() => showNotification(`⚔️ ${playerName} invited to your squad!`), 300);
}

// game select modal
function selectGame(gameName, icon) {
    const modal = document.getElementById('gameModal');
    if (!modal) return;
    const iconEl = document.getElementById('gameModalIcon');
    const titleEl = document.getElementById('gameModalTitle');
    const nameEl = document.getElementById('gameModalName');
    if (iconEl) iconEl.textContent = icon || '🎮';
    if (titleEl) titleEl.textContent = `${gameName} Selected`;
    if (nameEl) nameEl.textContent = gameName;
    modal.classList.add('active');
}

// player search & filter
let currentGameFilter = 'all';

function filterPlayers(query) {

    const clearBtn = document.getElementById('searchClear');
    if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.player-full-card');
    let visible = 0;

    cards.forEach(card => {

        const name = (card.dataset.name || '').toLowerCase();
        const game = (card.dataset.game || '').toLowerCase();
        const rank = (card.dataset.rank || '').toLowerCase();

        const nameElement = card.querySelector('.pfc-name');

        const matchesSearch = !q || name.includes(q) || game.includes(q) || rank.includes(q);
        const matchesGame = currentGameFilter === 'all' || game === currentGameFilter;

        const show = matchesSearch && matchesGame;

        card.style.display = show ? '' : 'none';

        if (show && nameElement) {
            highlightText(nameElement, q);
        }

        if (show) visible++;
    });

    const noResults = document.getElementById('noResults');

    if (noResults) noResults.style.display = visible === 0 ? 'flex' : 'none';
    if (noResults && visible === 0) noResults.style.flexDirection = 'column';
    if (noResults && visible === 0) noResults.style.alignItems = 'center';
}

function filterByGame(game, btn) {

    currentGameFilter = game;

    document.querySelectorAll('.pill-btn').forEach(b =>
        b.classList.remove('pill-active')
    );

    if (btn) btn.classList.add('pill-active');

    const searchInput = document.getElementById('playerSearchInput');
    filterPlayers(searchInput ? searchInput.value : '');
}

function clearSearch() {

    const input = document.getElementById('playerSearchInput');
    if (input) {
        input.value = '';
        input.focus();
    }

    const clearBtn = document.getElementById('searchClear');
    if (clearBtn) clearBtn.style.display = 'none';

    filterPlayers('');
}

function highlightText(element, searchTerm) {

    const text = element.textContent;

    if (searchTerm === "") {
        element.innerHTML = text;
        return;
    }

    const regex = new RegExp(`(${searchTerm})`, "gi");

    element.innerHTML = text.replace(regex, "<span class='highlight'>$1</span>");
}

function showToast() {
    const toast = document.getElementById("toast");

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

