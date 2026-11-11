const STYLES = ['./styles/style3.css', './styles/style1.css', './styles/style2.css'];

function currentStyleIndex() {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === null) return 0;
        const savedIndex = STYLES.indexOf(savedTheme);
        return savedIndex >= 0 ? savedIndex : 0;
    } catch {
        return 0;
    }
}

function setStyleSheet(href) {
    document.getElementById('stylesheet').setAttribute('href', href);
    const xbox = href === STYLES[0];
    document.documentElement.classList.toggle('xbox-theme', xbox);
    document.querySelectorAll('[data-dashboard]').forEach(node => { node.hidden = !xbox; });
    if (!xbox) document.querySelector('.xbox-profile[open]')?.close();
}

function toggleStyleSheet() {
    const current = STYLES.indexOf(document.getElementById('stylesheet').getAttribute('href'));
    const next = STYLES[(current + 1) % STYLES.length];
    try { localStorage.setItem('theme', next); } catch { /* Works without persistence. */ }
    setStyleSheet(next);
}

/* Identity and the button bar repeat on every page, so they are mounted here.
   Blade copy and the home tiles live in index.html. */
function mountXboxChrome() {
    if (!document.querySelector('.xbox-identity')) {
        const identity = document.createElement('div');
        identity.dataset.dashboard = '';
        identity.className = 'xbox-identity';
        identity.innerHTML = '<span>DunsinK<small>Computer Science · Texas A&amp;M</small></span><img src="./LinkedInPFP.jpg" alt="Dunsin Komolafe"><span class="xbox-orb" aria-label="Xbox 360 inspired theme">X</span>';
        document.body.append(identity);
    }
    if (!document.querySelector('.xbox-footer')) {
        const footer = document.createElement('footer');
        footer.dataset.dashboard = '';
        footer.className = 'xbox-footer';
        footer.innerHTML = '<span><b class="pad-key key-a">A</b> Select <span class="keyboard-hint">/ Enter</span></span><a href="./index.html"><b class="pad-key key-b">B</b> Home</a><button type="button"><b class="pad-key key-y">Y</b> Change style</button><span class="xbox-footer-help">Arrow keys to explore</span><span class="xbox-wordmark">XBOX <strong>360</strong></span>';
        footer.querySelector('button').addEventListener('click', toggleStyleSheet);
        document.body.append(footer);
    }
}

let shiftXboxView = null;

function setupXboxDashboard(dashboard) {
    const panels = [...dashboard.querySelectorAll(':scope > .xbox-view')];
    const viewNames = ['home', ...panels.map(panel => panel.dataset.view)];
    const viewLabels = ['Home', ...panels.map(panel => panel.getAttribute('aria-label') || panel.dataset.view)];
    const homeElements = [...dashboard.children].filter(element => !element.classList.contains('xbox-view'));
    let currentView = 0;

    const neighborCopy = (button, label, direction) => {
        button.setAttribute('aria-label', `Go to ${label}`);
        const span = button.querySelector('span');
        if (span) span.textContent = direction === 'prev' ? `‹ ${label}` : `${label} ›`;
        const strong = button.querySelector('strong');
        if (strong) strong.textContent = label;
        const tiles = button.querySelectorAll('div');
        if (tiles.length === 1) tiles[0].textContent = label;
    };

    panels.forEach((panel, index) => {
        if (panel.querySelector('.view-neighbor')) return;
        const viewIndex = index + 1;
        const previousIndex = (viewIndex - 1 + viewNames.length) % viewNames.length;
        const nextIndex = (viewIndex + 1) % viewNames.length;
        panel.insertAdjacentHTML('afterbegin', `
            <button class="view-neighbor view-neighbor-left" type="button" data-neighbor-index="${previousIndex}">
                <span></span>
                <strong></strong>
            </button>
            <button class="view-neighbor view-neighbor-right" type="button" data-neighbor-index="${nextIndex}">
                <span></span>
                <strong></strong>
            </button>`);
        neighborCopy(panel.querySelector('.view-neighbor-left'), viewLabels[previousIndex], 'prev');
        neighborCopy(panel.querySelector('.view-neighbor-right'), viewLabels[nextIndex], 'next');
    });

    const previousHome = dashboard.querySelector('[data-home-neighbor="prev"]');
    const nextHome = dashboard.querySelector('[data-home-neighbor="next"]');
    if (previousHome) neighborCopy(previousHome, viewLabels[viewNames.length - 1], 'prev');
    if (nextHome) neighborCopy(nextHome, viewLabels[1], 'next');

    const setView = (nextView, focus = true) => {
        currentView = (nextView + viewNames.length) % viewNames.length;
        dashboard.dataset.view = viewNames[currentView];
        const onHome = currentView === 0;
        homeElements.forEach(element => {
            element.style.transform = onHome ? 'translateX(0)' : 'translateX(-110%)';
            element.style.opacity = onHome ? '1' : '0';
            element.style.pointerEvents = onHome ? '' : 'none';
        });
        panels.forEach((panel, index) => {
            const offset = (index + 1) - currentView;
            const active = offset === 0;
            panel.style.transform = `translateX(${offset * 110}%)`;
            panel.style.opacity = active ? '1' : '0';
            panel.style.pointerEvents = active ? 'auto' : 'none';
        });
        if (focus) {
            const target = onHome
                ? dashboard.querySelector('.tile-profile')
                : panels[currentView - 1].querySelector('button, a');
            target?.focus();
        }
    };

    previousHome?.addEventListener('click', () => setView(viewNames.length - 1));
    nextHome?.addEventListener('click', () => setView(1));
    dashboard.querySelectorAll('[data-neighbor-index]').forEach(button => {
        button.addEventListener('click', () => setView(Number(button.dataset.neighborIndex)));
    });
    dashboard.querySelectorAll('[data-view-prev]').forEach(button => {
        button.addEventListener('click', () => setView(currentView - 1));
    });
    dashboard.querySelectorAll('[data-view-next]').forEach(button => {
        button.addEventListener('click', () => setView(currentView + 1));
    });
    dashboard.querySelector('.social-back')?.addEventListener('click', () => setView(0));
    shiftXboxView = delta => setView(currentView + delta);

    const gamesPanel = dashboard.querySelector('.view-games');
    if (gamesPanel) setupAlanWake(gamesPanel);

    setView(0, false);

    const profile = document.createElement('dialog');
    profile.className = 'xbox-profile';
    profile.setAttribute('aria-label', 'About Dunsin Komolafe');
    const close = document.createElement('button');
    close.className = 'profile-close';
    close.textContent = 'B · Back to dashboard';
    close.addEventListener('click', () => profile.close());
    const content = document.createElement('div');
    content.innerHTML = document.querySelector('#home').innerHTML;
    profile.append(close, content);
    document.body.append(profile);
    dashboard.querySelector('.tile-profile')?.addEventListener('click', () => profile.showModal());
}

