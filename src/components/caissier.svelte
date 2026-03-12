<script>
    import { onMount } from 'svelte';

    // ══════════════════════════════════
    // CONFIG
    // ══════════════════════════════════
    const BASE_URL     = "https://main-athena-api.onrender.com/api";
    const VENTES_URL   = `${BASE_URL}/ventes`;
    const PRODUITS_URL = `${BASE_URL}/produits`;

    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "{}");
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    // ══════════════════════════════════
    // LAYOUT
    // ══════════════════════════════════
    let pageActive  = "clients";
    let menuVisible = false;
    let sidebarOpen = false;

    function toggleMenu()    { menuVisible  = !menuVisible; }
    function toggleSidebar() { sidebarOpen  = !sidebarOpen; }

    function logout() {
        menuVisible = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "#/connexion";
    }

    const menus = [
        { id: "tableau-de-bord", label: "Tableau de Bord", hash: "#/acceuil",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>` },
        { id: "produits", label: "Produits", hash: "#/produits",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" stroke-width="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2"/></svg>` },
        { id: "ventes", label: "Ventes", hash: "#/ventes",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
        { id: "clients", label: "Caissier", hash: "#/caissier",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
        { id: "stock", label: "Stock", hash: "#/stock",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
        { id: "rapports", label: "Rapports", hash: "#/rapports",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>` },
        { id: "logs", label: "Logs", hash: "#/logs",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
        { id: "parametres", label: "Paramètres", hash: "#/parametres",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
    ];

    function navigate(hash, id) {
        window.location.href = hash;
        pageActive  = id;
        sidebarOpen = false;
    }

    // ══════════════════════════════════
    // SESSION CAISSE
    // ══════════════════════════════════
    let sessionActive   = false;
    let heureOuverture  = null;
    let totalSession    = 0;
    let ventesSession   = 0;

    function ouvrirSession() {
        sessionActive  = true;
        heureOuverture = new Date();
        totalSession   = 0;
        ventesSession  = 0;
    }

    function fermerSession() {
        sessionActive = false;
        // Afficher le résumé avant de fermer
        showResume = true;
    }

    let showResume = false;

    // ══════════════════════════════════
    // PRODUITS & PANIER
    // ══════════════════════════════════
    let produits        = [];
    let chargProduits   = true;
    let rechercheProd   = "";
    let erreur          = "";
    let successMsg      = "";

    let panier          = [];
    let enregistrement  = false;
    let erreurVente     = "";

    // Historique des ventes de la session
    let historiqueSession = [];

    // Reçu
    let reçuVisible = false;
    let dernierReçu = null;

    onMount(async () => {
        await chargerProduits();
    });

    async function chargerProduits() {
        chargProduits = true;
        try {
            const res  = await fetch(PRODUITS_URL, { headers });
            const data = await res.json();
            if (res.ok) produits = data;
        } catch(_) {}
        finally { chargProduits = false; }
    }

    // ── Filtrage produits ──
    $: produitsFiltres = produits.filter(p =>
        (p.nom || "").toLowerCase().includes(rechercheProd.toLowerCase())
    );

    // ── Panier ──
    function ajouterAuPanier(p) {
        if (p.quantite_stock === 0) return;
        const ex = panier.find(i => i.produit_id === p.id);
        if (ex) {
            if (ex.quantite < p.quantite_stock) { ex.quantite++; panier = [...panier]; }
        } else {
            panier = [...panier, { produit_id: p.id, nom: p.nom, prix: Number(p.prix), quantite: 1, stock: p.quantite_stock }];
        }
    }

    function retirerDuPanier(id) { panier = panier.filter(i => i.produit_id !== id); }

    function changerQte(id, val) {
        panier = panier.map(i => i.produit_id === id
            ? { ...i, quantite: Math.max(1, Math.min(i.stock, Number(val) || 1)) }
            : i);
    }

    function viderPanier() { panier = []; }

    $: totalPanier = panier.reduce((s, i) => s + i.prix * i.quantite, 0);
    $: nbArticles  = panier.reduce((s, i) => s + i.quantite, 0);

    // ── Enregistrer la vente ──
    async function encaisser() {
        if (!sessionActive) { erreurVente = "Ouvrez d'abord une session de caisse."; return; }
        if (panier.length === 0) { erreurVente = "Le panier est vide."; return; }
        enregistrement = true; erreurVente = "";
        try {
            const res  = await fetch(`${VENTES_URL}/enregistre`, {
                method: "POST", headers,
                body: JSON.stringify({ produits: panier.map(i => ({ produit_id: i.produit_id, quantite: i.quantite })) })
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.message || `Erreur ${res.status}`);

            // Mise à jour session
            totalSession  += data.total;
            ventesSession += 1;

            // Préparer le reçu
            dernierReçu = {
                id:       data.vente_id,
                total:    data.total,
                date:     new Date(),
                caissier: user.nom || "Caissier",
                boutique: user.nom_boutique || "ATHENA",
                lignes:   [...panier]
            };

            historiqueSession = [{ id: data.vente_id, total: data.total, date: new Date(), nbArticles }, ...historiqueSession];

            reçuVisible = true;
            panier = [];
            await chargerProduits();

        } catch(e) { erreurVente = e.message; }
        finally { enregistrement = false; }
    }

    // ── Reçu ──
    function fermerReçu() { reçuVisible = false; }

    function imprimerReçu() {
        window.print();
    }

    // ── Utilitaires ──
    function fmt(n) { return Number(n || 0).toLocaleString("fr-FR") + " FCFA"; }
    function fmtHeure(d) {
        if (!d) return "—";
        return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    function fmtDateCourt(d) {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    function initiales(nom) {
        if (!nom) return "?";
        return nom.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    function dureeSession() {
        if (!heureOuverture) return "0 min";
        const diff = Math.floor((new Date() - heureOuverture) / 60000);
        return diff < 60 ? `${diff} min` : `${Math.floor(diff/60)}h${diff%60}`;
    }
</script>

<svelte:window on:keydown={(e) => {
    if (e.key === 'Escape') {
        if (reçuVisible) fermerReçu();
        else if (showResume) showResume = false;
    }
}} />

<!-- ══ APP SHELL ══ -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="app-shell" on:click={() => { menuVisible = false; }}>

    {#if sidebarOpen}
        <button class="sidebar-overlay" on:click={() => sidebarOpen = false} aria-label="Fermer"></button>
    {/if}

    <!-- SIDEBAR -->
    <aside class="sidebar" class:open={sidebarOpen}>
        <div class="sidebar-logo">
            <div class="logo-icon">A</div>
            <span class="logo-text">ATHENA</span>
            <button class="sidebar-close" on:click={() => sidebarOpen = false} aria-label="Fermer le menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </div>
        <nav class="sidebar-nav">
            {#each menus as m}
                <button class="nav-item" class:active={pageActive === m.id} on:click={() => navigate(m.hash, m.id)}>
                    <span class="nav-icon">{@html m.icon}</span>
                    <span class="nav-label">{m.label}</span>
                </button>
            {/each}
        </nav>
        <div class="sidebar-footer">
            <div class="user-mini">
                <div class="user-avatar-sm">{initiales(user.nom)}</div>
                <div class="user-info-sm">
                    <span class="user-name-sm">{user.nom || "Caissier"}</span>
                    <span class="user-role-sm">{user.role || "—"}</span>
                </div>
            </div>
        </div>
    </aside>

    <!-- MAIN -->
    <div class="main-area">

        <!-- NAVBAR -->
        <header class="navbar">
            <div class="navbar-left">
                <button class="burger" on:click|stopPropagation={toggleSidebar} aria-label="Ouvrir le menu">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <div class="navbar-title">
                    <span class="page-title">Caisse</span>
                    <span class="page-sub">{user.nom_boutique || "ATHENA Gestion"}</span>
                </div>
            </div>
            <div class="navbar-center">
                {#if sessionActive}
                    <div class="session-badge active">
                        <span class="session-dot"></span>
                        Session ouverte · {fmtHeure(heureOuverture)} · {dureeSession()}
                    </div>
                {:else}
                    <div class="session-badge closed">
                        <span class="session-dot off"></span>
                        Session fermée
                    </div>
                {/if}
            </div>
            <div class="navbar-right">
                {#if !sessionActive}
                    <button class="btn-success" on:click={ouvrirSession}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Ouvrir session
                    </button>
                {:else}
                    <button class="btn-danger-outline" on:click={fermerSession}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Fermer session
                    </button>
                {/if}
                <div class="user-menu" on:click|stopPropagation={toggleMenu}
                     on:keydown={(e) => (e.key==="Enter"||e.key===" ") && toggleMenu()}
                     role="button" tabindex="0">
                    <div class="user-avatar">{initiales(user.nom)}</div>
                    <span class="user-name">{user.nom || "Caissier"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    {#if menuVisible}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="dropdown" on:click|stopPropagation role="menu" tabindex="-1">
                            <a href="#/profil" class="dropdown-item">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                Mon profil
                            </a>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item logout" on:click={logout}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                Se déconnecter
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </header>

        <!-- CONTENU PRINCIPAL -->
        <main class="content">

            {#if !sessionActive}
                <!-- ÉCRAN D'ACCUEIL SESSION -->
                <div class="session-welcome">
                    <div class="welcome-card">
                        <div class="welcome-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        </div>
                        <h2>Bonjour, {user.prenom || user.nom || "Caissier"} </h2>
                        <p>Ouvrez une session pour commencer à enregistrer des ventes.</p>
                        <button class="btn-success large" on:click={ouvrirSession}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                            Ouvrir la session de caisse
                        </button>
                        {#if historiqueSession.length > 0}
                            <p class="session-hint">Dernière session : {ventesSession} vente(s) · {fmt(totalSession)}</p>
                        {/if}
                    </div>
                </div>

            {:else}
                <!-- INTERFACE CAISSE -->
                <div class="caisse-layout">

                    <!-- COLONNE GAUCHE : Catalogue -->
                    <div class="catalogue-col">
                        <div class="search-header">
                            <div class="search-box">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                <input type="text" placeholder="Rechercher un produit…" bind:value={rechercheProd} />
                                {#if rechercheProd}
                                    <button class="clear-search" on:click={() => rechercheProd = ""}>×</button>
                                {/if}
                            </div>
                            <span class="produit-count">{produitsFiltres.length} produit(s)</span>
                        </div>

                        {#if chargProduits}
                            <div class="grid-skeleton">
                                {#each [1,2,3,4,5,6] as _}<div class="skeleton-card"></div>{/each}
                            </div>
                        {:else if produitsFiltres.length === 0}
                            <div class="empty-catalogue">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                                <p>Aucun produit trouvé</p>
                            </div>
                        {:else}
                            <div class="produit-grid">
                                {#each produitsFiltres as p}
                                    <button class="produit-tile" class:rupture={p.quantite_stock === 0}
                                            on:click={() => ajouterAuPanier(p)}
                                            disabled={p.quantite_stock === 0}>
                                        <div class="tile-avatar">{(p.nom||"?")[0].toUpperCase()}</div>
                                        <div class="tile-nom">{p.nom}</div>
                                        <div class="tile-prix">{fmt(p.prix)}</div>
                                        <div class="tile-stock" class:low={p.quantite_stock > 0 && p.quantite_stock <= (p.seuil_alerte||5)}>
                                            {#if p.quantite_stock === 0}
                                                Rupture
                                            {:else if p.quantite_stock <= (p.seuil_alerte||5)}
                                                ⚠ Stock : {p.quantite_stock}
                                            {:else}
                                                Stock : {p.quantite_stock}
                                            {/if}
                                        </div>
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>

                    <!-- COLONNE DROITE : Panier + Encaissement -->
                    <div class="caisse-col">

                        <!-- Stats session -->
                        <div class="session-stats">
                            <div class="sstat">
                                <span class="sstat-label">Ventes aujourd'hui</span>
                                <span class="sstat-val">{ventesSession}</span>
                            </div>
                            <div class="sstat green">
                                <span class="sstat-label">CA session</span>
                                <span class="sstat-val">{fmt(totalSession)}</span>
                            </div>
                        </div>

                        <!-- Panier -->
                        <div class="panier-box">
                            <div class="panier-header">
                                <h3>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    Panier
                                    {#if panier.length > 0}<span class="badge">{nbArticles}</span>{/if}
                                </h3>
                                {#if panier.length > 0}
                                    <button class="btn-vider" on:click={viderPanier}>Vider</button>
                                {/if}
                            </div>

                            {#if panier.length === 0}
                                <div class="panier-empty">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                    <p>Cliquez sur un produit</p>
                                </div>
                            {:else}
                                <div class="panier-items">
                                    {#each panier as item}
                                        <div class="panier-item">
                                            <div class="item-info">
                                                <span class="item-nom">{item.nom}</span>
                                                <span class="item-pu">{fmt(item.prix)} / u</span>
                                            </div>
                                            <div class="item-qte">
                                                <button on:click={() => changerQte(item.produit_id, item.quantite-1)}>−</button>
                                                <span>{item.quantite}</span>
                                                <button on:click={() => changerQte(item.produit_id, item.quantite+1)}>+</button>
                                            </div>
                                            <span class="item-total">{fmt(item.prix * item.quantite)}</span>
                                            <button class="item-del" on:click={() => retirerDuPanier(item.produit_id)}>×</button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}

                            <!-- Total -->
                            {#if panier.length > 0}
                                <div class="panier-total">
                                    <div class="total-row">
                                        <span>Sous-total</span>
                                        <span>{fmt(totalPanier)}</span>
                                    </div>
                                    <div class="total-row big">
                                        <span>TOTAL</span>
                                        <span class="total-amount">{fmt(totalPanier)}</span>
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <!-- Erreur -->
                        {#if erreurVente}
                            <div class="alert error">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                {erreurVente}
                            </div>
                        {/if}

                        <!-- Bouton encaisser -->
                        <button class="btn-encaisser" on:click={encaisser}
                                disabled={enregistrement || panier.length === 0}>
                            {#if enregistrement}
                                <span class="spinner"></span> Traitement…
                            {:else}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" stroke-width="2"/></svg>
                                Encaisser · {fmt(totalPanier)}
                            {/if}
                        </button>

                        <!-- Historique session -->
                        {#if historiqueSession.length > 0}
                            <div class="historique">
                                <h4>Ventes de la session</h4>
                                <div class="histo-list">
                                    {#each historiqueSession as v}
                                        <div class="histo-item">
                                            <span class="histo-id">#{v.id}</span>
                                            <span class="histo-heure">{fmtHeure(v.date)}</span>
                                            <span class="histo-articles">{v.nbArticles} art.</span>
                                            <span class="histo-total">{fmt(v.total)}</span>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                    </div>
                </div>
            {/if}

        </main>
    </div>
</div>

<!-- ══ MODAL REÇU ══ -->
{#if reçuVisible && dernierReçu}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" on:click={fermerReçu}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="modal recu-modal" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
            <div class="recu-header">
                <div class="recu-logo">{dernierReçu.boutique}</div>
                <p class="recu-sub">Reçu de caisse</p>
            </div>
            <div class="recu-body">
                <div class="recu-meta">
                    <span>Vente #<strong>{dernierReçu.id}</strong></span>
                    <span>{fmtDateCourt(dernierReçu.date)} à {fmtHeure(dernierReçu.date)}</span>
                    <span>Caissier : <strong>{dernierReçu.caissier}</strong></span>
                </div>
                <div class="recu-divider"></div>
                <table class="recu-table">
                    <thead><tr><th>Article</th><th>Qté</th><th>P.U</th><th>Total</th></tr></thead>
                    <tbody>
                        {#each dernierReçu.lignes as l}
                            <tr>
                                <td>{l.nom}</td>
                                <td class="center">{l.quantite}</td>
                                <td class="right">{fmt(l.prix)}</td>
                                <td class="right bold">{fmt(l.prix * l.quantite)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="recu-divider"></div>
                <div class="recu-total-row">
                    <span>TOTAL</span>
                    <span class="recu-total-val">{fmt(dernierReçu.total)}</span>
                </div>
                <p class="recu-merci">Merci pour votre achat !</p>
            </div>
            <div class="recu-footer">
                <button class="btn-secondary" on:click={fermerReçu}>Fermer</button>
                <button class="btn-print" on:click={imprimerReçu}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="2"/><rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
                    Imprimer
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- ══ MODAL RÉSUMÉ SESSION ══ -->
{#if showResume}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" on:click={() => showResume = false}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="modal resume-modal" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
            <div class="modal-header">
                <h2>Résumé de session</h2>
                <button class="modal-close" on:click={() => showResume = false} aria-label="Fermer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="resume-stats">
                    <div class="rstat">
                        <span class="rstat-label">Ouverture</span>
                        <span class="rstat-val">{fmtHeure(heureOuverture)}</span>
                    </div>
                    <div class="rstat">
                        <span class="rstat-label">Durée</span>
                        <span class="rstat-val">{dureeSession()}</span>
                    </div>
                    <div class="rstat green">
                        <span class="rstat-label">Nombre de ventes</span>
                        <span class="rstat-val">{ventesSession}</span>
                    </div>
                    <div class="rstat blue">
                        <span class="rstat-label">Total encaissé</span>
                        <span class="rstat-val">{fmt(totalSession)}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" on:click={() => { showResume = false; sessionActive = true; }}>Continuer la session</button>
                <button class="btn-danger" on:click={() => { showResume = false; heureOuverture = null; }}>Confirmer la fermeture</button>
            </div>
        </div>
    </div>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :global(body) { font-family: 'Sora', sans-serif; background: #f1f5f9; color: #1e293b; overflow: hidden; }

    /* ── LAYOUT ── */
    .app-shell { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

    /* SIDEBAR */
    .sidebar { width: 230px; background: #0f172a; color: #e2e8f0; display: flex; flex-direction: column; flex-shrink: 0; height: 100vh; position: fixed; left: 0; top: 0; z-index: 200; transform: translateX(0); transition: transform .28s cubic-bezier(.4,0,.2,1); }
    .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 190; border: none; cursor: pointer; padding: 0; }
    .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 1.25rem 1rem 1rem; border-bottom: 1px solid rgba(255,255,255,.07); }
    .logo-icon { width: 32px; height: 32px; background: #3b82f6; border-radius: 8px; display: grid; place-items: center; font-weight: 700; font-size: 1rem; color: #fff; flex-shrink: 0; }
    .logo-text { font-weight: 700; font-size: 1.05rem; letter-spacing: .08em; color: #f8fafc; flex: 1; }
    .sidebar-close { display: none; background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; }
    .sidebar-nav { flex: 1; padding: .75rem .6rem; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: .55rem .85rem; border-radius: 8px; background: none; border: none; color: #94a3b8; cursor: pointer; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 500; text-align: left; transition: all .18s; width: 100%; }
    .nav-item:hover { background: rgba(255,255,255,.07); color: #e2e8f0; }
    .nav-item.active { background: #1e40af; color: #fff; }
    .nav-icon { flex-shrink: 0; display: flex; }
    .sidebar-footer { padding: .85rem; border-top: 1px solid rgba(255,255,255,.07); }
    .user-mini { display: flex; align-items: center; gap: 9px; }
    .user-avatar-sm { width: 30px; height: 30px; background: #1e40af; border-radius: 50%; display: grid; place-items: center; font-size: .72rem; font-weight: 700; color: #fff; flex-shrink: 0; }
    .user-info-sm { display: flex; flex-direction: column; }
    .user-name-sm { font-size: .78rem; font-weight: 600; color: #e2e8f0; }
    .user-role-sm { font-size: .68rem; color: #64748b; text-transform: capitalize; }

    /* MAIN */
    .main-area { margin-left: 230px; flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

    /* NAVBAR */
    .navbar { height: 60px; background: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 1.2rem; flex-shrink: 0; gap: .75rem; }
    .navbar-left { display: flex; align-items: center; gap: 12px; }
    .burger { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 6px; border-radius: 6px; display: none; }
    .navbar-title { display: flex; flex-direction: column; }
    .page-title { font-size: .95rem; font-weight: 700; color: #f8fafc; line-height: 1.2; }
    .page-sub { font-size: .7rem; color: #64748b; }
    .navbar-center { flex: 1; display: flex; justify-content: center; }
    .session-badge { display: flex; align-items: center; gap: 7px; padding: .35rem .85rem; border-radius: 20px; font-size: .75rem; font-weight: 600; }
    .session-badge.active { background: rgba(34,197,94,.15); color: #22c55e; border: 1px solid rgba(34,197,94,.3); }
    .session-badge.closed { background: rgba(148,163,184,.1); color: #64748b; border: 1px solid rgba(148,163,184,.2); }
    .session-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: pulse 2s infinite; }
    .session-dot.off { background: #64748b; animation: none; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .navbar-right { display: flex; align-items: center; gap: 10px; }
    .btn-success { display: flex; align-items: center; gap: 6px; padding: .45rem .9rem; background: #22c55e; color: #fff; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .78rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background .18s; }
    .btn-success:hover { background: #16a34a; }
    .btn-success.large { padding: .75rem 1.5rem; font-size: .92rem; border-radius: 10px; }
    .btn-danger-outline { display: flex; align-items: center; gap: 6px; padding: .45rem .9rem; background: transparent; color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .78rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all .18s; }
    .btn-danger-outline:hover { background: #fef2f2; }
    .user-menu { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 6px 10px; border-radius: 8px; transition: background .18s; position: relative; }
    .user-menu:hover { background: rgba(255,255,255,.07); }
    .user-avatar { width: 30px; height: 30px; background: #1e40af; border-radius: 50%; display: grid; place-items: center; font-size: .72rem; font-weight: 700; color: #fff; flex-shrink: 0; }
    .user-name { font-size: .8rem; font-weight: 600; color: #e2e8f0; }
    .dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,.15); min-width: 160px; overflow: hidden; z-index: 300; animation: fadeIn .15s ease; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)} }
    .dropdown-item { display: flex; align-items: center; gap: 10px; padding: .65rem 1rem; font-family: 'Sora', sans-serif; font-size: .82rem; color: #334155; text-decoration: none; background: none; border: none; cursor: pointer; width: 100%; transition: background .15s; }
    .dropdown-item:hover { background: #f1f5f9; }
    .dropdown-item.logout { color: #ef4444; }
    .dropdown-item.logout:hover { background: #fef2f2; }
    .dropdown-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

    /* CONTENT */
    .content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

    /* SESSION WELCOME */
    .session-welcome { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .welcome-card { background: #fff; border-radius: 20px; padding: 3rem 2.5rem; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,.08); max-width: 440px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .welcome-icon { width: 80px; height: 80px; background: #eff6ff; border-radius: 20px; display: grid; place-items: center; margin-bottom: .5rem; }
    .welcome-card h2 { font-size: 1.3rem; font-weight: 700; color: #0f172a; }
    .welcome-card p { font-size: .85rem; color: #64748b; }
    .session-hint { font-size: .75rem; color: #94a3b8; margin-top: .5rem; }

    /* CAISSE LAYOUT */
    .caisse-layout { flex: 1; display: grid; grid-template-columns: 1fr 360px; overflow: hidden; }

    /* CATALOGUE */
    .catalogue-col { display: flex; flex-direction: column; gap: .75rem; padding: 1rem; overflow: hidden; border-right: 1px solid #e2e8f0; }
    .search-header { display: flex; align-items: center; gap: .75rem; }
    .search-box { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: .55rem .9rem; flex: 1; }
    .search-box input { border: none; outline: none; background: none; font-family: 'Sora', sans-serif; font-size: .85rem; color: #1e293b; width: 100%; }
    .clear-search { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 2px; }
    .produit-count { font-size: .72rem; color: #94a3b8; white-space: nowrap; }
    .produit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; overflow-y: auto; flex: 1; padding-right: 4px; }
    .produit-tile { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: .9rem .75rem; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; transition: all .18s; text-align: center; position: relative; }
    .produit-tile:hover:not(:disabled) { border-color: #3b82f6; background: #eff6ff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59,130,246,.15); }
    .produit-tile:active:not(:disabled) { transform: translateY(0); }
    .produit-tile.rupture { opacity: .45; cursor: not-allowed; }
    .tile-avatar { width: 38px; height: 38px; background: #dbeafe; color: #1e40af; border-radius: 10px; display: grid; place-items: center; font-size: 1rem; font-weight: 700; }
    .tile-nom { font-size: .78rem; font-weight: 600; color: #1e293b; line-height: 1.2; }
    .tile-prix { font-size: .8rem; font-weight: 700; color: #3b82f6; }
    .tile-stock { font-size: .67rem; color: #94a3b8; }
    .tile-stock.low { color: #f97316; font-weight: 600; }
    .rupture .tile-stock { color: #ef4444; }
    .grid-skeleton { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr)); gap: 8px; }
    .skeleton-card { height: 110px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; border-radius: 12px; animation: shimmer 1.4s infinite; }
    @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
    .empty-catalogue { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #94a3b8; font-size: .83rem; }

    /* CAISSE COL (droite) */
    .caisse-col { display: flex; flex-direction: column; gap: .75rem; padding: 1rem; overflow-y: auto; background: #f8fafc; }

    /* STATS SESSION */
    .session-stats { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
    .sstat { background: #fff; border-radius: 10px; padding: .65rem .85rem; border-left: 3px solid #e2e8f0; }
    .sstat.green { border-left-color: #22c55e; }
    .sstat-label { display: block; font-size: .67rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; font-weight: 500; }
    .sstat-val { display: block; font-size: .95rem; font-weight: 700; color: #1e293b; margin-top: 2px; }

    /* PANIER BOX */
    .panier-box { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0; overflow: hidden; flex: 1; }
    .panier-header { display: flex; align-items: center; justify-content: space-between; padding: .75rem 1rem; border-bottom: 1px solid #f1f5f9; }
    .panier-header h3 { display: flex; align-items: center; gap: 8px; font-size: .85rem; font-weight: 700; color: #0f172a; }
    .badge { background: #3b82f6; color: #fff; border-radius: 50px; padding: 1px 7px; font-size: .7rem; font-weight: 700; }
    .btn-vider { background: none; border: none; color: #ef4444; font-family: 'Sora', sans-serif; font-size: .72rem; font-weight: 600; cursor: pointer; padding: 3px 8px; border-radius: 5px; }
    .btn-vider:hover { background: #fef2f2; }
    .panier-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #94a3b8; font-size: .78rem; padding: 1.5rem; }
    .panier-items { flex: 1; overflow-y: auto; max-height: 260px; }
    .panier-item { display: flex; align-items: center; gap: 6px; padding: .6rem 1rem; border-bottom: 1px solid #f8fafc; }
    .panier-item:last-child { border-bottom: none; }
    .item-info { flex: 1; min-width: 0; }
    .item-nom { display: block; font-size: .78rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-pu { display: block; font-size: .67rem; color: #94a3b8; }
    .item-qte { display: flex; align-items: center; gap: 4px; }
    .item-qte button { width: 22px; height: 22px; background: #f1f5f9; border: none; border-radius: 5px; cursor: pointer; font-size: .9rem; font-weight: 700; color: #475569; display: grid; place-items: center; }
    .item-qte button:hover { background: #e2e8f0; }
    .item-qte span { width: 22px; text-align: center; font-size: .8rem; font-weight: 700; color: #1e293b; }
    .item-total { font-size: .78rem; font-weight: 700; color: #16a34a; min-width: 65px; text-align: right; }
    .item-del { background: none; border: none; color: #cbd5e1; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 4px; }
    .item-del:hover { color: #ef4444; }
    .panier-total { padding: .75rem 1rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 6px; }
    .total-row { display: flex; justify-content: space-between; font-size: .8rem; color: #64748b; }
    .total-row.big { font-size: 1rem; font-weight: 700; color: #0f172a; padding-top: 4px; border-top: 1px dashed #e2e8f0; }
    .total-amount { color: #16a34a; font-size: 1.1rem; }

    /* ALERTS */
    .alert { display: flex; align-items: center; gap: 8px; padding: .65rem .9rem; border-radius: 8px; font-size: .78rem; font-weight: 500; }
    .alert.error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

    /* BOUTON ENCAISSER */
    .btn-encaisser { width: 100%; padding: .9rem; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: #fff; border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: .95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all .2s; box-shadow: 0 4px 12px rgba(59,130,246,.3); }
    .btn-encaisser:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(59,130,246,.4); }
    .btn-encaisser:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

    /* HISTORIQUE SESSION */
    .historique { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; }
    .historique h4 { font-size: .75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .05em; padding: .6rem .85rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .histo-list { max-height: 140px; overflow-y: auto; }
    .histo-item { display: flex; align-items: center; gap: 8px; padding: .5rem .85rem; border-bottom: 1px solid #f8fafc; font-size: .75rem; }
    .histo-item:last-child { border-bottom: none; }
    .histo-id { color: #3b82f6; font-weight: 700; min-width: 40px; }
    .histo-heure { color: #94a3b8; flex: 1; }
    .histo-articles { color: #64748b; }
    .histo-total { color: #16a34a; font-weight: 700; min-width: 80px; text-align: right; }

    /* SPINNER */
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }

    /* MODALS */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.55); backdrop-filter: blur(3px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal { background: #fff; border-radius: 16px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,.2); display: flex; flex-direction: column; max-height: 90vh; animation: slideUp .22s ease; }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem 1rem; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
    .modal-header h2 { font-size: 1rem; font-weight: 700; color: #0f172a; }
    .modal-close { background: #f1f5f9; border: none; border-radius: 8px; width: 30px; height: 30px; display: grid; place-items: center; cursor: pointer; color: #64748b; }
    .modal-close:hover { background: #e2e8f0; }
    .modal-body { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; }
    .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }
    .btn-secondary { padding: .5rem 1.1rem; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; }
    .btn-secondary:hover { background: #e2e8f0; }
    .btn-danger { padding: .5rem 1.1rem; background: #ef4444; color: #fff; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; }
    .btn-danger:hover { background: #dc2626; }

    /* REÇU */
    .recu-modal { max-width: 360px; }
    .recu-header { text-align: center; padding: 1.5rem 1.5rem .5rem; }
    .recu-logo { font-size: 1.2rem; font-weight: 800; color: #0f172a; letter-spacing: .08em; }
    .recu-sub { font-size: .72rem; color: #94a3b8; margin-top: 3px; }
    .recu-body { padding: 0 1.25rem 1rem; }
    .recu-meta { display: flex; flex-direction: column; gap: 3px; font-size: .75rem; color: #64748b; margin-bottom: .75rem; }
    .recu-divider { border: none; border-top: 1px dashed #e2e8f0; margin: .75rem 0; }
    .recu-table { width: 100%; border-collapse: collapse; font-size: .75rem; }
    .recu-table th { color: #94a3b8; font-weight: 600; padding: .3rem .25rem; text-align: left; font-size: .67rem; text-transform: uppercase; }
    .recu-table td { padding: .4rem .25rem; color: #334155; border-bottom: 1px solid #f8fafc; }
    .recu-table td.center { text-align: center; }
    .recu-table td.right  { text-align: right; }
    .recu-table td.bold   { font-weight: 700; }
    .recu-total-row { display: flex; justify-content: space-between; align-items: center; padding: .5rem 0; font-weight: 700; font-size: .92rem; color: #0f172a; }
    .recu-total-val { color: #16a34a; font-size: 1.05rem; font-weight: 800; }
    .recu-merci { text-align: center; font-size: .75rem; color: #94a3b8; margin-top: .75rem; }
    .recu-footer { padding: 1rem 1.25rem; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; justify-content: flex-end; }
    .btn-print { display: flex; align-items: center; gap: 6px; padding: .5rem 1rem; background: #0f172a; color: #fff; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; }
    .btn-print:hover { background: #1e293b; }

    /* RÉSUMÉ SESSION */
    .resume-modal { max-width: 440px; }
    .resume-stats { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
    .rstat { background: #f8fafc; border-radius: 10px; padding: .85rem 1rem; border-left: 3px solid #e2e8f0; }
    .rstat.green { border-left-color: #22c55e; }
    .rstat.blue  { border-left-color: #3b82f6; }
    .rstat-label { display: block; font-size: .68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; }
    .rstat-val { display: block; font-size: 1.05rem; font-weight: 700; color: #1e293b; margin-top: 3px; }

    /* PRINT */
    @media print {
        .app-shell, .navbar, .sidebar, .modal-overlay > *:not(.recu-modal) { display: none !important; }
        .recu-modal { box-shadow: none; border-radius: 0; max-width: 100%; animation: none; }
        .recu-footer { display: none; }
    }

    /* RESPONSIVE */
    @media (max-width: 960px) {
        .caisse-layout { grid-template-columns: 1fr 300px; }
    }
    @media (max-width: 860px) {
        .sidebar { transform: translateX(-100%); }
        .sidebar.open { transform: translateX(0); }
        .sidebar-overlay { display: block; }
        .sidebar-close { display: flex; }
        .main-area { margin-left: 0; }
        .burger { display: flex; }
        .content { overflow-y: auto; }
        :global(body) { overflow: auto; }
    }
    @media (max-width: 680px) {
        .caisse-layout { grid-template-columns: 1fr; grid-template-rows: auto 1fr; overflow-y: auto; }
        .catalogue-col { border-right: none; border-bottom: 1px solid #e2e8f0; max-height: 45vh; }
        .caisse-col { overflow-y: visible; }
        .user-name { display: none; }
        .navbar-center { display: none; }
    }
</style>