    <script>
        // ══════════════════════════════════
        // CONFIG
        // ══════════════════════════════════
        const BASE_URL     = "https://main-athena-api.onrender.com/api";
        // URLs réelles du backend produits
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
        let pageActive       = "produits";
        let rechercheVisible = false;
        let recherche        = "";
        let menuVisible      = false;
        let sidebarOpen      = false;

        function toggleMenu()    { menuVisible  = !menuVisible; }
        function toggleSidebar() { sidebarOpen  = !sidebarOpen; }

        function logout() {
            menuVisible = false;               // ✅ ferme le dropdown d'abord
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "#/connexion"; // ✅ hash routing
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
        // PRODUITS — état
        // ══════════════════════════════════
        let produits       = [];
        let chargement     = true;
        let erreur         = "";
        let successMsg     = "";

        let rechercheTexte = "";
        let filtreStock    = "tous";

        let modalOuverte   = false;
        let modeEdition    = false;
        // ✅ Champs corrects selon la table : nom, prix, quantite_stock, seuil_alerte
        // La table n'a pas de colonne "description" ni "categorie" — on les retire
        let produitEnCours = { nom: "", prix: "", quantite_stock: "", seuil_alerte: 5 };
        let idEdition      = null;
        let enregistrement = false;

        let confirmSuppr   = false;
        let idSupprimer    = null;
        let nomSupprimer   = "";

        // ── Chargement ──
        async function chargerProduits() {
            chargement = true;
            erreur     = "";
            try {
                const res = await fetch(`${PRODUITS_URL}`, { headers });
                if (!res.ok) throw new Error("Erreur " + res.status);
                produits = await res.json();
            } catch (e) {
                erreur = "Impossible de charger les produits.";
                console.error(e);
            } finally {
                chargement = false;
            }
        }

        chargerProduits();

        // ── Filtre réactif ──
        // ✅ Colonne réelle : "quantite_stock" dans la table produits
        $: produitsFiltres = produits
            .filter(p => {
                const texte = rechercheTexte.toLowerCase();
                return (p.nom || "").toLowerCase().includes(texte);
            })
            .filter(p => {
                const qty = Number(p.quantite_stock ?? 0);
                const seuil = Number(p.seuil_alerte ?? 5);
                if (filtreStock === "faible") return qty < seuil;
                if (filtreStock === "ok")     return qty >= seuil;
                return true;
            });

        // ── Modal Ajout ──
        function ouvrirAjout() {
            modeEdition    = false;
            idEdition      = null;
            produitEnCours = { nom: "", prix: "", quantite_stock: "", seuil_alerte: 5 };
            modalOuverte   = true;
        }

        // ── Modal Édition ──
        function ouvrirEdition(p) {
            modeEdition    = true;
            // ✅ Clé primaire réelle : "id" dans la table produits (pas "produitid")
            idEdition      = p.id;
            produitEnCours = {
                nom:            p.nom            || "",
                prix:           p.prix           || "",
                // ✅ Colonne réelle : "quantite_stock"
                quantite_stock: p.quantite_stock ?? "",
                seuil_alerte:   p.seuil_alerte   ?? 5,
            };
            modalOuverte   = true;
        }

        function fermerModal() { modalOuverte = false; }

        // ✅ Fonctions manquantes pour la modal de suppression
        function fermer() { confirmSuppr = false; }
        function handleKey(e) { if (e.key === "Escape" || e.key === "Enter") fermer(); }

        // ── Sauvegarder (ajout ou modification) ──
        async function sauvegarder() {
            if (!produitEnCours.nom || !produitEnCours.prix) return;
            enregistrement = true;
            erreur         = "";

            const payload = {
                nom:            String(produitEnCours.nom).trim(),
                prix:           parseFloat(produitEnCours.prix),
                quantite_stock: parseInt(produitEnCours.quantite_stock) || 0,
                seuil_alerte:   parseInt(produitEnCours.seuil_alerte)   || 5,
            };

            if (isNaN(payload.prix) || payload.prix < 0) {
                erreur = "Le prix doit être un nombre positif.";
                enregistrement = false;
                return;
            }

            console.log("Payload envoyé :", payload);

            try {
                const url    = modeEdition ? `${PRODUITS_URL}/${idEdition}` : `${PRODUITS_URL}/EnregistreProduit`;
                const method = modeEdition ? "PUT" : "POST";

                const res = await fetch(url, {
                    method,
                    headers,
                    body: JSON.stringify(payload)
                });

                // Lit la réponse même en cas d'erreur pour voir le message serveur réel
                const data = await res.json().catch(() => null);
                console.log("Réponse serveur :", res.status, data);

                if (!res.ok) {
                    const msgServeur = data?.error || data?.message || `Erreur serveur ${res.status}`;
                    throw new Error(msgServeur);
                }

                successMsg = modeEdition ? "Produit modifié avec succès !" : "Produit ajouté avec succès !";
                setTimeout(() => successMsg = "", 3500);
                fermerModal();
                await chargerProduits();

            } catch (e) {
                console.error("Erreur sauvegarder :", e.message);
                erreur = e.message || "Une erreur est survenue. Réessayez.";
            } finally {
                enregistrement = false;
            }
        }

        // ── Supprimer ──
        function demanderSuppr(p) {
            // ✅ Clé primaire réelle : "id"
            idSupprimer  = p.id;
            nomSupprimer = p.nom;
            confirmSuppr = true;
        }

        async function confirmerSuppr() {
            try {
                const res = await fetch(`${PRODUITS_URL}/${idSupprimer}`, { method: "DELETE", headers });
                if (!res.ok) throw new Error("Erreur " + res.status);
                successMsg = `"${nomSupprimer}" supprimé avec succès.`;
                setTimeout(() => successMsg = "", 3500);
                await chargerProduits();
            } catch (e) {
                erreur = "Suppression impossible. Ce produit est peut-être lié à des ventes.";
                console.error(e);
            } finally {
                confirmSuppr = false;
            }
        }

        // ── Helpers ──
        function formatPrix(n) {
            return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
        }

        // ✅ Utilise quantite_stock et seuil_alerte (colonnes réelles)
        function statutStock(p) {
            const qty    = Number(p.quantite_stock ?? 0);
            const seuil  = Number(p.seuil_alerte   ?? 5);
            if (qty === 0)       return { label: "Rupture",      cls: "red"    };
            if (qty < seuil)     return { label: "Stock faible", cls: "orange" };
            return                      { label: "En stock",     cls: "green"  };
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
                    <button class="nav-item" class:active={pageActive === item.id}
                            on:click={() => navigate(item.hash, item.id)}>
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
                    <span class="brand-text"><strong>Gestion des Ventes</strong></span>
                </div>

                <div class="nav-search" class:active={rechercheVisible}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="#9ca3af" stroke-width="2"/>
                        <path d="m21 21-4.35-4.35" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <input type="text" bind:value={recherche} placeholder="Rechercher..."
                        on:focus={() => rechercheVisible = true}
                        on:blur={() => rechercheVisible = false} />
                </div>

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
                            <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.6)" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>

                {#if menuVisible}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
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
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>Paramètres
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item logout" on:click={logout}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>Se déconnecter
                        </button>
                    </div>
                {/if}
            </nav>

            <!-- ── PAGE PRODUITS ── -->
            <main class="page-content">
                <div class="produits-page">

                    <div class="page-header">
                        <div>
                            <h1>Produits</h1>
                            <p class="page-subtitle">
                                {produits.length} produit{produits.length > 1 ? 's' : ''} enregistré{produits.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <button class="btn-primary" on:click={ouvrirAjout}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Nouveau produit
                        </button>
                    </div>

                    {#if successMsg}
                        <div class="alert-success">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {successMsg}
                        </div>
                    {/if}
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

                    <!-- Barre de recherche + filtres -->
                    <div class="toolbar">
                        <div class="search-bar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="#64748b" stroke-width="2"/>
                                <path d="m21 21-4.35-4.35" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <input type="text" bind:value={rechercheTexte} placeholder="Rechercher un produit..." />
                        </div>
                        <div class="filtres">
                            <button class="filtre-btn" class:actif={filtreStock === 'tous'}   on:click={() => filtreStock = 'tous'}>Tous</button>
                            <button class="filtre-btn" class:actif={filtreStock === 'ok'}     on:click={() => filtreStock = 'ok'}>En stock</button>
                            <button class="filtre-btn orange" class:actif={filtreStock === 'faible'} on:click={() => filtreStock = 'faible'}>Stock faible</button>
                        </div>
                    </div>

                    <!-- Tableau -->
                    <div class="table-panel">
                        {#if chargement}
                            <div class="table-skeleton">
                                {#each [1,2,3,4,5] as _}
                                    <div class="row-skeleton"></div>
                                {/each}
                            </div>
                        {:else if produitsFiltres.length === 0}
                            <div class="empty-state">
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#94a3b8" stroke-width="1.5" stroke-linejoin="round"/>
                                </svg>
                                <p>Aucun produit trouvé</p>
                                <span>Ajoutez votre premier produit ou modifiez vos filtres</span>
                            </div>
                        {:else}
                            <div class="table-wrap">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Prix</th>
                                            <th>Stock</th>
                                            <th>Seuil alerte</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each produitsFiltres as p}
                                            <!-- ✅ Pass produit entier à statutStock -->
                                            {@const statut = statutStock(p)}
                                            <tr>
                                                <td>
                                                    <div class="produit-cell">
                                                        <div class="produit-avatar">
                                                            {(p.nom || "?")[0].toUpperCase()}
                                                        </div>
                                                        <span class="produit-nom">{p.nom || "—"}</span>
                                                    </div>
                                                </td>
                                                <td class="td-prix">{formatPrix(p.prix || 0)}</td>
                                                <!-- ✅ Colonne réelle : quantite_stock -->
                                                <td class="td-qty">{p.quantite_stock ?? 0}</td>
                                                <!-- ✅ Colonne réelle : seuil_alerte -->
                                                <td class="td-seuil">{p.seuil_alerte ?? 5}</td>
                                                <td>
                                                    <span class="badge-stock {statut.cls}">{statut.label}</span>
                                                </td>
                                                <td>
                                                    <div class="actions">
                                                        <button class="btn-icon edit" on:click={() => ouvrirEdition(p)} title="Modifier">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                        </button>
                                                        <button class="btn-icon delete" on:click={() => demanderSuppr(p)} title="Supprimer">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
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

                </div>
            </main>
        </div>
    </div>

    <!-- ══ MODAL AJOUT / ÉDITION ══ -->
    {#if modalOuverte}
        <div class="modal-overlay" on:click={fermerModal} role="button" tabindex="-1"
            on:keydown={(e) => e.key === 'Escape' && fermerModal()}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="modal" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">

                <div class="modal-header">
                    <h2>{modeEdition ? 'Modifier le produit' : 'Nouveau produit'}</h2>
                    <button class="modal-close" on:click={fermerModal} aria-label="Fermer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-grid">
                        <div class="field full">
                            <label for="prod-nom">Nom du produit *</label>
                            <input id="prod-nom" type="text" bind:value={produitEnCours.nom}
                                placeholder="Ex: Huile moteur 5W30" />
                        </div>
                        <div class="field">
                            <label for="prod-prix">Prix (FCFA) *</label>
                            <input id="prod-prix" type="number" bind:value={produitEnCours.prix}
                                placeholder="0" min="0" step="0.01" />
                        </div>
                        <div class="field">
                            <!-- ✅ Champ "quantite_stock" — nom correct -->
                            <label for="prod-qty">Quantité en stock</label>
                            <input id="prod-qty" type="number" bind:value={produitEnCours.quantite_stock}
                                placeholder="0" min="0" />
                        </div>
                        <div class="field full">
                            <!-- ✅ Champ "seuil_alerte" — colonne réelle -->
                            <label for="prod-seuil">Seuil d'alerte stock</label>
                            <input id="prod-seuil" type="number" bind:value={produitEnCours.seuil_alerte}
                                placeholder="5" min="0" />
                            <span class="field-hint">Alerte si le stock passe en dessous de cette valeur</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-secondary" on:click={fermerModal}>Annuler</button>
                    <button class="btn-primary"
                            on:click={sauvegarder}
                            disabled={enregistrement || !produitEnCours.nom || !produitEnCours.prix}>
                        {#if enregistrement}
                            <span class="spinner"></span> Enregistrement...
                        {:else}
                            {modeEdition ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                        {/if}
                    </button>
                </div>

            </div>
        </div>
    {/if}

    <!-- ══ MODAL CONFIRMATION SUPPRESSION ══ -->
    {#if confirmSuppr}
        <div class="modal-overlay"
            on:click={fermer}
            on:keydown={handleKey}
            role="button"
            tabindex="0">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="modal modal-sm" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
                <div class="modal-header">
                    <h2>Confirmer la suppression</h2>
                </div>
                <div class="modal-body">
                    <p class="confirm-text">
                        Êtes-vous sûr de vouloir supprimer <strong>"{nomSupprimer}"</strong> ?
                        Cette action est irréversible et impossible si le produit est lié à des ventes.
                    </p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" on:click={() => confirmSuppr = false}>Annuler</button>
                    <button class="btn-danger" on:click={confirmerSuppr}>Supprimer</button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Overlay fermeture dropdown navbar -->
    {#if menuVisible}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <button class="overlay" on:click={() => menuVisible = false} aria-label="Fermer"></button>
    {/if}

    <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

    :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
    :global(body) { font-family: 'Sora', sans-serif; background: #f1f5f9; overflow: hidden; }

    :global(:root) {
        --sidebar-w: 230px;
        --navbar-h:  60px;
        --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
        --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
        --shadow-lg: 0 10px 40px rgba(0,0,0,0.14);
        --radius: 14px;
    }

    /* ══ SHELL ══ */
    .app-shell { display: flex; height: 100vh; width: 100vw; overflow: hidden; background: #f1f5f9; }

    /* ══ SIDEBAR ══ */
    .sidebar {
        width: var(--sidebar-w); min-height: 100vh; background: #0f172a;
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
        background: linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius: 8px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        box-shadow: 0 2px 10px rgba(59,130,246,0.4);
    }
    .brand-label { color: #fff; font-size: 0.92rem; font-weight: 700; letter-spacing: 0.04em; white-space: nowrap; flex: 1; }
    .sidebar-close { display: none; background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; border-radius: 6px; margin-left: auto; }
    .sidebar-nav { flex: 1; padding: 0.8rem 0.55rem; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
    .nav-item {
        display: flex; align-items: center; gap: 0.7rem;
        padding: 0.6rem 0.8rem; border-radius: 10px;
        border: none; background: none; cursor: pointer; width: 100%;
        text-align: left; color: #64748b;
        font-family: 'Sora', sans-serif; font-size: 0.83rem; font-weight: 400;
        transition: background 0.15s, color 0.15s;
    }
    .nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
    .nav-item.active { background: #1d4ed8; color: #fff; font-weight: 600; box-shadow: 0 2px 12px rgba(29,78,216,0.4); }
    .nav-icon { display: flex; align-items: center; flex-shrink: 0; width: 18px; height: 18px; }
    .nav-label { white-space: nowrap; }
    .sidebar-footer { padding: 0.85rem 1.2rem; border-top: 1px solid rgba(255,255,255,0.06); color: #334155; font-size: 0.68rem; text-align: center; }

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
    .burger { display: none; background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; flex-shrink: 0; transition: background 0.15s; }
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
    .nav-search input { background: none; border: none; outline: none; color: #e2e8f0; font-family: 'Sora', sans-serif; font-size: 0.83rem; width: 100%; }
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
    .avatar { width: 24px; height: 24px; background: linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .user-name { color: rgba(255,255,255,0.82); font-size: 0.81rem; font-weight: 500; }
    .chevron { transition: transform 0.2s; flex-shrink: 0; }
    .chevron.rotated { transform: rotate(180deg); }

    /* ══ DROPDOWN ══ */
    .dropdown {
        position: absolute; top: calc(var(--navbar-h) + 8px); right: 1.25rem;
        background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
        padding: 0.35rem; min-width: 180px; box-shadow: var(--shadow-lg); z-index: 200;
        animation: fadeDown 0.15s ease;
    }
    @keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
    .dropdown-item {
        display: flex; align-items: center; gap: 0.6rem;
        padding: 0.58rem 0.75rem; border-radius: 8px;
        color: #334155; font-size: 0.83rem; font-family: 'Sora', sans-serif;
        text-decoration: none; cursor: pointer;
        transition: background 0.15s; border: none; background: none; width: 100%; text-align: left;
    }
    .dropdown-item:hover { background: #f1f5f9; color: #0f172a; }
    .dropdown-item.logout { color: #dc2626; }
    .dropdown-item.logout:hover { background: #fef2f2; }
    .dropdown-divider { height: 1px; background: #e2e8f0; margin: 0.3rem 0; }

    /* ══ PAGE CONTENT ══ */
    .page-content { flex: 1; overflow-y: auto; padding: 1.5rem; background: #f1f5f9; }

    /* ══ OVERLAY ══ */
    .overlay { position: fixed; inset: 0; z-index: 150; }
    .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 90; backdrop-filter: blur(2px); }

    /* ══ PAGE PRODUITS ══ */
    .produits-page { display: flex; flex-direction: column; gap: 1.25rem; }

    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .page-header h1 { font-size: 1.3rem; font-weight: 700; color: #0f172a; }
    .page-subtitle { color: #64748b; font-size: 0.81rem; margin-top: 0.2rem; }

    .btn-primary {
        display: flex; align-items: center; gap: 0.45rem;
        padding: 0.55rem 1.1rem; background: #2563eb;
        border: none; border-radius: 10px; color: #fff;
        font-size: 0.83rem; font-weight: 600; cursor: pointer;
        font-family: 'Sora', sans-serif; white-space: nowrap;
        transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(37,99,235,0.35);
    }
    .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.45); }
    .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .btn-secondary {
        display: flex; align-items: center; gap: 0.4rem;
        padding: 0.55rem 1.1rem; background: #fff;
        border: 1px solid #e2e8f0; border-radius: 10px;
        color: #334155; font-size: 0.83rem; font-weight: 500; cursor: pointer;
        font-family: 'Sora', sans-serif; transition: background 0.15s;
    }
    .btn-secondary:hover { background: #f1f5f9; }

    .btn-danger {
        display: flex; align-items: center; gap: 0.4rem;
        padding: 0.55rem 1.1rem; background: #dc2626;
        border: none; border-radius: 10px; color: #fff;
        font-size: 0.83rem; font-weight: 600; cursor: pointer;
        font-family: 'Sora', sans-serif; transition: background 0.2s;
    }
    .btn-danger:hover { background: #b91c1c; }

    /* Alertes */
    .alert-success {
        display: flex; align-items: center; gap: 0.6rem;
        background: #f0fdf4; color: #16a34a;
        border: 1px solid #bbf7d0; padding: 0.75rem 1rem;
        border-radius: 10px; font-size: 0.83rem; font-weight: 500;
    }
    .alert-error-box {
        display: flex; align-items: center; gap: 0.6rem;
        background: #fef2f2; color: #dc2626;
        border: 1px solid #fecaca; padding: 0.75rem 1rem;
        border-radius: 10px; font-size: 0.83rem; font-weight: 500;
    }

    /* ══ TOOLBAR ══ */
    .toolbar { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

    .search-bar {
        flex: 1; min-width: 200px; max-width: 360px;
        display: flex; align-items: center; gap: 0.5rem;
        background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
        padding: 0 0.85rem; height: 38px; box-shadow: var(--shadow-sm);
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-bar:focus-within { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
    .search-bar input { background: none; border: none; outline: none; color: #334155; font-family: 'Sora', sans-serif; font-size: 0.83rem; width: 100%; }
    .search-bar input::placeholder { color: #94a3b8; }

    .filtres { display: flex; gap: 0.4rem; flex-wrap: wrap; }

    .filtre-btn {
        padding: 0.38rem 0.85rem; border-radius: 8px;
        border: 1px solid #e2e8f0; background: #fff;
        color: #64748b; font-size: 0.78rem; font-weight: 500; cursor: pointer;
        font-family: 'Sora', sans-serif; transition: all 0.15s;
    }
    .filtre-btn:hover { border-color: #93c5fd; color: #2563eb; }
    .filtre-btn.actif { background: #2563eb; border-color: #2563eb; color: #fff; }
    .filtre-btn.orange.actif { background: #ea580c; border-color: #ea580c; color: #fff; }

    /* ══ TABLE PANEL ══ */
    .table-panel {
        background: #fff; border: 1px solid #e2e8f0;
        border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;
    }

    .table-skeleton { padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .row-skeleton {
        height: 52px; border-radius: 8px;
        background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
        background-size: 200% 100%; animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    .empty-state {
        display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
        padding: 3rem 1rem; color: #94a3b8;
    }
    .empty-state p { font-size: 0.95rem; font-weight: 600; color: #64748b; }
    .empty-state span { font-size: 0.8rem; }

    .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

    .table { width: 100%; border-collapse: collapse; min-width: 480px; }
    .table th {
        text-align: left; font-size: 0.68rem; font-weight: 700;
        color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em;
        padding: 0.85rem 1rem; border-bottom: 1px solid #e2e8f0; white-space: nowrap;
        background: #f8fafc;
    }
    .table td {
        padding: 0.85rem 1rem; font-size: 0.83rem; color: #475569;
        border-bottom: 1px solid #f1f5f9; vertical-align: middle;
    }
    .table tr:last-child td { border-bottom: none; }
    .table tbody tr:hover td { background: #f8fafc; }

    .produit-cell { display: flex; align-items: center; gap: 0.7rem; }
    .produit-avatar {
        width: 34px; height: 34px; border-radius: 10px;
        background: linear-gradient(135deg,#dbeafe,#bfdbfe);
        color: #1d4ed8; font-weight: 700; font-size: 0.85rem;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .produit-nom { font-weight: 600; color: #1e293b; font-size: 0.85rem; }

    .td-prix    { font-weight: 700; color: #0f172a; white-space: nowrap; }
    .td-qty     { font-weight: 600; color: #334155; }
    .td-seuil   { color: #64748b; font-size: 0.8rem; }
    .td-empty   { color: #cbd5e1; font-size: 0.8rem; }

    .badge-stock {
        font-size: 0.7rem; font-weight: 700;
        padding: 0.22rem 0.6rem; border-radius: 20px; white-space: nowrap;
    }
    .badge-stock.green  { background: #f0fdf4; color: #16a34a; }
    .badge-stock.orange { background: #fff7ed; color: #ea580c; }
    .badge-stock.red    { background: #fef2f2; color: #dc2626; }

    .actions { display: flex; gap: 0.4rem; }
    .btn-icon {
        width: 32px; height: 32px; border-radius: 8px;
        border: 1px solid #e2e8f0; background: #fff;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.15s;
    }
    .btn-icon.edit:hover  { background: #eff6ff; border-color: #93c5fd; color: #2563eb; }
    .btn-icon.delete:hover { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }

    /* ══ MODAL ══ */
    .modal-overlay {
        position: fixed; inset: 0; background: rgba(15,23,42,0.6);
        z-index: 300; display: flex; align-items: center; justify-content: center;
        padding: 1rem; backdrop-filter: blur(4px);
        animation: fadeBg 0.2s ease;
    }
    @keyframes fadeBg { from { opacity:0; } to { opacity:1; } }

    .modal {
        background: #fff; border-radius: 16px;
        width: 100%; max-width: 480px; max-height: 90vh;
        overflow-y: auto; box-shadow: var(--shadow-lg);
        animation: slideUp 0.2s cubic-bezier(.4,0,.2,1);
    }
    .modal.modal-sm { max-width: 380px; }

    @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

    .modal-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9;
    }
    .modal-header h2 { font-size: 1rem; font-weight: 700; color: #0f172a; }

    .modal-close {
        width: 30px; height: 30px; border-radius: 8px;
        border: 1px solid #e2e8f0; background: #fff;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: #64748b; transition: all 0.15s;
    }
    .modal-close:hover { background: #f1f5f9; color: #0f172a; }

    .modal-body { padding: 1.25rem 1.5rem; }
    .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 0.6rem; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field.full { grid-column: 1 / -1; }

    .field label { font-size: 0.78rem; font-weight: 600; color: #475569; }

    .field input, .field textarea {
        padding: 0.6rem 0.85rem; border: 1px solid #e2e8f0; border-radius: 8px;
        font-family: 'Sora', sans-serif; font-size: 0.83rem; color: #1e293b;
        background: #f8fafc;
        /* ✅ Supprime le outline jaune/orange du navigateur */
        outline: none;
        /* ✅ Supprime le contour jaune sur focus (Firefox, Safari) */
        -webkit-appearance: none;
        appearance: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        width: 100%;
    }
    .field input:focus, .field textarea:focus {
        border-color: #93c5fd; background: #fff;
        box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        outline: none;
    }
    /* ✅ Supprime le fond jaune de l'autofill Chrome/Edge */
    .field input:-webkit-autofill,
    .field input:-webkit-autofill:hover,
    .field input:-webkit-autofill:focus,
    .field input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 40px #f8fafc inset !important;
        -webkit-text-fill-color: #1e293b !important;
        caret-color: #1e293b;
        transition: background-color 9999s ease-in-out 0s;
    }
    .field input:focus:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 40px #fff inset, 0 0 0 3px rgba(59,130,246,0.12) !important;
    }
    .field-hint { font-size: 0.72rem; color: #94a3b8; }

    .confirm-text { font-size: 0.88rem; color: #334155; line-height: 1.6; }
    .confirm-text strong { color: #0f172a; }

    /* Spinner */
    .spinner {
        width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
        display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ══ RESPONSIVE ══ */
    @media (max-width: 860px) {
        .sidebar { position: fixed; top: 0; left: 0; bottom: 0; transform: translateX(-100%); box-shadow: var(--shadow-lg); }
        .sidebar.open { transform: translateX(0); }
        .sidebar-close { display: flex; align-items: center; justify-content: center; }
        .sidebar-overlay { display: block; }
        .burger { display: flex; }
        .nav-brand { display: none; }
        .nav-search { max-width: 200px; }
        :global(body) { overflow: auto; }
        .app-shell { overflow: auto; }
        .main-area { overflow: auto; }
        .page-content { overflow: visible; }
    }

    @media (max-width: 640px) {
        .page-content { padding: 1rem; }
        .toolbar { flex-direction: column; align-items: stretch; }
        .search-bar { max-width: 100%; }
        .form-grid { grid-template-columns: 1fr; }
        .field.full { grid-column: 1; }
        .user-name { display: none; }
        .nav-search { max-width: 150px; }
    }

    @media (max-width: 400px) {
        .page-content { padding: 0.75rem; }
        .nav-search { display: none; }
    }
    </style>