function setupAlanWake(gamesPanel) {
    const alanLaunch = gamesPanel.querySelector('.alan-launch');
    const alanGame = gamesPanel.querySelector('.alan-game');
    if (!alanLaunch || !alanGame || typeof createAlanWakeGame !== 'function') return;
    const alanStart = alanGame.querySelector('.alan-start');
    const alanStage = alanGame.querySelector('.alan-stage');
    const alanStatus = alanGame.querySelector('.alan-status');
    const alanLoading = alanGame.querySelector('.alan-loading');
    let alanCleanup = null;
    const loadThree = () => new Promise((resolve, reject) => {
        if (window.THREE) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Three.js could not be loaded.'));
        document.head.append(script);
    });
    const startAlanWake = async () => {
        alanStart.disabled = true;
        alanStatus.textContent = 'Loading Three.js…';
        try {
            await loadThree();
            alanLoading.hidden = true;
            alanStage.hidden = false;
            alanCleanup = createAlanWakeGame(alanStage, alanGame);
        } catch (error) {
            alanStart.disabled = false;
            alanStatus.textContent = 'The game could not load. Check your connection and try again.';
            console.error(error);
        }
    };
    alanLaunch.addEventListener('click', () => {
        alanLaunch.hidden = true;
        alanGame.classList.add('is-open');
        alanStart.focus();
    });
    alanStart.addEventListener('click', startAlanWake);
    alanGame.querySelector('.alan-exit').addEventListener('click', () => {
        alanCleanup?.();
        alanCleanup = null;
        alanStage.hidden = true;
        alanLoading.hidden = false;
        alanStart.disabled = false;
        alanStatus.textContent = '';
        alanGame.classList.remove('is-open');
        alanLaunch.hidden = false;
        alanLaunch.focus();
    });
}

function moveXboxFocus(event) {
    const tiles = [...document.querySelectorAll('.xbox-tile, .project-card, nav a, nav button')].filter(el => el.getClientRects().length);
    const active = document.activeElement;
    if (!tiles.includes(active)) {
        (document.querySelector('.tile-profile') || tiles[0])?.focus();
        event.preventDefault();
        return;
    }
    const box = active.getBoundingClientRect();
    const x = box.left + box.width / 2, y = box.top + box.height / 2;
    const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    const sign = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    const candidates = tiles.filter(el => el !== active && (!active.matches('.xbox-tile') || el.matches('.xbox-tile'))).map(el => {
        const rect = el.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - x, dy = rect.top + rect.height / 2 - y;
        return { el, forward: (horizontal ? dx : dy) * sign, sideways: Math.abs(horizontal ? dy : dx) };
    }).filter(item => item.forward > 1).sort((a, b) => (a.forward + a.sideways * 3) - (b.forward + b.sideways * 3));
    candidates[0]?.el.focus();
    event.preventDefault();
}

function onXboxKeydown(event) {
    if (!document.documentElement.classList.contains('xbox-theme') || document.querySelector('dialog[open]') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!event.key.startsWith('Arrow') || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const dashboard = document.querySelector('.xbox-dashboard');
    if (shiftXboxView && dashboard && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        shiftXboxView(event.key === 'ArrowRight' ? 1 : -1);
        event.preventDefault();
        return;
    }
    moveXboxFocus(event);
}

function initializeDashboard() {
    if (!document.querySelector('nav .container')) return;
    mountXboxChrome();
    const dashboard = document.querySelector('.xbox-dashboard');
    if (dashboard) setupXboxDashboard(dashboard);
    document.addEventListener('keydown', onXboxKeydown);
    setStyleSheet(document.getElementById('stylesheet').getAttribute('href'));
}

setStyleSheet(STYLES[currentStyleIndex()]);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeDashboard);
else initializeDashboard();
