<script>
    // ═══════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    const BASE_URL = "https://main-athena-api.onrender.com/api";
    const token    = localStorage.getItem("token");
    const user     = JSON.parse(localStorage.getItem("user") || "{}");
    const headers  = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

    // ═══════════════════════════════════════════════════════════
    // LAYOUT
    // ═══════════════════════════════════════════════════════════
    let pageActive   = "rapports";
    let menuVisible  = false;
    let sidebarOpen  = false;

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
    // RAPPORTS
    // ═══════════════════════════════════════════════════════════
    let chargement = true;
    let erreur     = "";

    // Filtre période
    let periodeActive = "mois"; // mois | trimestre | annee | tout
    const periodes = [
        { id: "mois",      label: "Ce mois" },
        { id: "trimestre", label: "3 mois" },
        { id: "semestre",  label: "6 mois" },
        { id: "annee",     label: "Cette année" },
        { id: "tout",      label: "Tout" },
    ];

    // Données brutes
    let ventes    = [];
    let produits  = [];
    let caissiers = [];

    // Données calculées
    let caByPeriode  = [];
    let ventesParCaissier = [];
    let topProduits  = [];
    let totalCA      = 0;
    let totalVentes  = 0;
    let moyenneVente = 0;
    let meilleurJour = "";

    function getDebut(periode) {
        const now = new Date();
        if (periode === "mois")      return new Date(now.getFullYear(), now.getMonth(), 1);
        if (periode === "trimestre") return new Date(now.getFullYear(), now.getMonth() - 2, 1);
        if (periode === "semestre")  return new Date(now.getFullYear(), now.getMonth() - 5, 1);
        if (periode === "annee")     return new Date(now.getFullYear(), 0, 1);
        return new Date(0); // tout
    }

    function filtrerVentes(periode) {
        const debut = getDebut(periode);
        return ventes.filter(v => new Date(v.date_vente) >= debut);
    }

    function calculer(periode) {
        const vf = filtrerVentes(periode);

        totalCA      = vf.reduce((s, v) => s + Number(v.total || 0), 0);
        totalVentes  = vf.length;
        moyenneVente = totalVentes > 0 ? Math.round(totalCA / totalVentes) : 0;

        // Meilleur jour
        const parJour = {};
        vf.forEach(v => {
            if (!v.date_vente) return;
            const j = new Date(v.date_vente).toLocaleDateString('fr-FR', { weekday: 'long' });
            parJour[j] = (parJour[j] || 0) + Number(v.total || 0);
        });
        const entrees = Object.entries(parJour);
        meilleurJour = entrees.length > 0
            ? entrees.sort((a,b) => b[1]-a[1])[0][0]
            : "—";

        // CA par période (groupé par mois ou semaine)
        const parMois = {};
        vf.forEach(v => {
            if (!v.date_vente) return;
            const d    = new Date(v.date_vente);
            const mois = d.toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
            parMois[mois] = (parMois[mois] || 0) + Number(v.total || 0);
        });
        caByPeriode = Object.entries(parMois).map(([mois, total]) => ({ mois, total }));

        // Ventes par caissier
        const parCaissier = {};
        vf.forEach(v => {
            const nom = v.caissier_nom || `#${v.user_id}`;
            if (!parCaissier[nom]) parCaissier[nom] = { nom, ventes: 0, ca: 0 };
            parCaissier[nom].ventes++;
            parCaissier[nom].ca += Number(v.total || 0);
        });
        ventesParCaissier = Object.values(parCaissier).sort((a,b) => b.ca - a.ca);

        // Top produits via details_vente simulé depuis ventes (on utilise getTopProduits de l'API)
    }

    $: if (ventes.length >= 0) calculer(periodeActive);

    async function charger() {
        chargement = true; erreur = "";
        try {
            const [ventesRes, topRes] = await Promise.all([
                fetch(`${BASE_URL}/ventes`,                { headers }),
                fetch(`${BASE_URL}/produits/top-produits`, { headers }),
            ]);
            if (!ventesRes.ok) throw new Error(`Ventes : ${ventesRes.status}`);
            if (!topRes.ok)    throw new Error(`Top produits : ${topRes.status}`);

            ventes      = await ventesRes.json();
            topProduits = await topRes.json();
        } catch(e) {
            erreur = e.message;
        } finally {
            chargement = false;
        }
    }

    charger();

    function formatMontant(n) {
        return new Intl.NumberFormat('fr-FR').format(Number(n) || 0) + ' FCFA';
    }

    function hauteur(val, arr) {
        const max = Math.max(...arr.map(g => g.total), 1);
        return Math.max(Math.round((val / max) * 100), 4);
    }

    function initiales(nom) {
        if (!nom) return "?";
        return nom.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    function couleurCaissier(i) {
        const couleurs = ["#2563eb","#16a34a","#ea580c","#7c3aed","#0891b2","#dc2626"];
        return couleurs[i % couleurs.length];
    }
</script>

<!-- ══ Overlay sidebar mobile ══ -->
{#if sidebarOpen}
    <button class="sidebar-overlay" on:click={() => sidebarOpen = false} aria-label="Fermer le menu"></button>
{/if}

<div class="app-shell">

    <!-- ═══ SIDEBAR ═══ -->
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

    <!-- ═══ CONTENU ═══ -->
    <div class="main-area">

        <!-- NAVBAR -->
        <nav class="navbar">
            <button class="burger" on:click={toggleSidebar} aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <line x1="3" y1="6" x2="21" y2="6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="3" y1="12" x2="21" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="3" y1="18" x2="21" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <div class="nav-brand"><span class="brand-text"><strong>Rapports</strong></span></div>
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

        <!-- PAGE CONTENT -->
        <main class="page-content">
            <div class="rapports">

                <!-- En-tête -->
                <div class="page-header">
                    <div>
                        <h1>Rapports</h1>
                        <p class="page-sub">Analyse des performances de votre boutique</p>
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

                <!-- Filtre période -->
                <div class="periode-bar">
                    {#each periodes as p}
                        <button
                            class="periode-btn"
                            class:active={periodeActive === p.id}
                            on:click={() => { periodeActive = p.id; calculer(p.id); }}>
                            {p.label}
                        </button>
                    {/each}
                </div>

                {#if chargement}
                    <div class="skeletons">
                        {#each [1,2,3,4] as _}<div class="skeleton-card"></div>{/each}
                    </div>
                {:else}

                    <!-- KPI cards -->
                    <div class="kpi-grid">
                        <div class="kpi-card blue">
                            <div class="kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="kpi-info">
                                <span class="kpi-label">Chiffre d'affaires</span>
                                <span class="kpi-value">{formatMontant(totalCA)}</span>
                                <span class="kpi-sub">{totalVentes} vente{totalVentes > 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        <div class="kpi-card green">
                            <div class="kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="kpi-info">
                                <span class="kpi-label">Panier moyen</span>
                                <span class="kpi-value">{formatMontant(moyenneVente)}</span>
                                <span class="kpi-sub">par transaction</span>
                            </div>
                        </div>

                        <div class="kpi-card orange">
                            <div class="kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                                </svg>
                            </div>
                            <div class="kpi-info">
                                <span class="kpi-label">Meilleur jour</span>
                                <span class="kpi-value kpi-value-sm">{meilleurJour}</span>
                                <span class="kpi-sub">en volume de ventes</span>
                            </div>
                        </div>

                        <div class="kpi-card purple">
                            <div class="kpi-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="kpi-info">
                                <span class="kpi-label">Caissiers actifs</span>
                                <span class="kpi-value">{ventesParCaissier.length}</span>
                                <span class="kpi-sub">sur la période</span>
                            </div>
                        </div>
                    </div>

                    <!-- Graphique CA + Top produits -->
                    <div class="row-2">

                        <!-- Graphique CA par période -->
                        <div class="panel">
                            <div class="panel-header">
                                <h2 class="panel-title">Chiffre d'affaires</h2>
                                <span class="panel-badge">FCFA</span>
                            </div>
                            {#if caByPeriode.length === 0}
                                <div class="empty-state">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/><path d="M7 16l4-4 4 4 4-6" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <p>Aucune donnée sur cette période</p>
                                </div>
                            {:else}
                                <div class="chart">
                                    {#each caByPeriode as g}
                                        <div class="bar-col">
                                            <span class="bar-val">{g.total >= 1000 ? Math.round(g.total/1000)+'k' : g.total}</span>
                                            <div class="bar-wrap">
                                                <div class="bar" style="height:{hauteur(g.total, caByPeriode)}%">
                                                    <div class="bar-tooltip">{formatMontant(g.total)}</div>
                                                </div>
                                            </div>
                                            <span class="bar-label">{g.mois}</span>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <!-- Top produits -->
                        <div class="panel">
                            <div class="panel-header">
                                <h2 class="panel-title">Top produits</h2>
                                <span class="panel-badge">TOP 5</span>
                            </div>
                            {#if topProduits.length === 0}
                                <div class="empty-state">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#cbd5e1" stroke-width="1.5"/></svg>
                                    <p>Aucune donnée disponible</p>
                                </div>
                            {:else}
                                <ul class="top-list">
                                    {#each topProduits as p, i}
                                        <li class="top-item">
                                            <span class="top-rank rank-{Math.min(i+1,5)}">{i+1}</span>
                                            <div class="top-info">
                                                <span class="top-name">{p.nom || "—"}</span>
                                                <div class="top-bar-wrap">
                                                    <div class="top-bar" style="width:{Math.round((Number(p.ventes)/Math.max(...topProduits.map(x=>Number(x.ventes)),1))*100)}%"></div>
                                                </div>
                                            </div>
                                            <span class="top-badge">{p.ventes} vente{Number(p.ventes) > 1 ? 's' : ''}</span>
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    </div>

                    <!-- Ventes par caissier -->
                    <div class="panel">
                        <div class="panel-header">
                            <h2 class="panel-title">Performance par caissier</h2>
                            <span class="panel-badge">{ventesParCaissier.length} caissier{ventesParCaissier.length > 1 ? 's' : ''}</span>
                        </div>
                        {#if ventesParCaissier.length === 0}
                            <div class="empty-state">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="#cbd5e1" stroke-width="1.5"/></svg>
                                <p>Aucune vente sur cette période</p>
                            </div>
                        {:else}
                            <div class="caissiers-perf">
                                {#each ventesParCaissier as c, i}
                                    {@const pctCA = Math.round((c.ca / totalCA) * 100)}
                                    <div class="caissier-row">
                                        <div class="caissier-avatar" style="background:{couleurCaissier(i)}">
                                            {initiales(c.nom)}
                                        </div>
                                        <div class="caissier-data">
                                            <div class="caissier-top">
                                                <span class="caissier-nom">{c.nom}</span>
                                                <span class="caissier-ca">{formatMontant(c.ca)}</span>
                                            </div>
                                            <div class="caissier-progress-wrap">
                                                <div class="caissier-progress" style="width:{pctCA}%; background:{couleurCaissier(i)}"></div>
                                            </div>
                                            <div class="caissier-meta">
                                                <span>{c.ventes} vente{c.ventes > 1 ? 's' : ''}</span>
                                                <span>{pctCA}% du CA</span>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
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
.rapports { display:flex; flex-direction:column; gap:1.25rem; }
.page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
.page-header h1 { font-size:1.3rem; font-weight:700; color:#0f172a; }
.page-sub { color:#64748b; font-size:0.81rem; margin-top:0.2rem; }
.btn-refresh { display:flex; align-items:center; gap:0.45rem; padding:0.5rem 1rem; background:#fff; border:1px solid #e2e8f0; border-radius:10px; color:#334155; font-size:0.81rem; cursor:pointer; font-family:'Sora',sans-serif; font-weight:500; box-shadow:var(--shadow-sm); white-space:nowrap; transition:all 0.2s; }
.btn-refresh:hover { background:#0f172a; color:#fff; border-color:#0f172a; transform:translateY(-1px); }
.alert-error { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; padding:0.75rem 1rem; border-radius:10px; font-size:0.83rem; }

/* PÉRIODE */
.periode-bar { display:flex; gap:0.5rem; flex-wrap:wrap; }
.periode-btn { padding:0.42rem 1rem; border-radius:20px; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; font-family:'Sora',sans-serif; font-size:0.78rem; font-weight:500; cursor:pointer; transition:all 0.15s; }
.periode-btn:hover { border-color:#94a3b8; color:#334155; }
.periode-btn.active { background:#0f172a; color:#fff; border-color:#0f172a; box-shadow:0 2px 8px rgba(15,23,42,0.2); }

/* KPI */
.kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
.kpi-card { background:#fff; border:1px solid #e2e8f0; border-radius:var(--radius); padding:1.2rem; display:flex; align-items:center; gap:1rem; box-shadow:var(--shadow-sm); position:relative; overflow:hidden; transition:transform 0.2s,box-shadow 0.2s; }
.kpi-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:var(--radius) var(--radius) 0 0; }
.kpi-card.blue::before   { background:linear-gradient(90deg,#2563eb,#60a5fa); }
.kpi-card.green::before  { background:linear-gradient(90deg,#16a34a,#4ade80); }
.kpi-card.orange::before { background:linear-gradient(90deg,#ea580c,#fb923c); }
.kpi-card.purple::before { background:linear-gradient(90deg,#7c3aed,#a78bfa); }
.kpi-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
.kpi-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.kpi-card.blue   .kpi-icon { background:#eff6ff; color:#2563eb; }
.kpi-card.green  .kpi-icon { background:#f0fdf4; color:#16a34a; }
.kpi-card.orange .kpi-icon { background:#fff7ed; color:#ea580c; }
.kpi-card.purple .kpi-icon { background:#f5f3ff; color:#7c3aed; }
.kpi-info { display:flex; flex-direction:column; gap:0.18rem; min-width:0; }
.kpi-label { font-size:0.74rem; color:#64748b; font-weight:500; white-space:nowrap; }
.kpi-value { font-size:1.05rem; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.kpi-value-sm { font-size:0.9rem; text-transform:capitalize; }
.kpi-sub { font-size:0.68rem; color:#94a3b8; font-weight:500; }

/* SKELETONS */
.skeletons { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
.skeleton-card { height:96px; background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:var(--radius); }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

/* PANELS */
.row-2 { display:grid; grid-template-columns:1.6fr 1fr; gap:1rem; }
.panel { background:#fff; border:1px solid #e2e8f0; border-radius:var(--radius); padding:1.25rem; box-shadow:var(--shadow-sm); }
.panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
.panel-title { font-size:0.9rem; font-weight:700; color:#1e293b; }
.panel-badge { font-size:0.66rem; font-weight:700; background:#f1f5f9; color:#64748b; padding:0.18rem 0.5rem; border-radius:20px; letter-spacing:0.04em; }
.empty-state { display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:2rem 1rem; color:#94a3b8; font-size:0.82rem; }

/* CHART */
.chart { display:flex; align-items:flex-end; gap:0.45rem; height:160px; padding-top:1.5rem; }
.bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:0.28rem; height:100%; }
.bar-val { font-size:0.63rem; color:#94a3b8; font-weight:600; }
.bar-wrap { flex:1; width:100%; display:flex; align-items:flex-end; }
.bar { width:100%; background:linear-gradient(180deg,#60a5fa,#2563eb); border-radius:5px 5px 0 0; min-height:4px; position:relative; cursor:pointer; transition:height 0.4s cubic-bezier(.4,0,.2,1); }
.bar:hover { background:linear-gradient(180deg,#93c5fd,#1d4ed8); }
.bar-tooltip { display:none; position:absolute; bottom:calc(100%+6px); left:50%; transform:translateX(-50%); background:#0f172a; color:#fff; font-size:0.63rem; font-weight:600; padding:0.28rem 0.5rem; border-radius:6px; white-space:nowrap; pointer-events:none; z-index:10; }
.bar:hover .bar-tooltip { display:block; }
.bar-label { font-size:0.62rem; color:#94a3b8; font-weight:500; }

/* TOP PRODUITS */
.top-list { list-style:none; display:flex; flex-direction:column; gap:0.5rem; }
.top-item { display:flex; align-items:center; gap:0.65rem; padding:0.55rem 0.7rem; background:#f8fafc; border:1px solid #f1f5f9; border-radius:10px; }
.top-rank { width:22px; height:22px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; flex-shrink:0; }
.top-rank.rank-1 { background:#fef9c3; color:#a16207; }
.top-rank.rank-2 { background:#f1f5f9; color:#475569; }
.top-rank.rank-3 { background:#fff7ed; color:#c2410c; }
.top-rank.rank-4,.top-rank.rank-5 { background:#f8fafc; color:#64748b; }
.top-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:0.25rem; }
.top-name { font-size:0.81rem; color:#334155; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.top-bar-wrap { height:4px; background:#f1f5f9; border-radius:2px; overflow:hidden; }
.top-bar { height:100%; background:linear-gradient(90deg,#2563eb,#60a5fa); border-radius:2px; transition:width 0.5s ease; }
.top-badge { font-size:0.7rem; font-weight:600; background:#f0fdf4; color:#16a34a; padding:0.16rem 0.48rem; border-radius:20px; white-space:nowrap; flex-shrink:0; }

/* CAISSIERS PERFORMANCE */
.caissiers-perf { display:flex; flex-direction:column; gap:1rem; }
.caissier-row { display:flex; align-items:center; gap:1rem; }
.caissier-avatar { width:40px; height:40px; border-radius:10px; display:grid; place-items:center; font-size:0.82rem; font-weight:700; color:#fff; flex-shrink:0; }
.caissier-data { flex:1; min-width:0; }
.caissier-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.35rem; }
.caissier-nom { font-size:0.83rem; font-weight:700; color:#0f172a; }
.caissier-ca { font-size:0.83rem; font-weight:700; color:#0f172a; }
.caissier-progress-wrap { height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden; margin-bottom:0.3rem; }
.caissier-progress { height:100%; border-radius:3px; transition:width 0.5s ease; }
.caissier-meta { display:flex; justify-content:space-between; font-size:0.68rem; color:#94a3b8; font-weight:500; }

/* RESPONSIVE */
@media (max-width:1024px) { .kpi-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:860px) {
    .sidebar { position:fixed; top:0; left:0; bottom:0; transform:translateX(-100%); box-shadow:var(--shadow-lg); }
    .sidebar.open { transform:translateX(0); }
    .sidebar-close { display:flex; align-items:center; justify-content:center; }
    .sidebar-overlay { display:block; }
    .burger { display:flex; }
    .row-2 { grid-template-columns:1fr; }
    :global(body) { overflow:auto; }
    .app-shell,.main-area { overflow:auto; }
    .page-content { overflow:visible; }
}
@media (max-width:640px) {
    .kpi-grid { grid-template-columns:1fr 1fr; gap:0.75rem; }
    .page-content { padding:1rem; }
    .rapports { gap:1rem; }
    .kpi-value { font-size:0.92rem; }
}
@media (max-width:400px) {
    .kpi-grid { grid-template-columns:1fr; }
    .page-content { padding:0.75rem; }
}
</style>