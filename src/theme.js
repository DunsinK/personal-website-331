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
function initializeDashboard() {
    const nav = document.querySelector('nav .container');
    if (!nav) return;
    const isHome = !!document.querySelector('#home');
    const home = document.createElement('li');
    home.dataset.dashboard = '';
    home.innerHTML = `<a href="./index.html" ${isHome ? 'aria-current="page"' : ''}>home</a>`;
    nav.querySelector('ul').prepend(home);
    const identity = document.createElement('div');
    identity.dataset.dashboard = '';
    identity.className = 'xbox-identity';
    identity.innerHTML = '<span>DunsinK<small>Computer Science · Texas A&amp;M</small></span><img src="./LinkedInPFP.jpg" alt="Dunsin Komolafe"><span class="xbox-orb" aria-label="Xbox 360 inspired theme">X</span>';
    document.body.append(identity);
    const footer = document.createElement('footer');
    footer.dataset.dashboard = '';
    footer.className = 'xbox-footer';
    footer.innerHTML = '<span><b class="pad-key key-a">A</b> Select <span class="keyboard-hint">/ Enter</span></span><a href="./index.html"><b class="pad-key key-b">B</b> Home</a><button type="button"><b class="pad-key key-y">Y</b> Change style</button><span class="xbox-footer-help">Arrow keys to explore</span><span class="xbox-wordmark">XBOX <strong>360</strong></span>';
    footer.querySelector('button').addEventListener('click', toggleStyleSheet);
    document.body.append(footer);
    if (isHome) {
        const dashboard = document.createElement('main');
        dashboard.dataset.dashboard = '';
        dashboard.className = 'xbox-dashboard';
        dashboard.setAttribute('aria-label', 'Home dashboard');
        dashboard.innerHTML = `
            <button class="xbox-neighbor neighbor-left" type="button" aria-label="Open discover view"><span>discover</span><div>⌕</div></button>
            <div class="xbox-tiles">
                <a class="xbox-tile tile-agenda" href="./portfolio.html"><img src="./photos/aggie-agenda/aggieagenda_logo.jpg" alt="Aggie Agenda"><span class="tile-caption">Explore my projects</span></a>
                <a class="xbox-tile tile-pins" href="./qualifications.html"><svg class="tile-symbol" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="m30 4 14 14-5 4-5-2-8 9 1 7-4 4-7-9L5 43l-2-2 12-11-9-7 4-4 7 1 9-8-2-5z"/></svg><span class="tile-caption">My skills</span></a>
                <a class="xbox-tile tile-resume" href="./resume.html"><svg class="tile-symbol" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M24 12v13h10"/></svg><span class="tile-caption">Resume</span></a>
                <button class="xbox-tile tile-profile" type="button" aria-haspopup="dialog"><img src="./LinkedInPFP.jpg" alt=""><span class="profile-heading"><small>WELCOME TO MY PERSONAL WEBSITE</small>Dunsin<br>Komolafe<span>Developer. Student. Aggie.</span></span><span class="tile-caption">Meet Dunsin (Oluwadunsin) Komolafe <span aria-hidden="true">→</span></span></button>
                <a class="xbox-tile tile-activities" href="./activities.html"><img src="./photos/tamufate.jpg" alt="TAMU FATE"><span class="tile-caption">Life outside of class</span></a>
                <a class="xbox-tile tile-sandbox" href="./sandbox.html"><span class="sandbox-art" aria-hidden="true">{<span>play</span>}</span><span class="tile-caption">Explore the sandbox</span></a>
                <a class="xbox-tile tile-github" href="https://github.com/DunsinK" target="_blank" rel="noopener"><span class="code-art" aria-hidden="true">&lt;/&gt;</span><span class="tile-caption">GitHub · DunsinK</span></a>
                <a class="xbox-tile tile-linkedin" href="https://linkedin.com/in/dunsink" target="_blank" rel="noopener"><strong aria-hidden="true">in</strong><span class="tile-caption">Connect on LinkedIn</span></a>
                <a class="xbox-tile tile-devpost" href="https://devpost.com/DunsinK" target="_blank" rel="noopener"><strong>BUILD<br>LEARN<br>CREATE</strong><span class="tile-caption">Devpost</span></a>
            </div>
            <button class="xbox-neighbor neighbor-right" type="button" aria-label="Open social view"><span>social</span><div>Friends</div><div>Community</div></button>
            <p class="dashboard-subtitle">Computer Science at Texas A&amp;M 2028 <span>Full Stack Web Development · AI Agents · Computer Vision</span></p>
            <div class="dashboard-contact"><a href="mailto:dunsink@tamu.edu">dunsink@tamu.edu</a><span> / </span><a href="mailto:dunsinkomolafe@gmail.com">dunsinkomolafe@gmail.com</a></div>`;
        document.querySelector('#home').before(dashboard);
        const social = document.createElement('section');
        social.className = 'xbox-social-view xbox-view';
        social.dataset.view = 'social';
        social.setAttribute('aria-label', 'Social');
        social.innerHTML = `
            <button class="social-back" type="button">‹ home</button>
            <div class="social-content">
                <div class="social-menu" aria-label="Social menu">
                    <button class="social-menu-tile" type="button">Friends</button>
                    <button class="social-menu-tile is-selected" type="button">Activity Feed</button>
                    <button class="social-menu-tile" type="button">Community</button>
                </div>
                <div class="social-feature">
                    <p class="social-kicker">SOCIAL</p>
                    <h2>Activity Feed</h2>
                    <p>Connect with me and follow what I am building.</p>
                    <div class="social-links">
                        <a href="https://github.com/DunsinK" target="_blank" rel="noopener">GitHub</a>
                        <a href="https://linkedin.com/in/dunsink" target="_blank" rel="noopener">LinkedIn</a>
                        <a href="https://devpost.com/DunsinK" target="_blank" rel="noopener">Devpost</a>
                    </div>
                </div>
            </div>
            <div class="view-nav"><button type="button" data-view-prev>‹ previous</button><button type="button" data-view-next>next ›</button></div>`;
        dashboard.append(social);
        const viewDefinitions = [
            ['discover', 'Discover', 'Explore highlights from my work, interests, and experience.'],
            ['settings', 'Settings', 'Theme and dashboard settings will live here.'],
            ['games', 'Games', 'A place for interactive experiments and games.'],
            ['tv-movies', 'TV & Movies', 'A media corner for recommendations and favorites.']
        ];
        const extraViews = viewDefinitions.map(([id, title, description]) => {
            const panel = document.createElement('section');
            panel.className = `xbox-view xbox-boilerplate-view view-${id}`;
            panel.dataset.view = id;
            panel.setAttribute('aria-label', title);
            panel.innerHTML = `<div class="view-heading"><p class="social-kicker">XBOX DASHBOARD</p><h2>${title}</h2><p>${description}</p><span>Coming soon</span></div><div class="view-nav"><button type="button" data-view-prev>‹ previous</button><button type="button" data-view-next>next ›</button></div>`;
            dashboard.append(panel);
            return panel;
        });
        const panels = [social, ...extraViews];
        const viewNames = ['home', 'social', ...viewDefinitions.map(([id]) => id)];
        const homeElements = [...dashboard.children].filter(element => !element.classList.contains('xbox-view'));
        let currentView = 0;
        const setView = (nextView, focus = true) => {
            currentView = (nextView + viewNames.length) % viewNames.length;
            dashboard.dataset.view = viewNames[currentView];
            homeElements.forEach(element => {
                const isVisible = currentView === 0;
                element.style.transform = isVisible ? 'translateX(0)' : 'translateX(-110%)';
                element.style.opacity = isVisible ? '1' : '0';
                element.style.pointerEvents = isVisible ? '' : 'none';
            });
            panels.forEach((panel, index) => {
                const panelView = index + 1;
                const offset = panelView - currentView;
                panel.style.transform = `translateX(${offset * 110}%)`;
                panel.style.opacity = offset === 0 ? '1' : '0';
                panel.style.pointerEvents = offset === 0 ? 'auto' : 'none';
            });
            if (focus) {
                const target = currentView === 0
                    ? dashboard.querySelector('.tile-profile')
                    : panels[currentView - 1].querySelector('button, a');
                target?.focus();
            }
        };
        dashboard.querySelector('.neighbor-left').addEventListener('click', () => setView(viewNames.length - 1));
        dashboard.querySelector('.neighbor-right').addEventListener('click', () => setView(1));
        dashboard.querySelectorAll('[data-view-prev]').forEach(button => button.addEventListener('click', () => setView(currentView - 1)));
        dashboard.querySelectorAll('[data-view-next]').forEach(button => button.addEventListener('click', () => setView(currentView + 1)));
        social.querySelector('.social-back').addEventListener('click', () => setView(0));
        setView(0, false);
        // Preserve the original introduction as the source of truth for all themes.
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
        dashboard.querySelector('.tile-profile').addEventListener('click', () => profile.showModal());
    }
    document.addEventListener('keydown', event => {
        if (!document.documentElement.classList.contains('xbox-theme') || document.querySelector('dialog[open]') || event.altKey || event.ctrlKey || event.metaKey) return;
        if (!event.key.startsWith('Arrow') || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
        const dashboard = document.querySelector('.xbox-dashboard');
        if (dashboard && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            const viewNames = ['home', 'social', 'discover', 'settings', 'games', 'tv-movies'];
            const currentView = viewNames.indexOf(dashboard.dataset.view || 'home');
            const nextView = event.key === 'ArrowRight' ? currentView + 1 : currentView - 1;
            const nextName = viewNames[(nextView + viewNames.length) % viewNames.length];
            const target = nextName === 'home'
                ? dashboard.querySelector('.social-back')
                : currentView === 0
                    ? dashboard.querySelector(event.key === 'ArrowRight' ? '.neighbor-right' : '.neighbor-left')
                    : dashboard.querySelector(`[data-view="${viewNames[currentView]}"] [data-view-${event.key === 'ArrowRight' ? 'next' : 'prev'}]`);
            if (target) {
                target.click();
                event.preventDefault();
                return;
            }
        }
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
    });
    setStyleSheet(document.getElementById('stylesheet').getAttribute('href'));
}
setStyleSheet(STYLES[currentStyleIndex()]);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeDashboard);
else initializeDashboard();
