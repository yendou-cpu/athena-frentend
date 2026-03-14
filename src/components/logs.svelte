    <script>
        const BASE_URL = "https://main-athena-api.onrender.com/api";
        const token    = localStorage.getItem("token");
        const user     = JSON.parse(localStorage.getItem("user") || "{}");
        const headers  = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

        let pageActive  = "logs";
        let menuVisible = false;
        let sidebarOpen = false;

        function toggleMenu()    { menuVisible = !menuVisible; }
        function toggleSidebar() { sidebarOpen = !sidebarOpen; }
        function logout() {
            menuVisible = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "#/connexion";
        }

        const menus = [
            { id:"tableau-de-bord", label:"Tableau de Bord", hash:"#/acceuil",    icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>` },
            { id:"produits",        label:"Produits",        hash:"#/produits",   icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" stroke-width="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2"/></svg>` },
            { id:"ventes",          label:"Ventes",          hash:"#/ventes",     icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
            { id:"clients",         label:"Caissier",        hash:"#/caissier",   icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
            { id:"stock",           label:"Stock",           hash:"#/stock",      icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
            { id:"rapports",        label:"Rapports",        hash:"#/rapports",   icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
            { id:"logs",            label:"Logs",            hash:"#/logs",       icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
            { id:"parametres",      label:"Paramètres",      hash:"#/parametres", icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
        ];

        function navigate(hash, id) { window.location.href = hash; pageActive = id; sidebarOpen = false; }

        // ═══════════════════════════════════════════════════════════
        // LOGS
        // ═══════════════════════════════════════════════════════════
        let chargement = true;
        let erreur     = "";
        let logs       = [];

        // Filtres
        let recherche      = "";
        let filtreAction   = "tout";
        let filtreUser     = "tout";
        let filtreDate     = "";  // YYYY-MM-DD

        // Types d'actions détectés dynamiquement
        $: actionsUniques = ["tout", ...new Set(logs.map(l => typeAction(l.action)))];
        $: usersUniques   = ["tout", ...new Set(logs.map(l => l.utilisateur_nom || "Système"))];

        // Filtrage réactif
        $: logsFiltres = logs.filter(l => {
            const matchAction = filtreAction === "tout" || typeAction(l.action) === filtreAction;
            const matchUser   = filtreUser   === "tout" || (l.utilisateur_nom || "Système") === filtreUser;
            const matchDate   = !filtreDate  || formatDateOnly(l.date) === filtreDate;
            const q           = recherche.toLowerCase();
            const matchSearch = !q || (l.action||"").toLowerCase().includes(q)
                                || (l.details||"").toLowerCase().includes(q)
                                || (l.utilisateur_nom||"").toLowerCase().includes(q);
            return matchAction && matchUser && matchDate && matchSearch;
        });

        async function charger() {
            chargement = true; erreur = "";
            try {
                const res = await fetch(`${BASE_URL}/logs`, { headers });
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                logs = await res.json();
            } catch(e) {
                erreur = e.message;
            } finally {
                chargement = false;
            }
        }

        charger();

        // ── Helpers ──────────────────────────────────────────────
        function typeAction(action) {
            if (!action) return "autre";
            const a = action.toUpperCase();
            if (a.includes("LOGIN"))   return "connexion";
            if (a.includes("LOGOUT"))  return "déconnexion";
            if (a.includes("VENTE"))   return "vente";
            if (a.includes("PRODUIT")) return "produit";
            if (a.includes("STOCK"))   return "stock";
            if (a.includes("USER") || a.includes("UTILISATEUR") || a.includes("CAISSIER")) return "utilisateur";
            return "autre";
        }

        function badgeAction(action) {
            const t = typeAction(action);
            const map = {
                connexion:    { label:"Connexion",    cls:"badge-blue"   },
                déconnexion:  { label:"Déconnexion",  cls:"badge-gray"   },
                vente:        { label:"Vente",         cls:"badge-green"  },
                produit:      { label:"Produit",       cls:"badge-orange" },
                stock:        { label:"Stock",         cls:"badge-yellow" },
                utilisateur:  { label:"Utilisateur",  cls:"badge-purple" },
                autre:        { label:"Autre",         cls:"badge-gray"   },
            };
            return map[t] || map.autre;
        }

        function initiales(nom) {
            if (!nom || nom === "Système") return "SY";
            return nom.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        }

        function formatDate(d) {
            if (!d) return "—";
            const date = new Date(d);
            if (isNaN(date)) return "—";
            return date.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })
                + ' ' + date.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
        }

        function formatDateOnly(d) {
            if (!d) return "";
            return new Date(d).toISOString().slice(0, 10);
        }

        function labelAction(type) {
            const map = { connexion:"Connexions", déconnexion:"Déconnexions", vente:"Ventes", produit:"Produits", stock:"Stock", utilisateur:"Utilisateurs", tout:"Toutes", autre:"Autres" };
            return map[type] || type;
        }

        function resetFiltres() {
            recherche = ""; filtreAction = "tout"; filtreUser = "tout"; filtreDate = "";
        }

        $: hasFiltres = recherche || filtreAction !== "tout" || filtreUser !== "tout" || filtreDate;
    </script>

    {#if sidebarOpen}
        <button class="sidebar-overlay" on:click={() => sidebarOpen = false} aria-label="Fermer le menu"></button>
    {/if}

    <div class="app-shell">
        <aside class="sidebar" class:open={sidebarOpen}>
            <div class="sidebar-brand">
                <div class="logo-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span class="brand-label">ATHENA</span>
                <button class="sidebar-close" on:click={() => sidebarOpen = false} aria-label="Fermer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
            </div>
            <nav class="sidebar-nav">
                {#each menus as item}
                    <button class="nav-item" class:active={pageActive === item.id} on:click={() => navigate(item.hash, item.id)}>
                        <span class="nav-icon">{@html item.icon}</span>
                        <span class="nav-label">{item.label}</span>
                    </button>
                {/each}
            </nav>
            <div class="sidebar-footer"><p>© 2026 – ATHENA Gestion</p></div>
        </aside>

        <div class="main-area">
            <nav class="navbar">
                <button class="burger" on:click={toggleSidebar} aria-label="Menu">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <line x1="3" y1="6" x2="21" y2="6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <line x1="3" y1="12" x2="21" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <line x1="3" y1="18" x2="21" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="nav-brand"><span class="brand-text"><strong>Logs</strong></span></div>
                <div class="nav-actions">
                    <div class="user-menu" on:click={toggleMenu} on:keypress={toggleMenu} role="button" tabindex="0">
                        <div class="avatar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <span class="user-name">{user.nom || "Admin"}</span>
                        <svg class="chevron" class:rotated={menuVisible} width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                {#if menuVisible}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="dropdown" on:click|stopPropagation on:keypress|stopPropagation role="menu" tabindex="-1">
                        <a href="#/parametres" class="dropdown-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                            Paramètres
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item logout" on:click={logout}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            Se déconnecter
                        </button>
                    </div>
                {/if}
            </nav>

            <main class="page-content">
                <div class="logs-page">

                    <div class="page-header">
                        <div>
                            <h1>Logs d'activité</h1>
                            <p class="page-sub">Historique complet des actions sur votre boutique</p>
                        </div>
                        <button class="btn-refresh" on:click={charger}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Actualiser
                        </button>
                    </div>

                    {#if erreur}
                        <div class="alert-error">{erreur}</div>
                    {/if}

                    <!-- Barre de filtres -->
                    <div class="filtres-bar">
                        <div class="search-wrap">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="#9ca3af" stroke-width="2"/>
                                <path d="m21 21-4.35-4.35" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <input type="text" bind:value={recherche} placeholder="Rechercher dans les logs…" class="search-input" />
                            {#if recherche}
                                <button class="clear-btn" on:click={() => recherche = ""} aria-label="Effacer">✕</button>
                            {/if}
                        </div>

                        <select bind:value={filtreAction} class="filtre-select">
                            {#each actionsUniques as a}
                                <option value={a}>{labelAction(a)}</option>
                            {/each}
                        </select>

                        <select bind:value={filtreUser} class="filtre-select">
                            <option value="tout">Tous les utilisateurs</option>
                            {#each usersUniques.filter(u => u !== "tout") as u}
                                <option value={u}>{u}</option>
                            {/each}
                        </select>

                        <input type="date" bind:value={filtreDate} class="filtre-date" title="Filtrer par date" />

                        {#if hasFiltres}
                            <button class="btn-reset" on:click={resetFiltres}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                Réinitialiser
                            </button>
                        {/if}
                    </div>

                    <!-- Compteur -->
                    {#if !chargement}
                        <div class="count-bar">
                            <span class="count-txt">
                                <strong>{logsFiltres.length}</strong> log{logsFiltres.length > 1 ? 's' : ''}
                                {#if hasFiltres} sur {logs.length} au total{/if}
                            </span>
                            {#if hasFiltres}
                                <span class="count-badge">Filtre actif</span>
                            {/if}
                        </div>
                    {/if}

                    <!-- Liste -->
                    {#if chargement}
                        <div class="logs-list">
                            {#each [1,2,3,4,5,6] as _}
                                <div class="log-row skeleton-row"></div>
                            {/each}
                        </div>
                    {:else if logsFiltres.length === 0}
                        <div class="empty-state">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <line x1="8" y1="6" x2="21" y2="6" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
                                <line x1="8" y1="12" x2="21" y2="12" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
                                <line x1="8" y1="18" x2="21" y2="18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
                                <line x1="3" y1="6" x2="3.01" y2="6" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
                                <line x1="3" y1="12" x2="3.01" y2="12" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
                                <line x1="3" y1="18" x2="3.01" y2="18" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <p>{hasFiltres ? "Aucun log ne correspond aux filtres." : "Aucun log disponible."}</p>
                            {#if hasFiltres}
                                <button class="btn-reset" on:click={resetFiltres}>Réinitialiser les filtres</button>
                            {/if}
                        </div>
                    {:else}
                        <div class="logs-list">
                            {#each logsFiltres as l}
                                {@const badge = badgeAction(l.action)}
                                <div class="log-row">
                                    <div class="log-avatar">{initiales(l.utilisateur_nom)}</div>
                                    <div class="log-main">
                                        <div class="log-top">
                                            <span class="log-user">{l.utilisateur_nom || "Système"}</span>
                                            {#if l.utilisateur_role}
                                                <span class="log-role">{l.utilisateur_role}</span>
                                            {/if}
                                            <span class="log-badge {badge.cls}">{badge.label}</span>
                                        </div>
                                        <p class="log-action">{l.action}</p>
                                        {#if l.details}
                                            <p class="log-details">{l.details}</p>
                                        {/if}
                                    </div>
                                    <div class="log-date">{formatDate(l.date)}</div>
                                </div>
                            {/each}
                        </div>
                    {/if}

                </div>
            </main>
        </div>
    </div>

    {#if menuVisible}
        <button class="overlay" on:click={() => menuVisible = false} aria-label="Fermer"></button>
    {/if}

    <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
    :global(body) { font-family:'Sora',sans-serif; background:#f1f5f9; overflow:hidden; }
    :global(:root) { --sidebar-w:230px; --navbar-h:60px; --shadow-sm:0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04); --shadow-md:0 4px 16px rgba(0,0,0,0.08); --shadow-lg:0 10px 40px rgba(0,0,0,0.14); --radius:14px; }
    .app-shell { display:flex; height:100vh; width:100vw; overflow:hidden; background:#f1f5f9; }

    /* SIDEBAR */
    .sidebar { width:var(--sidebar-w); min-height:100vh; background:#0f172a; display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,0.05); flex-shrink:0; z-index:100; transition:transform 0.28s cubic-bezier(.4,0,.2,1); }
    .sidebar-brand { display:flex; align-items:center; gap:0.65rem; padding:0 1rem; height:var(--navbar-h); border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
    .logo-icon { width:30px; height:30px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 10px rgba(59,130,246,0.4); }
    .brand-label { color:#fff; font-size:0.92rem; font-weight:700; letter-spacing:0.04em; white-space:nowrap; flex:1; }
    .sidebar-close { display:none; background:none; border:none; color:#64748b; cursor:pointer; padding:4px; border-radius:6px; margin-left:auto; }
    .sidebar-nav { flex:1; padding:0.8rem 0.55rem; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
    .nav-item { display:flex; align-items:center; gap:0.7rem; padding:0.6rem 0.8rem; border-radius:10px; border:none; background:none; cursor:pointer; width:100%; text-align:left; color:#64748b; font-family:'Sora',sans-serif; font-size:0.83rem; font-weight:400; transition:background 0.15s,color 0.15s; }
    .nav-item:hover { background:rgba(255,255,255,0.06); color:#e2e8f0; }
    .nav-item.active { background:#1d4ed8; color:#fff; font-weight:600; box-shadow:0 2px 12px rgba(29,78,216,0.4); }
    .nav-icon { display:flex; align-items:center; flex-shrink:0; width:18px; height:18px; }
    .nav-label { white-space:nowrap; }
    .sidebar-footer { padding:0.85rem 1.2rem; border-top:1px solid rgba(255,255,255,0.06); color:#334155; font-size:0.68rem; text-align:center; }

    /* MAIN */
    .main-area { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
    .navbar { height:var(--navbar-h); background:#0f172a; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; gap:0.75rem; padding:0 1.25rem; flex-shrink:0; position:relative; box-shadow:0 2px 16px rgba(0,0,0,0.25); z-index:50; }
    .burger { display:none; background:none; border:none; cursor:pointer; padding:6px; border-radius:8px; flex-shrink:0; }
    .burger:hover { background:rgba(255,255,255,0.1); }
    .nav-brand { flex:1; }
    .brand-text { color:rgba(255,255,255,0.7); font-size:0.87rem; }
    .brand-text strong { color:#fff; font-weight:700; }
    .nav-actions { display:flex; align-items:center; }
    .user-menu { display:flex; align-items:center; gap:0.5rem; padding:0 0.7rem; height:36px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.08); border-radius:10px; cursor:pointer; user-select:none; transition:background 0.2s; white-space:nowrap; }
    .user-menu:hover { background:rgba(255,255,255,0.12); }
    .avatar { width:24px; height:24px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .user-name { color:rgba(255,255,255,0.82); font-size:0.81rem; font-weight:500; }
    .chevron { transition:transform 0.2s; flex-shrink:0; }
    .chevron.rotated { transform:rotate(180deg); }
    .dropdown { position:absolute; top:calc(var(--navbar-h)+8px); right:1.25rem; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:0.35rem; min-width:180px; box-shadow:var(--shadow-lg); z-index:200; animation:fadeDown 0.15s ease; }
    @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)} }
    .dropdown-item { display:flex; align-items:center; gap:0.6rem; padding:0.58rem 0.75rem; border-radius:8px; color:#334155; font-size:0.83rem; font-family:'Sora',sans-serif; text-decoration:none; cursor:pointer; transition:background 0.15s; border:none; background:none; width:100%; text-align:left; }
    .dropdown-item:hover { background:#f1f5f9; color:#0f172a; }
    .dropdown-item.logout { color:#dc2626; }
    .dropdown-item.logout:hover { background:#fef2f2; }
    .dropdown-divider { height:1px; background:#e2e8f0; margin:0.3rem 0; }
    .overlay { position:fixed; inset:0; z-index:150; background:transparent; border:none; cursor:default; padding:0; }
    .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:90; backdrop-filter:blur(2px); border:none; cursor:pointer; padding:0; }

    /* PAGE */
    .page-content { flex:1; overflow-y:auto; padding:1.5rem; background:#f1f5f9; }
    .logs-page { display:flex; flex-direction:column; gap:1.1rem; }
    .page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
    .page-header h1 { font-size:1.3rem; font-weight:700; color:#0f172a; }
    .page-sub { color:#64748b; font-size:0.81rem; margin-top:0.2rem; }
    .btn-refresh { display:flex; align-items:center; gap:0.45rem; padding:0.5rem 1rem; background:#fff; border:1px solid #e2e8f0; border-radius:10px; color:#334155; font-size:0.81rem; cursor:pointer; font-family:'Sora',sans-serif; font-weight:500; box-shadow:var(--shadow-sm); white-space:nowrap; transition:all 0.2s; }
    .btn-refresh:hover { background:#0f172a; color:#fff; border-color:#0f172a; transform:translateY(-1px); }
    .alert-error { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; padding:0.75rem 1rem; border-radius:10px; font-size:0.83rem; }

    /* FILTRES */
    .filtres-bar { display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:0.75rem 1rem; box-shadow:var(--shadow-sm); }
    .search-wrap { display:flex; align-items:center; gap:0.5rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; padding:0 0.75rem; height:36px; flex:1; min-width:180px; transition:border-color 0.2s; }
    .search-wrap:focus-within { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
    .search-input { background:none; border:none; outline:none; font-family:'Sora',sans-serif; font-size:0.83rem; color:#0f172a; width:100%; }
    .search-input::placeholder { color:#9ca3af; }
    .clear-btn { background:none; border:none; cursor:pointer; color:#9ca3af; font-size:0.75rem; padding:0; line-height:1; }
    .clear-btn:hover { color:#334155; }
    .filtre-select { height:36px; padding:0 0.75rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; font-family:'Sora',sans-serif; font-size:0.81rem; color:#334155; cursor:pointer; outline:none; transition:border-color 0.2s; appearance:none; background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 0.6rem center; padding-right:1.8rem; }
    .filtre-select:focus { border-color:#3b82f6; }
    .filtre-date { height:36px; padding:0 0.75rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; font-family:'Sora',sans-serif; font-size:0.81rem; color:#334155; cursor:pointer; outline:none; transition:border-color 0.2s; }
    .filtre-date:focus { border-color:#3b82f6; }
    .btn-reset { display:flex; align-items:center; gap:5px; padding:0.38rem 0.8rem; background:#fef2f2; color:#dc2626; border:1px solid #fecaca; border-radius:8px; font-family:'Sora',sans-serif; font-size:0.75rem; font-weight:600; cursor:pointer; white-space:nowrap; transition:all 0.15s; }
    .btn-reset:hover { background:#fee2e2; }

    /* COMPTEUR */
    .count-bar { display:flex; align-items:center; gap:0.6rem; }
    .count-txt { font-size:0.81rem; color:#64748b; }
    .count-txt strong { color:#0f172a; }
    .count-badge { font-size:0.68rem; font-weight:700; background:#eff6ff; color:#2563eb; padding:0.18rem 0.55rem; border-radius:20px; border:1px solid #bfdbfe; }

    /* LOGS LIST */
    .logs-list { display:flex; flex-direction:column; gap:0.5rem; }
    .log-row { display:flex; align-items:flex-start; gap:0.9rem; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:0.9rem 1rem; box-shadow:var(--shadow-sm); transition:box-shadow 0.15s,transform 0.15s; }
    .log-row:hover { box-shadow:var(--shadow-md); transform:translateY(-1px); }

    .skeleton-row { height:72px; background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:12px; }
    @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

    .log-avatar { width:36px; height:36px; background:linear-gradient(135deg,#1e40af,#3b82f6); border-radius:9px; display:grid; place-items:center; font-size:0.72rem; font-weight:700; color:#fff; flex-shrink:0; }
    .log-main { flex:1; min-width:0; }
    .log-top { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.3rem; }
    .log-user { font-size:0.83rem; font-weight:700; color:#0f172a; }
    .log-role { font-size:0.65rem; font-weight:600; background:#f1f5f9; color:#64748b; padding:0.12rem 0.45rem; border-radius:20px; text-transform:capitalize; }
    .log-action { font-size:0.8rem; color:#334155; font-weight:500; margin:0; }
    .log-details { font-size:0.74rem; color:#94a3b8; margin:0.2rem 0 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .log-date { font-size:0.71rem; color:#94a3b8; white-space:nowrap; flex-shrink:0; padding-top:0.15rem; }

    /* BADGES */
    .log-badge { font-size:0.65rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:20px; }
    .badge-blue   { background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; }
    .badge-green  { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
    .badge-orange { background:#fff7ed; color:#ea580c; border:1px solid #fed7aa; }
    .badge-yellow { background:#fefce8; color:#a16207; border:1px solid #fde68a; }
    .badge-purple { background:#f5f3ff; color:#7c3aed; border:1px solid #ddd6fe; }
    .badge-gray   { background:#f8fafc; color:#64748b; border:1px solid #e2e8f0; }

    /* EMPTY */
    .empty-state { display:flex; flex-direction:column; align-items:center; gap:0.75rem; padding:3rem 1rem; color:#94a3b8; font-size:0.82rem; background:#fff; border:1px solid #e2e8f0; border-radius:var(--radius); }

    /* RESPONSIVE */
    @media (max-width:860px) {
        .sidebar { position:fixed; top:0; left:0; bottom:0; transform:translateX(-100%); box-shadow:var(--shadow-lg); }
        .sidebar.open { transform:translateX(0); }
        .sidebar-close { display:flex; align-items:center; justify-content:center; }
        .sidebar-overlay { display:block; }
        .burger { display:flex; }
        :global(body) { overflow:auto; }
        .app-shell,.main-area { overflow:auto; }
        .page-content { overflow:visible; }
    }
    @media (max-width:640px) {
        .page-content { padding:1rem; }
        .filtres-bar { gap:0.5rem; }
        .log-date { display:none; }
        .filtre-select,.filtre-date { font-size:0.75rem; }
    }
    @media (max-width:400px) {
        .page-content { padding:0.75rem; }
        .search-wrap { min-width:120px; }
    }
    </style>