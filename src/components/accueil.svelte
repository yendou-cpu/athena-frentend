<script>
    // ═══════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    const BASE_URL = "https://main-athena-api.onrender.com/api";
    const token    = localStorage.getItem("token");
    const user     = JSON.parse(localStorage.getItem("user") || "{}");
    const headers  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    // ═══════════════════════════════════════════════════════════
    // LAYOUT
    // ═══════════════════════════════════════════════════════════
    let pageActive       = "tableau-de-bord";
    let rechercheVisible = false;
    let recherche        = "";
    let menuVisible      = false;
    let sidebarOpen      = false;

    function toggleMenu()    { menuVisible  = !menuVisible; }
    function toggleSidebar() { sidebarOpen  = !sidebarOpen; }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "#/connexion"; // ✅ hash routing
    }

    const menus = [
        {
            id: "tableau-de-bord", label: "Tableau de Bord", hash: "#/acceuil",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
            </svg>`
        },
        {
            id: "produits", label: "Produits", hash: "#/produits",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>`
        },
        {
            id: "ventes", label: "Ventes", hash: "#/ventes",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        },
        {
            id: "clients", label: "Caissier", hash: "#/caissier",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`
        },
        {
            id: "stock", label: "Stock", hash: "#/stock",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`
        },
        {
            id: "rapports", label: "Rapports", hash: "#/rapports",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`
        },
        {
            id: "logs", label: "Logs", hash: "#/logs",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`
        },
        {
            id: "parametres", label: "Paramètres", hash: "#/parametres",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`
        },
    ];

    function navigate(hash, id) {
        window.location.href = hash;
        pageActive  = id;
        sidebarOpen = false;
    }

    // ═══════════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════════
    let chargement            = true;
    let erreur                = "";
    let stats                 = { chiffreAffaires: 0, nombreVentes: 0, stockFaible: 0 };
    let graphiqueVentes       = [];
    let dernieresTransactions = [];
    let produitsVendus        = [];

    async function chargerDashboard() {
        chargement = true;
        erreur     = "";
        try {
            const [ventesRes, produitsRes, topRes] = await Promise.all([
                fetch(`${BASE_URL}/ventes`,       { headers }),
                fetch(`${BASE_URL}/produits`,     { headers }),   // GET /api/produits/
                fetch(`${BASE_URL}/produits/top-produits`, { headers }),
            ]);

            if (!ventesRes.ok)   throw new Error(`Erreur ventes : ${ventesRes.status}`);
            if (!produitsRes.ok) throw new Error(`Erreur produits : ${produitsRes.status}`);
            if (!topRes.ok)      throw new Error(`Erreur top-produits : ${topRes.status}`);

            const ventes      = await ventesRes.json();
            const produits    = await produitsRes.json();
            const topProduits = await topRes.json();

            stats.chiffreAffaires = ventes.reduce((s, v) => s + Number(v.total || 0), 0);
            stats.nombreVentes    = ventes.length;
            stats.stockFaible     = produits.filter(
                p => Number(p.quantite_stock ?? 0) < Number(p.seuil_alerte ?? 5)
            ).length;

            const parMois = {};
            ventes.forEach(v => {
                const total = Number(v.total || 0);
                if (!v.date_vente) return;
                const mois = new Date(v.date_vente).toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
                parMois[mois] = (parMois[mois] || 0) + total;
            });
            graphiqueVentes = Object.entries(parMois).slice(-6).map(([mois, total]) => ({ mois, total }));

            dernieresTransactions = [...ventes]
                .sort((a, b) => new Date(b.date_vente || 0) - new Date(a.date_vente || 0))
                .slice(0, 5);

            produitsVendus = Array.isArray(topProduits) ? topProduits : [];

        } catch (e) {
            erreur = "Impossible de charger les données. Vérifiez votre connexion.";
            console.error(e);
        } finally {
            chargement = false;
        }
    }

    chargerDashboard();

    function formatMontant(n) {
        return new Intl.NumberFormat('fr-FR').format(Number(n) || 0) + ' FCFA';
    }

    function formatDate(d) {
        if (!d) return "—";
        const date = new Date(d);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function hauteurBarre(val) {
        const max = Math.max(...graphiqueVentes.map(g => g.total), 1);
        return Math.round((val / max) * 100);
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
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                          stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <span class="brand-label">ATHENA</span>
            <button class="sidebar-close" on:click={() => sidebarOpen = false} aria-label="Fermer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>

        <nav class="sidebar-nav">
            {#each menus as item}
                <button
                    class="nav-item"
                    class:active={pageActive === item.id}
                    on:click={() => navigate(item.hash, item.id)}
                >
                    <span class="nav-icon">{@html item.icon}</span>
                    <span class="nav-label">{item.label}</span>
                </button>
            {/each}
        </nav>

        <div class="sidebar-footer"><p>© 2026 – ATHENA Gestion</p></div>
    </aside>

    <!-- ═══ CONTENU PRINCIPAL ═══ -->
    <div class="main-area">

        <!-- ── NAVBAR ── -->
        <nav class="navbar">
            <button class="burger" on:click={toggleSidebar} aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <line x1="3" y1="6" x2="21" y2="6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="3" y1="12" x2="21" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="3" y1="18" x2="21" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>

            <div class="nav-brand">
                <span class="brand-text"><strong>Tableau de Bord</strong></span>
            </div>

            <div class="nav-search" class:active={rechercheVisible}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="#9ca3af" stroke-width="2"/>
                    <path d="m21 21-4.35-4.35" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <input
                    type="text"
                    bind:value={recherche}
                    placeholder="Rechercher..."
                    on:focus={() => rechercheVisible = true}
                    on:blur={() => rechercheVisible = false}
                />
            </div>

            <div class="nav-actions">
                <div class="user-menu"
                     on:click={toggleMenu}
                     on:keypress={toggleMenu}
                     role="button"
                     tabindex="0">
                    <div class="avatar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <span class="user-name">{user.nom || "Admin"}</span>
                    <svg class="chevron" class:rotated={menuVisible} width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.6)" stroke-width="2"
                              stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>

            {#if menuVisible}
                <div class="dropdown" on:click|stopPropagation on:keypress|stopPropagation role="menu" tabindex="-1">
                    <a href="#/profil" class="dropdown-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>Mon profil
                    </a>
                    <a href="#/parametres" class="dropdown-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                                  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>Paramètres
                    </a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item logout" on:click={logout}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>Se déconnecter
                    </button>
                </div>
            {/if}
        </nav>

        <!-- ── PAGE CONTENT ── -->
        <main class="page-content">
            <div class="dashboard">

                <div class="dash-header">
                    <div>
                        <h1>Tableau de Bord</h1>
                        <p class="dash-subtitle">Bienvenu dans votre système de gestion ATHENA</p>
                    </div>
                    <button class="btn-refresh" on:click={chargerDashboard}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Actualiser
                    </button>
                </div>

                {#if erreur}
                    <div class="alert-error-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        {erreur}
                    </div>
                {/if}

                {#if chargement}
                    <div class="stats-grid">
                        {#each [1,2,3] as _}<div class="stat-card skeleton"></div>{/each}
                    </div>
                    <div class="row-2">
                        <div class="panel skeleton" style="height:240px"></div>
                        <div class="panel skeleton" style="height:240px"></div>
                    </div>
                    <div class="panel skeleton" style="height:200px"></div>

                {:else}

                    <!-- Stats -->
                    <div class="stats-grid">
                        <div class="stat-card accent-blue">
                            <div class="stat-icon-wrap blue">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Chiffre d'affaires</span>
                                <span class="stat-value">{formatMontant(stats.chiffreAffaires)}</span>
                                <span class="stat-trend up">↑ Total cumulé</span>
                            </div>
                        </div>

                        <div class="stat-card accent-green">
                            <div class="stat-icon-wrap green">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                                    <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Nombre de ventes</span>
                                <span class="stat-value">{stats.nombreVentes}</span>
                                <span class="stat-trend up">↑ Transactions totales</span>
                            </div>
                        </div>

                        <div class="stat-card accent-orange">
                            <div class="stat-icon-wrap orange">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Stock faible</span>
                                <span class="stat-value">{stats.stockFaible} produit{stats.stockFaible > 1 ? 's' : ''}</span>
                                <span class="stat-trend {stats.stockFaible > 0 ? 'warn' : 'ok'}">
                                    {stats.stockFaible > 0 ? '⚠ Réapprovisionnement requis' : '✓ Stock suffisant'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Graphique + Top produits -->
                    <div class="row-2">
                        <div class="panel">
                            <div class="panel-header">
                                <h2 class="panel-title">Ventes des 6 derniers mois</h2>
                                <span class="panel-badge">FCFA</span>
                            </div>
                            {#if graphiqueVentes.length === 0}
                                <div class="empty-state">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 3v18h18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
                                        <path d="M7 16l4-4 4 4 4-6" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <p>Aucune donnée disponible</p>
                                </div>
                            {:else}
                                <div class="chart">
                                    {#each graphiqueVentes as g}
                                        <div class="bar-col">
                                            <span class="bar-val">{g.total >= 1000 ? Math.round(g.total/1000)+'k' : g.total}</span>
                                            <div class="bar-wrap">
                                                <div class="bar" style="height:{hauteurBarre(g.total)}%">
                                                    <div class="bar-tooltip">{formatMontant(g.total)}</div>
                                                </div>
                                            </div>
                                            <span class="bar-label">{g.mois}</span>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <div class="panel">
                            <div class="panel-header">
                                <h2 class="panel-title">Top produits</h2>
                                <span class="panel-badge">TOP 5</span>
                            </div>
                            {#if produitsVendus.length === 0}
                                <div class="empty-state">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#cbd5e1" stroke-width="1.5"/>
                                    </svg>
                                    <p>Aucune donnée disponible</p>
                                </div>
                            {:else}
                                <ul class="top-list">
                                    {#each produitsVendus as p, i}
                                        <li class="top-item">
                                            <span class="top-rank rank-{i+1}">{i + 1}</span>
                                            <span class="top-name">{p.nom || "—"}</span>
                                            <span class="top-badge">
                                                {Number(p.ventes) > 0 ? `${p.ventes} ventes` : "0 vente"}
                                            </span>
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    </div>

                    <!-- Dernières transactions -->
                    <div class="panel">
                        <div class="panel-header">
                            <h2 class="panel-title">Dernières transactions</h2>
                            <a href="#/ventes" class="panel-link">Voir tout →</a>
                        </div>
                        {#if dernieresTransactions.length === 0}
                            <div class="empty-state">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <circle cx="9" cy="21" r="1" stroke="#cbd5e1" stroke-width="1.5"/>
                                    <circle cx="20" cy="21" r="1" stroke="#cbd5e1" stroke-width="1.5"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="#cbd5e1" stroke-width="1.5"/>
                                </svg>
                                <p>Aucune transaction disponible</p>
                            </div>
                        {:else}
                            <div class="table-wrap">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Montant</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each dernieresTransactions as t}
                                            <tr>
                                                <td class="td-id">#{t.id || "—"}</td>
                                                <td class="td-date">{formatDate(t.date_vente)}</td>
                                                <td class="td-montant">{formatMontant(t.total || 0)}</td>
                                                <td>
                                                    <span class="badge-status {t.statut === 'annule' ? 'red' : 'green'}">
                                                        {t.statut === 'annule' ? 'Annulée' : (t.statut || 'Validée')}
                                                    </span>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
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

:global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
:global(body) { font-family: 'Sora', sans-serif; background: #f1f5f9; overflow: hidden; }

/* ══ VARIABLES ══ */
:global(:root) {
    --sidebar-w: 230px;
    --navbar-h:  60px;
    --blue:   #2563eb;
    --green:  #16a34a;
    --orange: #ea580c;
    --red:    #dc2626;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    --shadow-lg: 0 10px 40px rgba(0,0,0,0.14);
    --radius: 14px;
}

/* ══ SHELL ══ */
.app-shell { display: flex; height: 100vh; width: 100vw; overflow: hidden; background: #f1f5f9; }

/* ══ SIDEBAR ══ */
.sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    background: #0f172a;
    display: flex; flex-direction: column;
    border-right: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0; z-index: 100;
    transition: transform 0.28s cubic-bezier(.4,0,.2,1);
}
.sidebar-brand {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0 1rem; height: var(--navbar-h);
    border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
}
.logo-icon {
    width: 30px; height: 30px;
    background: linear-gradient(135deg,#1d4ed8,#3b82f6);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 2px 10px rgba(59,130,246,0.4);
}
.brand-label { color:#fff; font-size:0.92rem; font-weight:700; letter-spacing:0.04em; white-space:nowrap; flex:1; }
.sidebar-close {
    display: none; background: none; border: none;
    color: #64748b; cursor: pointer; padding: 4px; border-radius: 6px; margin-left: auto;
}
.sidebar-nav {
    flex: 1; padding: 0.8rem 0.55rem;
    display: flex; flex-direction: column; gap: 2px; overflow-y: auto;
}
.nav-item {
    display: flex; align-items: center; gap: 0.7rem;
    padding: 0.6rem 0.8rem; border-radius: 10px;
    border: none; background: none; cursor: pointer; width: 100%;
    text-align: left; color: #64748b;
    font-family: 'Sora', sans-serif; font-size: 0.83rem; font-weight: 400;
    transition: background 0.15s, color 0.15s;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
.nav-item.active {
    background: #1d4ed8; color: #fff; font-weight: 600;
    box-shadow: 0 2px 12px rgba(29,78,216,0.4);
}
.nav-icon { display: flex; align-items: center; flex-shrink: 0; width: 18px; height: 18px; }
.nav-label { white-space: nowrap; }
.sidebar-footer {
    padding: 0.85rem 1.2rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    color: #334155; font-size: 0.68rem; text-align: center;
}

/* ══ MAIN AREA ══ */
.main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

/* ══ NAVBAR ══ */
.navbar {
    height: var(--navbar-h); background: #0f172a;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0 1.25rem; flex-shrink: 0; position: relative;
    box-shadow: 0 2px 16px rgba(0,0,0,0.25); z-index: 50;
}
.burger {
    display: none; background: none; border: none; cursor: pointer;
    padding: 6px; border-radius: 8px; flex-shrink: 0;
    transition: background 0.15s;
}
.burger:hover { background: rgba(255,255,255,0.1); }
.nav-brand { display: flex; align-items: center; flex-shrink: 0; }
.brand-text { color: rgba(255,255,255,0.7); font-size: 0.87rem; white-space: nowrap; }
.brand-text strong { color: #fff; font-weight: 700; }
.nav-search {
    flex: 1; max-width: 280px; margin-left: auto;
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 0 0.8rem; height: 36px;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.nav-search.active { border-color: rgba(59,130,246,0.6); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.nav-search input {
    background: none; border: none; outline: none;
    color: #e2e8f0; font-family: 'Sora', sans-serif; font-size: 0.83rem; width: 100%;
}
.nav-search input::placeholder { color: rgba(255,255,255,0.28); }
.nav-actions { display: flex; align-items: center; }
.user-menu {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0 0.7rem; height: 36px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; cursor: pointer; user-select: none;
    transition: background 0.2s; white-space: nowrap;
}
.user-menu:hover { background: rgba(255,255,255,0.12); }
.avatar {
    width: 24px; height: 24px;
    background: linear-gradient(135deg,#1d4ed8,#3b82f6);
    border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-name { color: rgba(255,255,255,0.82); font-size: 0.81rem; font-weight: 500; }
.chevron { transition: transform 0.2s; flex-shrink: 0; }
.chevron.rotated { transform: rotate(180deg); }

/* ══ DROPDOWN ══ */
.dropdown {
    position: absolute; top: calc(var(--navbar-h) + 8px); right: 1.25rem;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 0.35rem; min-width: 180px;
    box-shadow: var(--shadow-lg); z-index: 200;
    animation: fadeDown 0.15s ease;
}
@keyframes fadeDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
}
.dropdown-item {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.58rem 0.75rem; border-radius: 8px;
    color: #334155; font-size: 0.83rem; font-family: 'Sora', sans-serif;
    text-decoration: none; cursor: pointer;
    transition: background 0.15s, color 0.15s;
    border: none; background: none; width: 100%; text-align: left;
}
.dropdown-item:hover { background: #f1f5f9; color: #0f172a; }
.dropdown-item.logout { color: #dc2626; }
.dropdown-item.logout:hover { background: #fef2f2; }
.dropdown-divider { height: 1px; background: #e2e8f0; margin: 0.3rem 0; }

/* ══ PAGE CONTENT ══ */
.page-content { flex: 1; overflow-y: auto; padding: 1.5rem; background: #f1f5f9; }

/* ══ OVERLAY ══ */
.overlay { position: fixed; inset: 0; z-index: 150; }
.sidebar-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.5); z-index: 90; backdrop-filter: blur(2px);
}

/* ══ DASHBOARD ══ */
.dashboard { display: flex; flex-direction: column; gap: 1.25rem; }

.dash-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 1rem; flex-wrap: wrap;
}
.dash-header h1 { font-size: 1.3rem; font-weight: 700; color: #0f172a; }
.dash-subtitle { color: #64748b; font-size: 0.81rem; margin-top: 0.2rem; }

.btn-refresh {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.5rem 1rem; background: #fff;
    border: 1px solid #e2e8f0; border-radius: 10px;
    color: #334155; font-size: 0.81rem; cursor: pointer;
    font-family: 'Sora', sans-serif; font-weight: 500;
    box-shadow: var(--shadow-sm); white-space: nowrap; flex-shrink: 0;
    transition: all 0.2s;
}
.btn-refresh:hover { background: #0f172a; color: #fff; border-color: #0f172a; transform: translateY(-1px); box-shadow: var(--shadow-md); }

.alert-error-box {
    display: flex; align-items: center; gap: 0.6rem;
    background: #fef2f2; color: #dc2626;
    border: 1px solid #fecaca; padding: 0.75rem 1rem;
    border-radius: 10px; font-size: 0.83rem; font-weight: 500;
}

/* ══ STATS ══ */
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }

.stat-card {
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: var(--radius); padding: 1.2rem;
    display: flex; align-items: center; gap: 1rem;
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative; overflow: hidden;
}
.stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 3px; border-radius: var(--radius) var(--radius) 0 0;
}
.stat-card.accent-blue::before  { background: linear-gradient(90deg,#2563eb,#60a5fa); }
.stat-card.accent-green::before { background: linear-gradient(90deg,#16a34a,#4ade80); }
.stat-card.accent-orange::before{ background: linear-gradient(90deg,#ea580c,#fb923c); }
.stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

.stat-card.skeleton {
    height: 96px;
    background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
    background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
.panel.skeleton {
    background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
    background-size: 200% 100%; animation: shimmer 1.4s infinite;
    border: 1px solid #e2e8f0; border-radius: var(--radius);
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.stat-icon-wrap {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon-wrap.blue   { background: #eff6ff; color: #2563eb; }
.stat-icon-wrap.green  { background: #f0fdf4; color: #16a34a; }
.stat-icon-wrap.orange { background: #fff7ed; color: #ea580c; }

.stat-info { display: flex; flex-direction: column; gap: 0.18rem; min-width: 0; }
.stat-label { font-size: 0.74rem; color: #64748b; font-weight: 500; white-space: nowrap; }
.stat-value { font-size: 1.08rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stat-trend { font-size: 0.68rem; font-weight: 500; }
.stat-trend.up   { color: #16a34a; }
.stat-trend.warn { color: #ea580c; }
.stat-trend.ok   { color: #16a34a; }
    .stat-trend.muted { color: #94a3b8; }

/* ══ ROW 2 ══ */
.row-2 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1rem; }

/* ══ PANEL ══ */
.panel {
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: var(--radius); padding: 1.25rem;
    box-shadow: var(--shadow-sm);
}
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.panel-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
.panel-badge {
    font-size: 0.66rem; font-weight: 700;
    background: #f1f5f9; color: #64748b;
    padding: 0.18rem 0.5rem; border-radius: 20px; letter-spacing: 0.04em;
}
.panel-link { font-size: 0.76rem; font-weight: 600; color: #2563eb; text-decoration: none; transition: opacity 0.15s; }
.panel-link:hover { opacity: 0.7; }
.empty-state {
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    padding: 2rem 1rem; color: #94a3b8; font-size: 0.82rem;
}

/* ══ CHART ══ */
.chart { display: flex; align-items: flex-end; gap: 0.45rem; height: 155px; padding-top: 1.5rem; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.28rem; height: 100%; }
.bar-val { font-size: 0.63rem; color: #94a3b8; font-weight: 600; }
.bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; position: relative; }
.bar {
    width: 100%;
    background: linear-gradient(180deg,#60a5fa,#2563eb);
    border-radius: 5px 5px 0 0; min-height: 4px;
    transition: height 0.55s cubic-bezier(.4,0,.2,1);
    position: relative; cursor: pointer;
}
.bar:hover { background: linear-gradient(180deg,#93c5fd,#1d4ed8); }
.bar-tooltip {
    display: none; position: absolute; bottom: calc(100% + 6px); left: 50%;
    transform: translateX(-50%); background: #0f172a; color: #fff;
    font-size: 0.63rem; font-weight: 600; padding: 0.28rem 0.5rem;
    border-radius: 6px; white-space: nowrap; pointer-events: none; z-index: 10;
}
.bar:hover .bar-tooltip { display: block; }
.bar-label { font-size: 0.62rem; color: #94a3b8; font-weight: 500; }

/* ══ TOP LIST ══ */
.top-list { list-style: none; display: flex; flex-direction: column; gap: 0.45rem; }
.top-item {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0.55rem 0.7rem;
    background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px;
    transition: background 0.15s;
}
.top-item:hover { background: #f1f5f9; }
.top-rank {
    width: 22px; height: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
}
.top-rank.rank-1 { background: #fef9c3; color: #a16207; }
.top-rank.rank-2 { background: #f1f5f9; color: #475569; }
.top-rank.rank-3 { background: #fff7ed; color: #c2410c; }
.top-rank.rank-4,.top-rank.rank-5 { background: #f8fafc; color: #64748b; }
.top-name { flex: 1; font-size: 0.81rem; color: #334155; font-weight: 500; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.top-badge {
    font-size: 0.7rem; font-weight: 600;
    background: #f0fdf4; color: #16a34a;
    padding: 0.16rem 0.48rem; border-radius: 20px; white-space: nowrap; flex-shrink: 0;
}

/* ══ TABLE ══ */
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.table { width: 100%; border-collapse: collapse; min-width: 340px; }
.table th {
    text-align: left; font-size: 0.68rem; font-weight: 700;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em;
    padding: 0 0.75rem 0.7rem; border-bottom: 1px solid #e2e8f0; white-space: nowrap;
}
.table td {
    padding: 0.7rem 0.75rem; font-size: 0.83rem; color: #475569;
    border-bottom: 1px solid #f1f5f9; vertical-align: middle;
}
.table tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: #f8fafc; }
.td-id    { color: #94a3b8; font-size: 0.76rem; font-weight: 700; font-family: monospace; }
.td-date  { color: #64748b; white-space: nowrap; }
.td-montant { font-weight: 700; color: #0f172a; white-space: nowrap; }
.badge-status { font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.58rem; border-radius: 20px; white-space: nowrap; }
.badge-status.green { background: #f0fdf4; color: #16a34a; }
.badge-status.red   { background: #fef2f2; color: #dc2626; }

/* ══ RESPONSIVE ══ */
@media (max-width: 860px) {
    .sidebar {
        position: fixed; top: 0; left: 0; bottom: 0;
        transform: translateX(-100%); box-shadow: var(--shadow-lg);
    }
    .sidebar.open { transform: translateX(0); }
    .sidebar-close { display: flex; align-items: center; justify-content: center; }
    .sidebar-overlay { display: block; }
    .burger { display: flex; }
    .nav-brand { display: none; }
    .nav-search { max-width: 200px; }
    .row-2 { grid-template-columns: 1fr; }
    :global(body) { overflow: auto; }
    .app-shell { overflow: auto; }
    .main-area { overflow: auto; }
    .page-content { overflow: visible; }
}

@media (max-width: 640px) {
    .stats-grid { grid-template-columns: 1fr; gap: 0.75rem; }
    .page-content { padding: 1rem; }
    .dashboard { gap: 1rem; }
    .stat-card { padding: 1rem; }
    .stat-value { font-size: 1rem; }
    .nav-search { max-width: 150px; }
    .user-name { display: none; }
    .chart { height: 130px; }
}

@media (max-width: 400px) {
    .nav-search { display: none; }
    .page-content { padding: 0.75rem; }
    .panel { padding: 1rem; }
    .stats-grid { gap: 0.6rem; }
}
</style>