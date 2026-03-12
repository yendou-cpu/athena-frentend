<script>
        import { onMount } from 'svelte';

        // ══════════════════════════════════
        // CONFIG
        // ══════════════════════════════════
        const BASE_URL     = "https://main-athena-api.onrender.com/api";
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
        let pageActive  = "stock";
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
            { id: "tableau-de-bord", label: "Tableau de Bord", hash: "#/acceuil",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>` },
            { id: "produits", label: "Produits", hash: "#/produits",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" stroke-width="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2"/></svg>` },
            { id: "ventes", label: "Ventes", hash: "#/ventes",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
            { id: "clients", label: "Caissier", hash: "#/caissier",
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>` },
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
        // STOCK — état
        // ══════════════════════════════════
        let produits      = [];
        let chargement    = true;
        let erreur        = "";
        let successMsg    = "";

        let recherche     = "";
        let filtre        = "tous"; // tous | ok | faible | rupture

        // Modal ajustement stock
        let modalOuverte  = false;
        let produitEdit   = null;
        let nouvelleQte   = 0;
        let nouveauSeuil  = 5;
        let enregistrement = false;
        let erreurModal   = "";

        // Historique local des mouvements (session)
        let historique    = [];

        onMount(async () => {
            await chargerProduits();
        });

        async function chargerProduits() {
            chargement = true; erreur = "";
            try {
                const res  = await fetch(PRODUITS_URL, { headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);
                produits = data;
            } catch(e) { erreur = e.message; }
            finally { chargement = false; }
        }

        // ── Statut stock ──
        function statut(p) {
            const q = Number(p.quantite_stock ?? 0);
            const s = Number(p.seuil_alerte   ?? 5);
            if (q === 0)   return { label: "Rupture",      cls: "rupture", color: "#ef4444" };
            if (q < s)     return { label: "Stock faible", cls: "faible",  color: "#f97316" };
            return               { label: "En stock",     cls: "ok",      color: "#22c55e" };
        }

        // ── Filtrage réactif ──
        $: produitsFiltres = produits
            .filter(p => (p.nom || "").toLowerCase().includes(recherche.toLowerCase()))
            .filter(p => {
                if (filtre === "ok")      return statut(p).cls === "ok";
                if (filtre === "faible")  return statut(p).cls === "faible";
                if (filtre === "rupture") return statut(p).cls === "rupture";
                return true;
            });

        // ── Stats réactives ──
        $: nbOk      = produits.filter(p => statut(p).cls === "ok").length;
        $: nbFaible  = produits.filter(p => statut(p).cls === "faible").length;
        $: nbRupture = produits.filter(p => statut(p).cls === "rupture").length;
        $: valeurStock = produits.reduce((s, p) => s + Number(p.prix||0) * Number(p.quantite_stock||0), 0);

        // ── Modal ajustement ──
        function ouvrirModal(p) {
            produitEdit   = p;
            nouvelleQte   = p.quantite_stock;
            nouveauSeuil  = p.seuil_alerte ?? 5;
            erreurModal   = "";
            modalOuverte  = true;
        }
        function fermerModal() { modalOuverte = false; produitEdit = null; }

        async function sauvegarderStock() {
            if (nouvelleQte < 0) { erreurModal = "La quantité ne peut pas être négative."; return; }
            enregistrement = true; erreurModal = "";
            try {
                const res  = await fetch(`${PRODUITS_URL}/${produitEdit.id}`, {
                    method: "PUT", headers,
                    body: JSON.stringify({
                        nom:            produitEdit.nom,
                        prix:           produitEdit.prix,
                        quantite_stock: parseInt(nouvelleQte) || 0,
                        seuil_alerte:   parseInt(nouveauSeuil) || 5,
                    })
                });
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.message || `Erreur ${res.status}`);

                // Enregistrer le mouvement dans l'historique local
                const diff = parseInt(nouvelleQte) - produitEdit.quantite_stock;
                historique = [{
                    produit: produitEdit.nom,
                    avant:   produitEdit.quantite_stock,
                    apres:   parseInt(nouvelleQte),
                    diff,
                    date:    new Date(),
                }, ...historique].slice(0, 50);

                successMsg = `Stock de "${produitEdit.nom}" mis à jour.`;
                setTimeout(() => successMsg = "", 3500);
                fermerModal();
                await chargerProduits();
            } catch(e) { erreurModal = e.message; }
            finally { enregistrement = false; }
        }

        // ── Utilitaires ──
        function fmt(n) { return Number(n || 0).toLocaleString("fr-FR") + " FCFA"; }
        function fmtDate(d) {
            if (!d) return "—";
            return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        }
        function initiales(nom) {
            if (!nom) return "?";
            return nom.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        }
        function pct(p) {
            const q = Number(p.quantite_stock || 0);
            const max = Math.max(...produits.map(x => Number(x.quantite_stock || 0)), 1);
            return Math.round((q / max) * 100);
        }
    </script>

    <svelte:window on:keydown={(e) => {
        if (e.key === 'Escape' && modalOuverte) fermerModal();
    }} />

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
                        <span class="user-name-sm">{user.nom || "Utilisateur"}</span>
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
                        <span class="page-title">Stock</span>
                        <span class="page-sub">Gestion des inventaires</span>
                    </div>
                </div>
                <div class="navbar-right">
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {successMsg}
                    </div>
                {/if}
                {#if erreur}
                    <div class="alert error">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        {erreur}
                    </div>
                {/if}

                <!-- STATS CARDS -->
                <div class="stats-row">
                    <div class="stat-card" class:clickable={true} on:click={() => filtre = filtre === "ok" ? "tous" : "ok"}
                        on:keydown={(e) => e.key==="Enter" && (filtre = filtre === "ok" ? "tous" : "ok")}
                        role="button" tabindex="0" class:active-filter={filtre === "ok"}>
                        <div class="stat-icon green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="9 12 11 14 15 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">En stock</span>
                            <span class="stat-val green">{nbOk}</span>
                        </div>
                    </div>
                    <div class="stat-card" on:click={() => filtre = filtre === "faible" ? "tous" : "faible"}
                        on:keydown={(e) => e.key==="Enter" && (filtre = filtre === "faible" ? "tous" : "faible")}
                        role="button" tabindex="0" class:active-filter={filtre === "faible"}>
                        <div class="stat-icon orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Stock faible</span>
                            <span class="stat-val orange">{nbFaible}</span>
                        </div>
                    </div>
                    <div class="stat-card" on:click={() => filtre = filtre === "rupture" ? "tous" : "rupture"}
                        on:keydown={(e) => e.key==="Enter" && (filtre = filtre === "rupture" ? "tous" : "rupture")}
                        role="button" tabindex="0" class:active-filter={filtre === "rupture"}>
                        <div class="stat-icon red">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Rupture</span>
                            <span class="stat-val red">{nbRupture}</span>
                        </div>
                    </div>
                    <div class="stat-card blue">
                        <div class="stat-icon blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Valeur stock</span>
                            <span class="stat-val blue">{fmt(valeurStock)}</span>
                        </div>
                    </div>
                </div>

                <!-- ALERTE RUPTURES -->
                {#if nbRupture > 0 || nbFaible > 0}
                    <div class="alerte-banner">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        <span>
                            {#if nbRupture > 0}<strong>{nbRupture} produit(s) en rupture</strong>{/if}
                            {#if nbRupture > 0 && nbFaible > 0} · {/if}
                            {#if nbFaible > 0}<strong>{nbFaible} produit(s) en stock faible</strong>{/if}
                            — Pensez à réapprovisionner.
                        </span>
                        <button class="alerte-action" on:click={() => filtre = "rupture"}>Voir ruptures</button>
                    </div>
                {/if}

                <!-- LAYOUT PRINCIPAL -->
                <div class="main-layout">

                    <!-- TABLE STOCK -->
                    <div class="panel">
                        <div class="panel-header">
                            <div class="search-box">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                <input type="text" placeholder="Rechercher un produit…" bind:value={recherche} />
                            </div>
                            <div class="filtres">
                                {#each [["tous","Tous"],["ok","En stock"],["faible","Faible"],["rupture","Rupture"]] as [val, label]}
                                    <button class="filtre-btn" class:active={filtre === val}
                                            on:click={() => filtre = val}>{label}</button>
                                {/each}
                            </div>
                        </div>

                        {#if chargement}
                            <div class="skeleton-list">
                                {#each [1,2,3,4,5] as _}<div class="skeleton-row"></div>{/each}
                            </div>
                        {:else if produitsFiltres.length === 0}
                            <div class="empty-state">
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                <p>Aucun produit trouvé</p>
                            </div>
                        {:else}
                            <div class="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Prix</th>
                                            <th>Stock actuel</th>
                                            <th>Seuil alerte</th>
                                            <th>Niveau</th>
                                            <th>Statut</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each produitsFiltres as p}
                                            {@const st = statut(p)}
                                            <tr>
                                                <td>
                                                    <div class="produit-cell">
                                                        <div class="produit-avatar">{(p.nom||"?")[0].toUpperCase()}</div>
                                                        <span class="produit-nom">{p.nom}</span>
                                                    </div>
                                                </td>
                                                <td class="prix-cell">{fmt(p.prix)}</td>
                                                <td>
                                                    <span class="qty" class:zero={p.quantite_stock === 0}>{p.quantite_stock ?? 0}</span>
                                                </td>
                                                <td class="seuil-cell">{p.seuil_alerte ?? 5}</td>
                                                <td class="barre-cell">
                                                    <div class="barre-wrap">
                                                        <div class="barre" style="width:{pct(p)}%; background:{st.color}"></div>
                                                    </div>
                                                    <span class="barre-pct">{pct(p)}%</span>
                                                </td>
                                                <td>
                                                    <span class="badge {st.cls}">{st.label}</span>
                                                </td>
                                                <td>
                                                    <button class="btn-ajuster" on:click={() => ouvrirModal(p)}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                                        Ajuster
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        {/if}
                    </div>

                    <!-- HISTORIQUE MOUVEMENTS -->
                    {#if historique.length > 0}
                        <div class="panel historique-panel">
                            <div class="histo-title">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                Historique des ajustements (session)
                            </div>
                            <div class="histo-list">
                                {#each historique as h}
                                    <div class="histo-item">
                                        <div class="histo-avatar">{(h.produit||"?")[0].toUpperCase()}</div>
                                        <div class="histo-info">
                                            <span class="histo-nom">{h.produit}</span>
                                            <span class="histo-detail">{h.avant} → {h.apres} unités</span>
                                        </div>
                                        <span class="histo-diff" class:pos={h.diff > 0} class:neg={h.diff < 0}>
                                            {h.diff > 0 ? "+" : ""}{h.diff}
                                        </span>
                                        <span class="histo-heure">{fmtDate(h.date)}</span>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}

                </div>
            </main>
        </div>
    </div>

    <!-- ══ MODAL AJUSTEMENT STOCK ══ -->
    {#if modalOuverte && produitEdit}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-overlay" on:click={fermerModal}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="modal" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
                <div class="modal-header">
                    <div>
                        <h2>Ajuster le stock</h2>
                        <p class="modal-sub">{produitEdit.nom}</p>
                    </div>
                    <button class="modal-close" on:click={fermerModal} aria-label="Fermer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </div>
                <div class="modal-body">

                    {#if erreurModal}
                        <div class="alert error" style="margin-bottom:1rem">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                            {erreurModal}
                        </div>
                    {/if}

                    <!-- Stock actuel -->
                    <div class="stock-actuel">
                        <div class="sa-item">
                            <span class="sa-label">Stock actuel</span>
                            <span class="sa-val">{produitEdit.quantite_stock ?? 0} unités</span>
                        </div>
                        <div class="sa-item">
                            <span class="sa-label">Seuil d'alerte actuel</span>
                            <span class="sa-val">{produitEdit.seuil_alerte ?? 5} unités</span>
                        </div>
                        <div class="sa-item">
                            <span class="sa-label">Statut actuel</span>
                            <span class="badge {statut(produitEdit).cls}">{statut(produitEdit).label}</span>
                        </div>
                    </div>

                    <!-- Raccourcis ajustement rapide -->
                    <div class="raccourcis">
                        <span class="raccourcis-label">Ajustement rapide</span>
                        <div class="raccourcis-btns">
                            {#each [-10,-5,-1,+1,+5,+10,+20,+50] as v}
                                <button class="raccourci" class:pos={v>0} class:neg={v<0}
                                        on:click={() => nouvelleQte = Math.max(0, Number(nouvelleQte)+v)}>
                                    {v>0?"+":""}{v}
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Champs -->
                    <div class="form-grid">
                        <div class="field">
                            <label for="input-stock-qte">Nouvelle quantité en stock</label>
                            <div class="qty-input">
                                <button on:click={() => nouvelleQte = Math.max(0, nouvelleQte-1)} aria-label="Diminuer">−</button>
                                <input type="number" min="0" id="input-stock-qte" bind:value={nouvelleQte} />
                                <button on:click={() => nouvelleQte = nouvelleQte+1}>+</button>
                            </div>
                            {#if nouvelleQte !== produitEdit.quantite_stock}
                                <span class="field-diff" class:pos={nouvelleQte > produitEdit.quantite_stock}
                                    class:neg={nouvelleQte < produitEdit.quantite_stock}>
                                    {nouvelleQte > produitEdit.quantite_stock ? "+" : ""}{nouvelleQte - produitEdit.quantite_stock} par rapport à maintenant
                                </span>
                            {/if}
                        </div>
                        <div class="field">
                            <label for="input-stock-seuil">Seuil d'alerte stock faible</label>
                            <div class="qty-input">
                                <button on:click={() => nouveauSeuil = Math.max(1, nouveauSeuil-1)} aria-label="Diminuer">−</button>
                                <input type="number" min="1" id="input-stock-seuil" bind:value={nouveauSeuil} />
                                <button on:click={() => nouveauSeuil = nouveauSeuil+1}>+</button>
                            </div>
                            <span class="field-hint">Alerte si stock &lt; ce seuil</span>
                        </div>
                    </div>

                    <!-- Aperçu nouveau statut -->
                    {#if nouvelleQte !== produitEdit.quantite_stock || nouveauSeuil !== produitEdit.seuil_alerte}
                        {@const preview = statut({ quantite_stock: nouvelleQte, seuil_alerte: nouveauSeuil })}
                        <div class="preview-statut">
                            <span>Nouveau statut :</span>
                            <span class="badge {preview.cls}">{preview.label}</span>
                        </div>
                    {/if}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" on:click={fermerModal}>Annuler</button>
                    <button class="btn-primary" on:click={sauvegarderStock} disabled={enregistrement}>
                        {#if enregistrement}
                            <span class="spinner"></span> Enregistrement…
                        {:else}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            Sauvegarder
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :global(body) { font-family: 'Sora', sans-serif; background: #f1f5f9; color: #1e293b; overflow: hidden; }

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

        .main-area { margin-left: 230px; flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

        /* NAVBAR */
        .navbar { height: 60px; background: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; flex-shrink: 0; gap: 1rem; }
        .navbar-left { display: flex; align-items: center; gap: 12px; }
        .burger { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 6px; border-radius: 6px; display: none; }
        .navbar-title { display: flex; flex-direction: column; }
        .page-title { font-size: .95rem; font-weight: 700; color: #f8fafc; line-height: 1.2; }
        .page-sub { font-size: .7rem; color: #64748b; }
        .navbar-right { display: flex; align-items: center; gap: 12px; }
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
        .content { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

        /* ALERTS */
        .alert { display: flex; align-items: center; gap: 8px; padding: .65rem 1rem; border-radius: 8px; font-size: .82rem; font-weight: 500; }
        .alert.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .alert.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .stat-card { background: #fff; border-radius: 12px; padding: 1rem 1.1rem; display: flex; align-items: center; gap: .85rem; box-shadow: 0 1px 4px rgba(0,0,0,.06); cursor: pointer; transition: all .18s; border: 2px solid transparent; }
        .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.1); transform: translateY(-1px); }
        .stat-card.active-filter { border-color: #3b82f6; }
        .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0; }
        .stat-icon.green  { background: #f0fdf4; color: #22c55e; }
        .stat-icon.orange { background: #fff7ed; color: #f97316; }
        .stat-icon.red    { background: #fef2f2; color: #ef4444; }
        .stat-icon.blue   { background: #eff6ff; color: #3b82f6; }
        .stat-info { display: flex; flex-direction: column; gap: 2px; }
        .stat-label { font-size: .7rem; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }
        .stat-val { font-size: 1.05rem; font-weight: 700; }
        .stat-val.green  { color: #22c55e; }
        .stat-val.orange { color: #f97316; }
        .stat-val.red    { color: #ef4444; }
        .stat-val.blue   { color: #3b82f6; }

        /* ALERTE BANNER */
        .alerte-banner { display: flex; align-items: center; gap: 10px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: .75rem 1rem; font-size: .82rem; color: #c2410c; }
        .alerte-banner svg { flex-shrink: 0; }
        .alerte-banner span { flex: 1; }
        .alerte-action { background: #f97316; color: #fff; border: none; border-radius: 6px; padding: .3rem .75rem; font-family: 'Sora', sans-serif; font-size: .75rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .alerte-action:hover { background: #ea580c; }

        /* MAIN LAYOUT */
        .main-layout { display: flex; flex-direction: column; gap: 1rem; }

        /* PANEL */
        .panel { background: #fff; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden; }
        .panel-header { display: flex; align-items: center; gap: 1rem; padding: .85rem 1rem; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; }
        .search-box { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: .45rem .75rem; flex: 1; min-width: 180px; }
        .search-box input { border: none; outline: none; background: none; font-family: 'Sora', sans-serif; font-size: .82rem; color: #1e293b; width: 100%; }
        .filtres { display: flex; gap: 5px; flex-wrap: wrap; }
        .filtre-btn { padding: .35rem .75rem; border: 1px solid #e2e8f0; border-radius: 20px; background: #f8fafc; color: #64748b; font-family: 'Sora', sans-serif; font-size: .75rem; font-weight: 500; cursor: pointer; transition: all .18s; }
        .filtre-btn:hover { background: #f1f5f9; }
        .filtre-btn.active { background: #1e40af; color: #fff; border-color: #1e40af; }

        /* TABLE */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #f8fafc; border-bottom: 2px solid #f1f5f9; }
        th { padding: .7rem 1rem; text-align: left; font-size: .7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
        td { padding: .8rem 1rem; font-size: .82rem; color: #334155; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover td { background: #f8fafc; }

        .produit-cell { display: flex; align-items: center; gap: 9px; }
        .produit-avatar { width: 30px; height: 30px; background: #dbeafe; color: #1e40af; border-radius: 8px; display: grid; place-items: center; font-size: .8rem; font-weight: 700; flex-shrink: 0; }
        .produit-nom { font-weight: 600; color: #1e293b; }
        .prix-cell { color: #3b82f6; font-weight: 600; }
        .qty { font-size: .9rem; font-weight: 700; color: #1e293b; }
        .qty.zero { color: #ef4444; }
        .seuil-cell { color: #94a3b8; font-size: .8rem; }

        /* BARRE STOCK */
        .barre-cell { display: flex; align-items: center; gap: 8px; }
        .barre-wrap { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; min-width: 60px; }
        .barre { height: 100%; border-radius: 3px; transition: width .3s ease; }
        .barre-pct { font-size: .7rem; color: #94a3b8; min-width: 28px; }

        /* BADGES */
        .badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: .72rem; font-weight: 600; }
        .badge.ok      { background: #f0fdf4; color: #16a34a; }
        .badge.faible  { background: #fff7ed; color: #f97316; }
        .badge.rupture { background: #fef2f2; color: #ef4444; }

        .btn-ajuster { display: flex; align-items: center; gap: 5px; padding: .35rem .75rem; background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; border-radius: 7px; font-family: 'Sora', sans-serif; font-size: .75rem; font-weight: 600; cursor: pointer; transition: all .18s; white-space: nowrap; }
        .btn-ajuster:hover { background: #dbeafe; }

        /* SKELETON */
        .skeleton-list { padding: 1rem; display: flex; flex-direction: column; gap: 10px; }
        .skeleton-row { height: 44px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; border-radius: 8px; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 3rem 1rem; color: #94a3b8; font-size: .85rem; }

        /* HISTORIQUE */
        .historique-panel { padding: 0; }
        .histo-title { display: flex; align-items: center; gap: 8px; padding: .75rem 1rem; font-size: .78rem; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9; }
        .histo-list { max-height: 220px; overflow-y: auto; }
        .histo-item { display: flex; align-items: center; gap: 10px; padding: .6rem 1rem; border-bottom: 1px solid #f8fafc; }
        .histo-item:last-child { border-bottom: none; }
        .histo-avatar { width: 26px; height: 26px; background: #f1f5f9; border-radius: 6px; display: grid; place-items: center; font-size: .72rem; font-weight: 700; color: #64748b; flex-shrink: 0; }
        .histo-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
        .histo-nom { font-size: .78rem; font-weight: 600; color: #1e293b; }
        .histo-detail { font-size: .68rem; color: #94a3b8; }
        .histo-diff { font-size: .82rem; font-weight: 700; min-width: 40px; text-align: right; }
        .histo-diff.pos { color: #22c55e; }
        .histo-diff.neg { color: #ef4444; }
        .histo-heure { font-size: .68rem; color: #94a3b8; white-space: nowrap; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.55); backdrop-filter: blur(3px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 500px; box-shadow: 0 24px 64px rgba(0,0,0,.2); display: flex; flex-direction: column; max-height: 90vh; animation: slideUp .22s ease; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        .modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.25rem 1.5rem 1rem; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
        .modal-header h2 { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .modal-sub { font-size: .75rem; color: #64748b; margin-top: 3px; }
        .modal-close { background: #f1f5f9; border: none; border-radius: 8px; width: 30px; height: 30px; display: grid; place-items: center; cursor: pointer; color: #64748b; }
        .modal-close:hover { background: #e2e8f0; }
        .modal-body { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1.1rem; }
        .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }

        /* STOCK ACTUEL */
        .stock-actuel { display: grid; grid-template-columns: repeat(3,1fr); gap: .75rem; background: #f8fafc; border-radius: 10px; padding: .85rem 1rem; }
        .sa-item { display: flex; flex-direction: column; gap: 3px; }
        .sa-label { font-size: .67rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; }
        .sa-val { font-size: .88rem; font-weight: 700; color: #1e293b; }

        /* RACCOURCIS */
        .raccourcis { display: flex; flex-direction: column; gap: .5rem; }
        .raccourcis-label { font-size: .72rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
        .raccourcis-btns { display: flex; flex-wrap: wrap; gap: 6px; }
        .raccourci { padding: .3rem .65rem; border-radius: 6px; border: 1px solid #e2e8f0; background: #f8fafc; font-family: 'Sora', sans-serif; font-size: .78rem; font-weight: 600; cursor: pointer; transition: all .15s; }
        .raccourci.pos { color: #16a34a; border-color: #bbf7d0; background: #f0fdf4; }
        .raccourci.pos:hover { background: #dcfce7; }
        .raccourci.neg { color: #ef4444; border-color: #fecaca; background: #fef2f2; }
        .raccourci.neg:hover { background: #fee2e2; }

        /* FORM */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: .78rem; font-weight: 600; color: #475569; }
        .qty-input { display: flex; align-items: center; gap: 6px; }
        .qty-input button { width: 32px; height: 36px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 7px; cursor: pointer; font-size: 1rem; font-weight: 700; color: #475569; display: grid; place-items: center; }
        .qty-input button:hover { background: #e2e8f0; }
        .qty-input input { flex: 1; height: 36px; text-align: center; border: 1px solid #e2e8f0; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .9rem; font-weight: 700; color: #1e293b; outline: none; background: #fff; }
        .qty-input input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .field-diff { font-size: .72rem; font-weight: 600; }
        .field-diff.pos { color: #16a34a; }
        .field-diff.neg { color: #ef4444; }
        .field-hint { font-size: .7rem; color: #94a3b8; }

        /* PREVIEW STATUT */
        .preview-statut { display: flex; align-items: center; gap: 8px; background: #f8fafc; border-radius: 8px; padding: .6rem .85rem; font-size: .78rem; color: #64748b; font-weight: 500; }

        /* BOUTONS */
        .btn-primary { display: flex; align-items: center; gap: 7px; padding: .5rem 1.1rem; background: #3b82f6; color: #fff; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; }
        .btn-primary:hover:not(:disabled) { background: #2563eb; }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .btn-secondary { padding: .5rem 1.1rem; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; }
        .btn-secondary:hover { background: #e2e8f0; }

        /* SPINNER */
        .spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

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
            .stats-row { grid-template-columns: 1fr 1fr; }
            .form-grid { grid-template-columns: 1fr; }
            .stock-actuel { grid-template-columns: 1fr 1fr; }
            .user-name { display: none; }
        }
        @media (max-width: 480px) {
            .content { padding: 1rem; }
            .stats-row { grid-template-columns: 1fr 1fr; gap: .6rem; }
        }
    </style>