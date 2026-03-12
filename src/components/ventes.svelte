<script>
        import { onMount } from 'svelte';


        // CONFIG

        const BASE_URL     = "https://main-athena-api.onrender.com/api";
        const VENTES_URL   = `${BASE_URL}/ventes`;
        const PRODUITS_URL = `${BASE_URL}/produits`;

        const token = localStorage.getItem("token");
        const user  = JSON.parse(localStorage.getItem("user") || "{}");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        // LAYOUT
        let pageActive  = "ventes";
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
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
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
        // VENTES — état
        // ══════════════════════════════════
        let ventes      = [];
        let produits    = [];
        let chargement  = true;
        let erreur      = "";
        let successMsg  = "";

        // Filtres
        let recherche   = "";
        let dateDebut   = "";
        let dateFin     = "";

        // Modal détail
        let detailOuvert = false;
        let venteDetail  = null;
        let lignesDetail = [];
        let chargDetail  = false;

        // Modal nouvelle vente
        let modalVente     = false;
        let panier         = [];
        let enregistrement = false;
        let erreurVente    = "";
        let rechercheVente = "";

        // Confirmation suppression
        let confirmSuppr = false;
        let idSupprimer  = null;

        // ── Chargement initial ──
        onMount(async () => {
            await Promise.all([chargerVentes(), chargerProduits()]);
        });

        async function chargerVentes() {
            chargement = true; erreur = "";
            try {
                const res  = await fetch(VENTES_URL, { headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);
                ventes = data;
            } catch(e) { erreur = e.message; }
            finally { chargement = false; }
        }

        async function chargerProduits() {
            try {
                const res  = await fetch(PRODUITS_URL, { headers });
                const data = await res.json();
                if (res.ok) produits = data;
            } catch(_) {}
        }

        // ── Filtrage réactif ──
        $: ventesFiltrees = ventes.filter(v => {
            const terme = recherche.toLowerCase();
            const match = !terme || String(v.id).includes(terme) || String(v.total).includes(terme);
            const d = new Date(v.date_vente);
            const apresDebut = !dateDebut || d >= new Date(dateDebut);
            const avantFin   = !dateFin   || d <= new Date(dateFin + "T23:59:59");
            return match && apresDebut && avantFin;
        });

        $: totalFiltre = ventesFiltrees.reduce((s, v) => s + Number(v.total || 0), 0);
        $: panierMoyen = ventesFiltrees.length ? totalFiltre / ventesFiltrees.length : 0;

        // ── Détail vente ──
        async function voirDetail(v) {
            venteDetail = v; lignesDetail = []; detailOuvert = true; chargDetail = true;
            try {
                const res  = await fetch(`${VENTES_URL}/${v.id}`, { headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                lignesDetail = data;
            } catch(_) { lignesDetail = []; }
            finally { chargDetail = false; }
        }
        function fermerDetail() { detailOuvert = false; venteDetail = null; }

        // ── Suppression ──
        function demanderSuppr(id) { idSupprimer = id; confirmSuppr = true; }
        function annulerSuppr()    { confirmSuppr = false; idSupprimer = null; }

        async function confirmerSuppr() {
            try {
                const res = await fetch(`${VENTES_URL}/${idSupprimer}`, { method: "DELETE", headers });
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.message || `Erreur ${res.status}`);
                successMsg = "Vente annulée avec succès.";
                setTimeout(() => successMsg = "", 3500);
                confirmSuppr = false;
                await chargerVentes();
            } catch(e) { erreur = e.message; confirmSuppr = false; }
        }

        // ══════════════════════════════════
        // NOUVELLE VENTE — panier
        // ══════════════════════════════════
        function ouvrirModalVente() { panier = []; erreurVente = ""; rechercheVente = ""; modalVente = true; }
        function fermerModalVente() { modalVente = false; }

        function ajouterAuPanier(p) {
            const ex = panier.find(i => i.produit_id === p.id);
            if (ex) { if (ex.quantite < p.quantite_stock) ex.quantite++; panier = [...panier]; }
            else panier = [...panier, { produit_id: p.id, nom: p.nom, prix: Number(p.prix), quantite: 1, stock: p.quantite_stock }];
        }

        function retirerDuPanier(id) { panier = panier.filter(i => i.produit_id !== id); }

        function changerQuantite(id, val) {
            panier = panier.map(i => i.produit_id === id
                ? { ...i, quantite: Math.max(1, Math.min(i.stock, Number(val) || 1)) }
                : i);
        }

        $: totalPanier = panier.reduce((s, i) => s + i.prix * i.quantite, 0);
        $: produitsFiltres = produits.filter(p => (p.nom || "").toLowerCase().includes(rechercheVente.toLowerCase()));

        async function enregistrerVente() {
            if (panier.length === 0) { erreurVente = "Ajoutez au moins un produit."; return; }
            enregistrement = true; erreurVente = "";
            try {
                const res  = await fetch(`${VENTES_URL}/enregistre`, {
                    method: "POST", headers,
                    body: JSON.stringify({ produits: panier.map(i => ({ produit_id: i.produit_id, quantite: i.quantite })) })
                });
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.message || `Erreur ${res.status}`);
                successMsg = `Vente #${data.vente_id} enregistrée — Total : ${fmt(data.total)}`;
                setTimeout(() => successMsg = "", 4000);
                fermerModalVente();
                await Promise.all([chargerVentes(), chargerProduits()]);
            } catch(e) { erreurVente = e.message; }
            finally { enregistrement = false; }
        }

        // ── Utilitaires ──
        function fmt(n) { return Number(n || 0).toLocaleString("fr-FR") + " FCFA"; }
        function fmtDate(d) {
            if (!d) return "—";
            return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
        }
        function initiales(nom) {
            if (!nom) return "?";
            return nom.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        }
    </script>

    <!-- ══ STRUCTURE PRINCIPALE ══ -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="app-shell" on:click={() => { menuVisible = false; }}>

        <!-- SIDEBAR OVERLAY MOBILE -->
        {#if sidebarOpen}
            <button class="sidebar-overlay" on:click={() => sidebarOpen = false} aria-label="Fermer menu"></button>
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
                    <button class="nav-item" class:active={pageActive === m.id}
                            on:click={() => navigate(m.hash, m.id)}>
                        <span class="nav-icon">{@html m.icon}</span>
                        <span class="nav-label">{m.label}</span>
                    </button>
                {/each}
            </nav>
            <div class="sidebar-footer">
                <div class="user-mini">
                    <div class="user-avatar-sm">{initiales(user.nom)}</div>
                    <div class="user-info-sm">
                        <span class="user-name-sm">{user.nom || "Utilisateur"}</span>
                        <span class="user-role-sm">{user.role || "—"}</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- MAIN AREA -->
        <div class="main-area">

            <!-- NAVBAR -->
            <header class="navbar">
                <div class="navbar-left">
                    <button class="burger" on:click|stopPropagation={toggleSidebar} aria-label="Ouvrir le menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                    <div class="navbar-title">
                        <span class="page-title">Ventes</span>
                        <span class="page-sub">Historique & caisse</span>
                    </div>
                </div>
                <div class="navbar-right">
                    <button class="btn-primary" on:click={ouvrirModalVente}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                        Nouvelle vente
                    </button>
                    <div class="user-menu" on:click|stopPropagation={toggleMenu}
                        on:keydown={(e) => (e.key==="Enter"||e.key===" ") && toggleMenu()}
                        role="button" tabindex="0">
                        <div class="user-avatar">{initiales(user.nom)}</div>
                        <span class="user-name">{user.nom || "Utilisateur"}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {#if menuVisible}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="dropdown" on:click|stopPropagation role="menu" tabindex="-1">
                                <a href="#/profil" class="dropdown-item">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                    Mon profil
                                </a>
                                <a href="#/parametres" class="dropdown-item">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                    Paramètres
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

            <!-- CONTENT -->
            <main class="content">

                {#if successMsg}
                    <div class="alert success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {successMsg}
                    </div>
                {/if}
                {#if erreur}
                    <div class="alert error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        {erreur}
                    </div>
                {/if}

                <!-- Stats -->
                <div class="stats-bar">
                    <div class="stat-chip">
                        <span class="chip-label">Nombre de ventes</span>
                        <span class="chip-val">{ventesFiltrees.length}</span>
                    </div>
                    <div class="stat-chip green">
                        <span class="chip-label">Chiffre d'affaires</span>
                        <span class="chip-val">{fmt(totalFiltre)}</span>
                    </div>
                    <div class="stat-chip blue">
                        <span class="chip-label">Panier moyen</span>
                        <span class="chip-val">{ventesFiltrees.length ? fmt(panierMoyen) : "—"}</span>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="toolbar">
                    <div class="search-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        <input type="text" placeholder="Rechercher par ID ou montant…" bind:value={recherche} />
                    </div>
                    <div class="date-filters">
                        <label><span>Du</span><input type="date" bind:value={dateDebut} /></label>
                        <label><span>Au</span><input type="date" bind:value={dateFin} /></label>
                        {#if dateDebut || dateFin}
                            <button class="btn-reset" on:click={() => { dateDebut = ""; dateFin = ""; }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                                Effacer
                            </button>
                        {/if}
                    </div>
                </div>

                <!-- Tableau -->
                <div class="panel">
                    {#if chargement}
                        <div class="skeleton-list">
                            {#each [1,2,3,4,5] as _}<div class="skeleton-row"></div>{/each}
                        </div>
                    {:else if ventesFiltrees.length === 0}
                        <div class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            <p>Aucune vente trouvée</p>
                            <button class="btn-primary" on:click={ouvrirModalVente}>Enregistrer une vente</button>
                        </div>
                    {:else}
                        <div class="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#ID</th>
                                        <th>Date</th>
                                        <th>Caissier</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each ventesFiltrees as v}
                                        <tr>
                                            <td><span class="id-badge">#{v.id}</span></td>
                                            <td class="date-cell">{fmtDate(v.date_vente)}</td>
                                            <td>
                                                <span class="user-chip">
                                                    <span class="user-dot">{initiales(user.nom)}</span>
                                                    {user.nom || `User #${v.user_id}`}
                                                </span>
                                            </td>
                                            <td><span class="montant">{fmt(v.total)}</span></td>
                                            <td>
                                                <div class="actions">
                                                    <button class="btn-icon view" on:click={() => voirDetail(v)} title="Voir détails">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                                                    </button>
                                                    <button class="btn-icon delete" on:click={() => demanderSuppr(v.id)} title="Annuler la vente">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {/if}
                </div>

            </main>
        </div>
    </div>


    <svelte:window on:keydown={(e) => {
        if (e.key !== 'Escape') return;
        if (detailOuvert) fermerDetail();
        else if (modalVente) fermerModalVente();
        else if (confirmSuppr) annulerSuppr();
    }} />

    <!-- ══ MODAL DÉTAIL VENTE ══ -->
    {#if detailOuvert}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-overlay" on:click={fermerDetail}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="modal modal-detail" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
                <div class="modal-header">
                    <div>
                        <h2>Détail vente <span class="id-badge">#{venteDetail?.id}</span></h2>
                        <p class="modal-sub">{fmtDate(venteDetail?.date_vente)}</p>
                    </div>
                    <button class="modal-close" on:click={fermerDetail} aria-label="Fermer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </div>
                <div class="modal-body">
                    {#if chargDetail}
                        <div class="skeleton-list">{#each [1,2,3] as _}<div class="skeleton-row"></div>{/each}</div>
                    {:else if lignesDetail.length === 0}
                        <div class="empty-state small"><p>Aucun détail disponible.</p></div>
                    {:else}
                        <table class="detail-table">
                            <thead>
                                <tr><th>Produit ID</th><th>Qté</th><th>Prix unitaire</th><th>Sous-total</th></tr>
                            </thead>
                            <tbody>
                                {#each lignesDetail as l}
                                    <tr>
                                        <td>Produit #{l.produit_id}</td>
                                        <td><span class="qty-badge">{l.quantite}</span></td>
                                        <td>{fmt(l.prix_unitaire)}</td>
                                        <td class="montant">{fmt(l.prix_unitaire * l.quantite)}</td>
                                    </tr>
                                {/each}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="total-label">Total</td>
                                    <td class="montant total-val">{fmt(venteDetail?.total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    {/if}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" on:click={fermerDetail}>Fermer</button>
                </div>
            </div>
        </div>
    {/if}

    <!-- ══ MODAL NOUVELLE VENTE ══ -->
    {#if modalVente}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-overlay" on:click={fermerModalVente}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="modal modal-vente" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
                <div class="modal-header">
                    <h2>Nouvelle vente</h2>
                    <button class="modal-close" on:click={fermerModalVente} aria-label="Fermer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </div>

                {#if erreurVente}
                    <div class="alert error" style="margin: 0 1.5rem 0.5rem;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        {erreurVente}
                    </div>
                {/if}

                <div class="modal-body vente-body">
                    <!-- Catalogue -->
                    <div class="catalogue">
                        <div class="catalogue-header">
                            <h3>Produits disponibles</h3>
                            <div class="search-box small">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                <input type="text" placeholder="Rechercher…" bind:value={rechercheVente} />
                            </div>
                        </div>
                        <div class="produit-grid">
                            {#each produitsFiltres as p}
                                <button class="produit-card" class:disabled={p.quantite_stock === 0}
                                        on:click={() => p.quantite_stock > 0 && ajouterAuPanier(p)}
                                        disabled={p.quantite_stock === 0}>
                                    <div class="produit-avatar">{(p.nom || "?")[0].toUpperCase()}</div>
                                    <div class="produit-info">
                                        <span class="produit-nom">{p.nom}</span>
                                        <span class="produit-prix">{fmt(p.prix)}</span>
                                    </div>
                                    <span class="produit-stock" class:rupture={p.quantite_stock === 0}>
                                        {p.quantite_stock === 0 ? "Rupture" : `Stock : ${p.quantite_stock}`}
                                    </span>
                                    {#if p.quantite_stock > 0}<span class="add-plus">+</span>{/if}
                                </button>
                            {/each}
                            {#if produitsFiltres.length === 0}
                                <p class="no-result">Aucun produit trouvé</p>
                            {/if}
                        </div>
                    </div>

                    <!-- Panier -->
                    <div class="panier">
                        <h3>Panier <span class="badge-count">{panier.length}</span></h3>
                        {#if panier.length === 0}
                            <div class="panier-empty">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                <p>Cliquez sur un produit pour l'ajouter</p>
                            </div>
                        {:else}
                            <div class="panier-list">
                                {#each panier as item}
                                    <div class="panier-item">
                                        <div class="panier-item-info">
                                            <span class="panier-nom">{item.nom}</span>
                                            <span class="panier-prix-u">{fmt(item.prix)} / u</span>
                                        </div>
                                        <div class="panier-qte">
                                            <button on:click={() => changerQuantite(item.produit_id, item.quantite - 1)}>−</button>
                                            <input type="number" min="1" max={item.stock} value={item.quantite}
                                                on:change={(e) => changerQuantite(item.produit_id, e.target.value)} />
                                            <button on:click={() => changerQuantite(item.produit_id, item.quantite + 1)}>+</button>
                                        </div>
                                        <span class="panier-subtotal">{fmt(item.prix * item.quantite)}</span>
                                        <button class="panier-remove" on:click={() => retirerDuPanier(item.produit_id)} aria-label="Retirer du panier">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                                        </button>
                                    </div>
                                {/each}
                            </div>
                            <div class="panier-total">
                                <span>Total</span>
                                <span class="panier-total-val">{fmt(totalPanier)}</span>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-secondary" on:click={fermerModalVente}>Annuler</button>
                    <button class="btn-primary" on:click={enregistrerVente}
                            disabled={enregistrement || panier.length === 0}>
                        {#if enregistrement}
                            <span class="spinner"></span> Enregistrement…
                        {:else}
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            Confirmer · {fmt(totalPanier)}
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <!-- ══ MODAL CONFIRMATION SUPPRESSION ══ -->
    {#if confirmSuppr}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-overlay" on:click={annulerSuppr}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="modal modal-confirm" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
                <div class="confirm-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ef4444" stroke-width="2" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <h3>Annuler cette vente ?</h3>
                <p>La vente <strong>#{idSupprimer}</strong> sera supprimée définitivement.<br/>Cette action est irréversible.</p>
                <div class="confirm-actions">
                    <button class="btn-secondary" on:click={annulerSuppr}>Non, garder</button>
                    <button class="btn-danger" on:click={confirmerSuppr}>Oui, annuler</button>
                </div>
            </div>
        </div>
    {/if}

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :global(body) { font-family: 'Sora', sans-serif; background: #f1f5f9; color: #1e293b; overflow: hidden; }

        /* ── LAYOUT ── */
        :global(:root) { --sidebar-w: 230px; }
        .app-shell { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

        /* SIDEBAR */
        .sidebar {
            width: 230px; background: #0f172a; color: #e2e8f0;
            display: flex; flex-direction: column; flex-shrink: 0;
            height: 100vh; position: fixed; left: 0; top: 0; z-index: 200;
            transform: translateX(0); transition: transform .28s cubic-bezier(.4,0,.2,1);
        }
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
        .navbar { height: 60px; background: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; flex-shrink: 0; gap: 1rem; }
        .navbar-left { display: flex; align-items: center; gap: 12px; }
        .burger { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 6px; border-radius: 6px; display: none; }
        .navbar-title { display: flex; flex-direction: column; }
        .page-title { font-size: .95rem; font-weight: 700; color: #f8fafc; line-height: 1.2; }
        .page-sub { font-size: .7rem; color: #64748b; }
        .navbar-right { display: flex; align-items: center; gap: 12px; }
        .btn-primary { display: flex; align-items: center; gap: 7px; padding: .5rem 1rem; background: #3b82f6; color: #fff; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .8rem; font-weight: 600; cursor: pointer; transition: background .18s; white-space: nowrap; }
        .btn-primary:hover:not(:disabled) { background: #2563eb; }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .user-menu { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 6px 10px; border-radius: 8px; transition: background .18s; position: relative; }
        .user-menu:hover { background: rgba(255,255,255,.07); }
        .user-avatar { width: 30px; height: 30px; background: #1e40af; border-radius: 50%; display: grid; place-items: center; font-size: .72rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .user-name { font-size: .8rem; font-weight: 600; color: #e2e8f0; }
        .dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,.15); min-width: 180px; overflow: hidden; z-index: 300; animation: fadeIn .15s ease; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .dropdown-item { display: flex; align-items: center; gap: 10px; padding: .65rem 1rem; font-family: 'Sora', sans-serif; font-size: .82rem; color: #334155; text-decoration: none; background: none; border: none; cursor: pointer; width: 100%; transition: background .15s; }
        .dropdown-item:hover { background: #f1f5f9; }
        .dropdown-item.logout { color: #ef4444; }
        .dropdown-item.logout:hover { background: #fef2f2; }
        .dropdown-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

        /* CONTENT */
        .content { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

        /* ALERTS */
        .alert { display: flex; align-items: center; gap: 10px; padding: .75rem 1rem; border-radius: 8px; font-size: .82rem; font-weight: 500; }
        .alert.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .alert.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

        /* STATS */
        .stats-bar { display: flex; gap: 1rem; flex-wrap: wrap; }
        .stat-chip { background: #fff; border-radius: 10px; padding: .75rem 1.1rem; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 1px 4px rgba(0,0,0,.06); border-left: 4px solid #e2e8f0; flex: 1; min-width: 140px; }
        .stat-chip.green { border-left-color: #22c55e; }
        .stat-chip.blue  { border-left-color: #3b82f6; }
        .chip-label { font-size: .7rem; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }
        .chip-val { font-size: 1rem; font-weight: 700; color: #1e293b; }

        /* TOOLBAR */
        .toolbar { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
        .search-box { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: .5rem .85rem; flex: 1; min-width: 200px; }
        .search-box.small { padding: .4rem .7rem; min-width: 140px; flex: 1; }
        .search-box input { border: none; outline: none; background: none; font-family: 'Sora', sans-serif; font-size: .82rem; color: #1e293b; width: 100%; }
        .date-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .date-filters label { display: flex; align-items: center; gap: 6px; font-size: .78rem; color: #64748b; font-weight: 500; }
        .date-filters input[type="date"] { border: 1px solid #e2e8f0; border-radius: 7px; padding: .45rem .65rem; font-family: 'Sora', sans-serif; font-size: .78rem; color: #1e293b; background: #fff; outline: none; }
        .date-filters input[type="date"]:focus { border-color: #93c5fd; }
        .btn-reset { display: flex; align-items: center; gap: 5px; padding: .45rem .75rem; background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; border-radius: 7px; font-family: 'Sora', sans-serif; font-size: .75rem; font-weight: 600; cursor: pointer; }

        /* PANEL / TABLE */
        .panel { background: #fff; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #f8fafc; border-bottom: 2px solid #f1f5f9; }
        th { padding: .75rem 1rem; text-align: left; font-size: .72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
        td { padding: .85rem 1rem; font-size: .82rem; color: #334155; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover td { background: #f8fafc; }
        .id-badge { background: #eff6ff; color: #3b82f6; padding: 2px 8px; border-radius: 6px; font-size: .75rem; font-weight: 700; }
        .date-cell { color: #64748b; font-size: .78rem; }
        .user-chip { display: inline-flex; align-items: center; gap: 6px; font-size: .8rem; }
        .user-dot { width: 22px; height: 22px; background: #dbeafe; color: #1e40af; border-radius: 50%; display: grid; place-items: center; font-size: .65rem; font-weight: 700; flex-shrink: 0; }
        .montant { font-weight: 700; color: #16a34a; font-size: .85rem; }
        .actions { display: flex; gap: 6px; }
        .btn-icon { width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer; display: grid; place-items: center; transition: all .18s; }
        .btn-icon.view   { background: #eff6ff; color: #3b82f6; }
        .btn-icon.view:hover   { background: #dbeafe; }
        .btn-icon.delete { background: #fef2f2; color: #ef4444; }
        .btn-icon.delete:hover { background: #fee2e2; }

        /* SKELETON */
        .skeleton-list { padding: 1rem; display: flex; flex-direction: column; gap: 10px; }
        .skeleton-row { height: 44px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; border-radius: 8px; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* EMPTY */
        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 3rem 1rem; color: #94a3b8; font-size: .85rem; }
        .empty-state.small { padding: 1.5rem; }

        /* MODALS */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.55); backdrop-filter: blur(3px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: #fff; border-radius: 16px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,.2); display: flex; flex-direction: column; max-height: 90vh; animation: slideUp .22s ease; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        .modal-detail  { max-width: 560px; }
        .modal-vente   { max-width: 900px; }
        .modal-confirm { max-width: 420px; padding: 2rem; text-align: center; }
        .modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.25rem 1.5rem 1rem; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
        .modal-header h2 { font-size: 1rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .modal-sub { font-size: .75rem; color: #64748b; margin-top: 3px; }
        .modal-close { background: #f1f5f9; border: none; border-radius: 8px; width: 30px; height: 30px; display: grid; place-items: center; cursor: pointer; color: #64748b; flex-shrink: 0; }
        .modal-close:hover { background: #e2e8f0; }
        .modal-body { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; }
        .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }
        .btn-secondary { padding: .5rem 1.1rem; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; }
        .btn-secondary:hover { background: #e2e8f0; }
        .btn-danger { padding: .5rem 1.1rem; background: #ef4444; color: #fff; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; }
        .btn-danger:hover { background: #dc2626; }

        /* DETAIL TABLE */
        .detail-table { width: 100%; border-collapse: collapse; font-size: .82rem; }
        .detail-table th { padding: .6rem .85rem; background: #f8fafc; color: #64748b; font-size: .7rem; text-transform: uppercase; letter-spacing: .04em; text-align: left; border-bottom: 2px solid #f1f5f9; }
        .detail-table td { padding: .75rem .85rem; border-bottom: 1px solid #f8fafc; color: #334155; }
        .detail-table tfoot td { border-top: 2px solid #e2e8f0; border-bottom: none; padding-top: .85rem; }
        .total-label { color: #64748b; font-weight: 600; text-align: right; }
        .total-val { font-size: 1rem; font-weight: 700; color: #16a34a; }
        .qty-badge { background: #eff6ff; color: #3b82f6; padding: 2px 8px; border-radius: 6px; font-size: .75rem; font-weight: 700; }

        /* NOUVELLE VENTE */
        .vente-body { display: grid; grid-template-columns: 1fr 320px; gap: 1.25rem; }
        .catalogue { display: flex; flex-direction: column; gap: .75rem; }
        .catalogue-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .catalogue-header h3, .panier h3 { font-size: .85rem; font-weight: 700; color: #0f172a; }
        .produit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 4px; }
        .produit-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: .7rem; display: flex; flex-direction: column; gap: 5px; cursor: pointer; transition: all .18s; text-align: left; position: relative; overflow: hidden; }
        .produit-card:hover:not(.disabled) { border-color: #93c5fd; background: #eff6ff; }
        .produit-card.disabled { opacity: .5; cursor: not-allowed; }
        .produit-avatar { width: 30px; height: 30px; background: #dbeafe; color: #1e40af; border-radius: 8px; display: grid; place-items: center; font-size: .85rem; font-weight: 700; }
        .produit-info { display: flex; flex-direction: column; gap: 1px; }
        .produit-nom { font-size: .78rem; font-weight: 600; color: #1e293b; }
        .produit-prix { font-size: .75rem; color: #3b82f6; font-weight: 700; }
        .produit-stock { font-size: .68rem; color: #94a3b8; }
        .produit-stock.rupture { color: #ef4444; }
        .add-plus { position: absolute; top: 6px; right: 8px; font-size: 1.1rem; font-weight: 700; color: #3b82f6; opacity: 0; transition: opacity .15s; }
        .produit-card:hover:not(.disabled) .add-plus { opacity: 1; }
        .no-result { font-size: .78rem; color: #94a3b8; grid-column: 1/-1; text-align: center; padding: 1rem; }

        /* PANIER */
        .panier { background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: .75rem; padding: 1rem; overflow: hidden; }
        .badge-count { background: #3b82f6; color: #fff; border-radius: 50px; padding: 1px 7px; font-size: .7rem; font-weight: 700; }
        .panier-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #94a3b8; font-size: .78rem; padding: 1.5rem 0; }
        .panier-list { display: flex; flex-direction: column; gap: 8px; overflow-y: auto; max-height: 260px; }
        .panier-item { background: #fff; border-radius: 8px; padding: .6rem .7rem; display: flex; align-items: center; gap: 7px; border: 1px solid #e2e8f0; }
        .panier-item-info { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .panier-nom { font-size: .76rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .panier-prix-u { font-size: .67rem; color: #94a3b8; }
        .panier-qte { display: flex; align-items: center; gap: 3px; }
        .panier-qte button { width: 22px; height: 22px; background: #f1f5f9; border: none; border-radius: 5px; cursor: pointer; font-size: .9rem; font-weight: 700; color: #475569; display: grid; place-items: center; }
        .panier-qte button:hover { background: #e2e8f0; }
        .panier-qte input { width: 36px; height: 22px; text-align: center; border: 1px solid #e2e8f0; border-radius: 5px; font-family: 'Sora', sans-serif; font-size: .75rem; font-weight: 700; color: #1e293b; outline: none; background: #fff; }
        .panier-subtotal { font-size: .76rem; font-weight: 700; color: #16a34a; white-space: nowrap; min-width: 68px; text-align: right; }
        .panier-remove { background: none; border: none; color: #ef4444; cursor: pointer; padding: 3px; border-radius: 4px; display: grid; place-items: center; }
        .panier-remove:hover { background: #fef2f2; }
        .panier-total { display: flex; justify-content: space-between; align-items: center; padding: .6rem .75rem; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; }
        .panier-total span:first-child { font-size: .8rem; font-weight: 600; color: #64748b; }
        .panier-total-val { font-size: 1rem; font-weight: 800; color: #16a34a; }

        /* CONFIRM */
        .confirm-icon { margin-bottom: 1rem; }
        .modal-confirm h3 { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin-bottom: .5rem; }
        .modal-confirm p { font-size: .83rem; color: #64748b; margin-bottom: 1.5rem; line-height: 1.5; }
        .confirm-actions { display: flex; gap: 10px; justify-content: center; }

        /* SPINNER */
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* RESPONSIVE */
        @media (max-width: 860px) {
            .sidebar { transform: translateX(-100%); }
            .sidebar.open { transform: translateX(0); }
            .sidebar-overlay { display: block; }
            .sidebar-close { display: flex; }
            .main-area { margin-left: 0; }
            .burger { display: flex; }
            :global(body) { overflow: auto; }
            .app-shell, .main-area { overflow: auto; }
        }
        @media (max-width: 700px) {
            .vente-body { grid-template-columns: 1fr; }
            .user-name { display: none; }
            .stats-bar { gap: .6rem; }
        }
        @media (max-width: 500px) {
            .content { padding: 1rem; }
            .toolbar { flex-direction: column; align-items: stretch; }
        }
    </style>