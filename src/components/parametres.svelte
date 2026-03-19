<script>
    import { onMount } from "svelte";

    const BASE_URL  = "https://main-athena-api.onrender.com/api";
    const token     = localStorage.getItem("token");
    const user      = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin   = ["admin","proprietaire","administrateur"].includes((user.role || "").toLowerCase());
    const headers   = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

    // userid correct (pas user.id)
    const userid = user.userid ?? user.id;

    let activeTab  = "profil";
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

    function navigate(hash, id) { window.location.href = hash; sidebarOpen = false; }

    // ═══════════════════════════════════════════════════
    // TOAST
    // ═══════════════════════════════════════════════════
    let toast = { visible: false, type: "", texte: "" };
    let toastTimer;
    function showToast(type, texte) {
        clearTimeout(toastTimer);
        toast = { visible: true, type, texte };
        toastTimer = setTimeout(() => toast = { ...toast, visible: false }, 3500);
    }

    // ═══════════════════════════════════════════════════
    // PROFIL
    // ═══════════════════════════════════════════════════
    let profil = {
        nom:       user.nom       || "",
        prenoms:   user.prenoms   || "",
        email:     user.email     || "",
        numerotel: user.numerotel || "",
        role:      user.role      || "",
        nom_boutique: user.nom_boutique || "",
        boutique_id:  user.boutique_id  || "",
    };
    let profilEdit = { ...profil };
    let savingProfil = false;

    async function sauvegarderProfil() {
        savingProfil = true;
        try {
            // PUT /api/utilisateurs/:userid  (route existante dans utilisateur.router.js)
            const res = await fetch(`${BASE_URL}/utilisateurs/${userid}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    nom:       profilEdit.nom,
                    prenoms:   profilEdit.prenoms,
                    email:     profilEdit.email,
                    numerotel: profilEdit.numerotel,
                    nom_boutique: profilEdit.nom_boutique,
                    role:      profil.role, // non modifiable
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);

            profil    = { ...profilEdit };
            // Mettre à jour localStorage
            const updated = { ...user, nom: profil.nom, prenoms: profil.prenoms, email: profil.email, numerotel: profil.numerotel, nom_boutique: profil.nom_boutique };
            localStorage.setItem("user", JSON.stringify(updated));
            showToast("succes", "Profil mis à jour avec succès !");
        } catch(e) {
            showToast("erreur", e.message);
        } finally {
            savingProfil = false;
        }
    }

    // ═══════════════════════════════════════════════════
    // MOT DE PASSE
    // ═══════════════════════════════════════════════════
    let mdp = { actuel: "", nouveau: "", confirmer: "" };
    let savingMdp = false;
    let erreurMdp = "";

    async function changerMotDePasse() {
        erreurMdp = "";
        if (!mdp.actuel || !mdp.nouveau || !mdp.confirmer) { erreurMdp = "Tous les champs sont obligatoires."; return; }
        if (mdp.nouveau !== mdp.confirmer) { erreurMdp = "Les mots de passe ne correspondent pas."; return; }
        if (mdp.nouveau.length < 6) { erreurMdp = "Le mot de passe doit contenir au moins 6 caractères."; return; }

        savingMdp = true;
        try {
            // PUT /api/utilisateurs/:userid avec password
            // On réutilise la route updateUtilisateur existante
            const res = await fetch(`${BASE_URL}/utilisateurs/${userid}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    nom:       profil.nom,
                    prenoms:   profil.prenoms,
                    email:     profil.email,
                    numerotel: profil.numerotel,
                    nom_boutique: profil.nom_boutique,
                    role:      profil.role,
                    password:  mdp.nouveau,
                    motDePasseActuel: mdp.actuel,
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);
            mdp = { actuel: "", nouveau: "", confirmer: "" };
            showToast("succes", "Mot de passe modifié avec succès !");
        } catch(e) {
            erreurMdp = e.message;
        } finally {
            savingMdp = false;
        }
    }

    // ═══════════════════════════════════════════════════
    // BOUTIQUE (lecture seule depuis localStorage)
    // Les vraies infos boutique viennent du profil utilisateur
    // ═══════════════════════════════════════════════════
    let boutiqueInfo = {
        nom:        user.nom_boutique  || "—",
        boutique_id: user.boutique_id  || "—",
        role:       user.role          || "—",
        email:      user.email         || "—",
        numerotel:  user.numerotel     || "—",
    };

    // ═══════════════════════════════════════════════════
    // NOTIFICATIONS (localStorage uniquement — pas de backend)
    // ═══════════════════════════════════════════════════
    const NOTIF_KEY = "athena_notif_prefs";
    function loadNotifs() {
        try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "null") || defaultNotifs(); }
        catch { return defaultNotifs(); }
    }
    function defaultNotifs() {
        return { stock_faible: true, ventes: false, rapports: false };
    }
    let notifs = loadNotifs();
    let notifsSaved = true;
    $: notifsSaved = JSON.stringify(notifs) === JSON.stringify(loadNotifs());

    function sauvegarderNotifs() {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
        showToast("succes", "Préférences enregistrées !");
    }

    // ═══════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════
    onMount(() => {
        // Recharger les données du profil depuis l'API
        fetch(`${BASE_URL}/utilisateurs/profile`, { headers })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.user) {
                    const u = data.user;
                    profil = {
                        nom:         u.nom         || profil.nom,
                        prenoms:     u.prenoms      || profil.prenoms,
                        email:       u.email        || profil.email,
                        numerotel:   u.numerotel    || profil.numerotel,
                        role:        u.role         || profil.role,
                        nom_boutique: u.nom_boutique || profil.nom_boutique,
                        boutique_id:  u.boutique_id  || profil.boutique_id,
                    };
                    profilEdit = { ...profil };
                    boutiqueInfo = { ...boutiqueInfo, nom: profil.nom_boutique, boutique_id: profil.boutique_id };
                }
            }).catch(() => {});
    });

    function initiales(nom) {
        if (!nom) return "?";
        return nom.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    $: profilChange = JSON.stringify(profil) !== JSON.stringify(profilEdit);
</script>

<!-- Overlay sidebar -->
{#if sidebarOpen}
    <button class="sidebar-overlay" on:click={() => sidebarOpen = false} aria-label="Fermer le menu"></button>
{/if}

<div class="app-shell">
    <!-- SIDEBAR -->
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
                <button class="nav-item" class:active={item.id === "parametres"} on:click={() => navigate(item.hash, item.id)}>
                    <span class="nav-icon">{@html item.icon}</span>
                    <span class="nav-label">{item.label}</span>
                </button>
            {/each}
        </nav>
        <div class="sidebar-footer"><p>© 2026 – ATHENA Gestion</p></div>
    </aside>

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
            <div class="nav-brand"><span class="brand-text"><strong>Paramètres</strong></span></div>
            <div class="nav-actions">
                <div class="user-menu" on:click={toggleMenu} on:keypress={toggleMenu} role="button" tabindex="0">
                    <div class="avatar">{initiales(user.nom)}</div>
                    <span class="user-name">{user.nom || "Admin"}</span>
                    <svg class="chevron" class:rotated={menuVisible} width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            {#if menuVisible}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="dropdown" on:click|stopPropagation on:keypress|stopPropagation role="menu" tabindex="-1">
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item logout" on:click={logout}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Se déconnecter
                    </button>
                </div>
            {/if}
        </nav>

        <!-- CONTENU -->
        <main class="page-content">

            <!-- TOAST -->
            {#if toast.visible}
                <div class="toast toast-{toast.type}">
                    {#if toast.type === "succes"}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    {:else}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/></svg>
                    {/if}
                    {toast.texte}
                </div>
            {/if}

            <div class="settings-page">
                <div class="page-header">
                    <div class="page-header-info">
                        <div class="user-avatar-lg">{initiales(user.nom)}</div>
                        <div>
                            <h1>{profil.prenoms || ""} {profil.nom || "Mon compte"}</h1>
                            <p class="page-sub">{profil.role} · {profil.nom_boutique || "—"}</p>
                        </div>
                    </div>
                </div>

                <!-- TABS -->
                <div class="tabs">
                    <button class="tab" class:active={activeTab === "profil"}   on:click={() => activeTab = "profil"}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Profil
                    </button>
                    <button class="tab" class:active={activeTab === "securite"} on:click={() => activeTab = "securite"}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2"/></svg>
                        Sécurité
                    </button>
                    <button class="tab" class:active={activeTab === "boutique"} on:click={() => activeTab = "boutique"}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2"/></svg>
                        Boutique
                    </button>
                    <button class="tab" class:active={activeTab === "notifs"}   on:click={() => activeTab = "notifs"}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2"/></svg>
                        Notifications
                    </button>
                </div>

                <!-- ── TAB PROFIL ── -->
                {#if activeTab === "profil"}
                <div class="card">
                    <div class="card-header">
                        <h2>Informations personnelles</h2>
                        <p>Ces informations sont visibles par les membres de votre boutique.</p>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label for="p-prenoms">Prénoms <span class="req">*</span></label>
                            <input id="p-prenoms" type="text" bind:value={profilEdit.prenoms} placeholder="Jean" />
                        </div>
                        <div class="field">
                            <label for="p-nom">Nom <span class="req">*</span></label>
                            <input id="p-nom" type="text" bind:value={profilEdit.nom} placeholder="Dupont" />
                        </div>
                        <div class="field">
                            <label for="p-email">Email</label>
                            <input id="p-email" type="email" bind:value={profilEdit.email} placeholder="vous@exemple.com" />
                        </div>
                        <div class="field">
                            <label for="p-tel">Téléphone <span class="req">*</span></label>
                            <input id="p-tel" type="tel" bind:value={profilEdit.numerotel} placeholder="+228 00000000" />
                        </div>
                        <div class="field">
                            <label for="p-role">Rôle</label>
                            <input id="p-role" type="text" value={profil.role} disabled class="input-disabled" />
                        </div>
                        <div class="field">
                            <label for="p-boutique">Nom boutique</label>
                            <input id="p-boutique" type="text" bind:value={profilEdit.nom_boutique} placeholder="Ma boutique" />
                        </div>
                    </div>
                    <div class="form-actions">
                        <button class="btn-cancel" on:click={() => profilEdit = { ...profil }} disabled={!profilChange}>Annuler</button>
                        <button class="btn-save" on:click={sauvegarderProfil} disabled={savingProfil || !profilChange}>
                            {#if savingProfil}<span class="spinner"></span> Sauvegarde…{:else}
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                                Enregistrer
                            {/if}
                        </button>
                    </div>
                </div>
                {/if}

                <!-- ── TAB SÉCURITÉ ── -->
                {#if activeTab === "securite"}
                <div class="card">
                    <div class="card-header">
                        <h2>Changer le mot de passe</h2>
                        <p>Choisissez un mot de passe fort d'au moins 6 caractères.</p>
                    </div>
                    {#if erreurMdp}
                        <div class="alert-error">{erreurMdp}</div>
                    {/if}
                    <div class="form-grid">
                        <div class="field full">
                            <label for="mdp-actuel">Mot de passe actuel <span class="req">*</span></label>
                            <input id="mdp-actuel" type="password" bind:value={mdp.actuel} placeholder="••••••••" autocomplete="current-password" />
                        </div>
                        <div class="field">
                            <label for="mdp-nouveau">Nouveau mot de passe <span class="req">*</span></label>
                            <input id="mdp-nouveau" type="password" bind:value={mdp.nouveau} placeholder="Minimum 6 caractères" autocomplete="new-password" />
                        </div>
                        <div class="field">
                            <label for="mdp-confirmer">Confirmer <span class="req">*</span></label>
                            <input id="mdp-confirmer" type="password" bind:value={mdp.confirmer} placeholder="Répéter le nouveau mot de passe" autocomplete="new-password" />
                        </div>
                    </div>

                    <!-- Indicateur de force -->
                    {#if mdp.nouveau}
                        {@const force = mdp.nouveau.length >= 12 ? 3 : mdp.nouveau.length >= 8 ? 2 : 1}
                        <div class="mdp-force">
                            <div class="force-bars">
                                {#each [1,2,3] as f}
                                    <div class="force-bar" class:active={f <= force} class:fort={force === 3} class:moyen={force === 2} class:faible={force === 1}></div>
                                {/each}
                            </div>
                            <span class="force-label">{force === 3 ? 'Fort' : force === 2 ? 'Moyen' : 'Faible'}</span>
                        </div>
                    {/if}

                    <div class="form-actions">
                        <button class="btn-save" on:click={changerMotDePasse} disabled={savingMdp || !mdp.actuel || !mdp.nouveau || !mdp.confirmer}>
                            {#if savingMdp}<span class="spinner"></span> Modification…{:else}
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2"/></svg>
                                Changer le mot de passe
                            {/if}
                        </button>
                    </div>
                </div>
                {/if}

                <!-- ── TAB BOUTIQUE ── -->
                {#if activeTab === "boutique"}
                <div class="card">
                    <div class="card-header">
                        <h2>Informations de la boutique</h2>
                        <p>Données associées à votre compte propriétaire.</p>
                    </div>
                    <div class="boutique-grid">
                        <div class="boutique-item">
                            <span class="bi-label">Nom de la boutique</span>
                            <span class="bi-val">{boutiqueInfo.nom}</span>
                        </div>
                        <div class="boutique-item">
                            <span class="bi-label">ID Boutique</span>
                            <span class="bi-val mono">#{boutiqueInfo.boutique_id}</span>
                        </div>
                        <div class="boutique-item">
                            <span class="bi-label">Rôle</span>
                            <span class="bi-val"><span class="role-badge">{boutiqueInfo.role}</span></span>
                        </div>
                        <div class="boutique-item">
                            <span class="bi-label">Email de contact</span>
                            <span class="bi-val">{boutiqueInfo.email || "—"}</span>
                        </div>
                        <div class="boutique-item">
                            <span class="bi-label">Téléphone</span>
                            <span class="bi-val">{boutiqueInfo.numerotel || "—"}</span>
                        </div>
                        <div class="boutique-item">
                            <span class="bi-label">Devise</span>
                            <span class="bi-val">FCFA</span>
                        </div>
                    </div>
                    <div class="info-note">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/></svg>
                        Pour modifier le nom de la boutique, allez dans l'onglet <button class="link-btn" on:click={() => activeTab = "profil"}>Profil</button>.
                    </div>
                </div>
                {/if}

                <!-- ── TAB NOTIFICATIONS ── -->
                {#if activeTab === "notifs"}
                <div class="card">
                    <div class="card-header">
                        <h2>Préférences de notifications</h2>
                        <p>Ces préférences sont enregistrées localement sur votre appareil.</p>
                    </div>
                    <div class="notifs-list">
                        <div class="notif-item">
                            <div class="notif-info">
                                <span class="notif-title">Alerte stock faible</span>
                                <span class="notif-desc">Afficher un avertissement quand un produit est sous le seuil</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" bind:checked={notifs.stock_faible} />
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="notif-item">
                            <div class="notif-info">
                                <span class="notif-title">Résumé des ventes</span>
                                <span class="notif-desc">Afficher le total des ventes dans le tableau de bord</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" bind:checked={notifs.ventes} />
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="notif-item">
                            <div class="notif-info">
                                <span class="notif-title">Rapport hebdomadaire</span>
                                <span class="notif-desc">Afficher un rappel de rapport chaque lundi</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" bind:checked={notifs.rapports} />
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button class="btn-save" on:click={sauvegarderNotifs}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                            Enregistrer les préférences
                        </button>
                    </div>
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
:global(:root) { --sidebar-w:230px; --navbar-h:60px; --shadow-sm:0 1px 3px rgba(0,0,0,0.07); --shadow-md:0 4px 16px rgba(0,0,0,0.08); --shadow-lg:0 10px 40px rgba(0,0,0,0.14); --radius:14px; }
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
.avatar { width:28px; height:28px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:700; color:#fff; flex-shrink:0; }
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
.settings-page { max-width: 800px; margin:0 auto; display:flex; flex-direction:column; gap:1.25rem; }

/* HEADER */
.page-header { display:flex; align-items:center; }
.page-header-info { display:flex; align-items:center; gap:1rem; }
.user-avatar-lg { width:52px; height:52px; background:linear-gradient(135deg,#1d4ed8,#7c3aed); border-radius:14px; display:grid; place-items:center; font-size:1.1rem; font-weight:700; color:#fff; flex-shrink:0; }
.page-header h1 { font-size:1.25rem; font-weight:700; color:#0f172a; }
.page-sub { font-size:0.8rem; color:#64748b; margin-top:0.15rem; text-transform:capitalize; }

/* TOAST */
.toast { position:fixed; top:80px; right:1.5rem; z-index:300; display:flex; align-items:center; gap:0.6rem; padding:0.75rem 1.1rem; border-radius:12px; font-size:0.83rem; font-weight:600; box-shadow:var(--shadow-lg); animation:slideIn 0.25s ease; }
@keyframes slideIn { from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)} }
.toast-succes { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
.toast-erreur { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; }

/* TABS */
.tabs { display:flex; gap:0.35rem; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:0.35rem; box-shadow:var(--shadow-sm); }
.tab { display:flex; align-items:center; gap:0.45rem; padding:0.52rem 1rem; border-radius:8px; border:none; background:none; color:#64748b; font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:all 0.15s; flex:1; justify-content:center; }
.tab:hover { background:#f1f5f9; color:#334155; }
.tab.active { background:#0f172a; color:#fff; font-weight:600; }

/* CARD */
.card { background:#fff; border:1px solid #e2e8f0; border-radius:var(--radius); padding:1.5rem; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:1.25rem; }
.card-header h2 { font-size:1rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem; }
.card-header p { font-size:0.8rem; color:#64748b; }

/* FORM */
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; }
.field { display:flex; flex-direction:column; gap:0.3rem; }
.field.full { grid-column:span 2; }
.field label { font-size:0.76rem; font-weight:600; color:#475569; }
.req { color:#ef4444; }
.field input { padding:0.6rem 0.85rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; font-family:'Sora',sans-serif; font-size:0.85rem; color:#0f172a; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
.field input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); background:#fff; }
.input-disabled { background:#f1f5f9 !important; color:#94a3b8 !important; cursor:not-allowed; }
.form-actions { display:flex; justify-content:flex-end; gap:0.65rem; padding-top:0.75rem; border-top:1px solid #f1f5f9; }
.btn-cancel { padding:0.52rem 1rem; background:#f1f5f9; border:none; border-radius:8px; color:#475569; font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; transition:background 0.15s; }
.btn-cancel:hover:not(:disabled) { background:#e2e8f0; }
.btn-cancel:disabled { opacity:0.4; cursor:not-allowed; }
.btn-save { display:flex; align-items:center; gap:0.45rem; padding:0.55rem 1.1rem; background:#1d4ed8; color:#fff; border:none; border-radius:8px; font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
.btn-save:hover:not(:disabled) { background:#1e40af; transform:translateY(-1px); box-shadow:0 4px 12px rgba(29,78,216,0.3); }
.btn-save:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
.spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
.alert-error { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; padding:0.65rem 0.9rem; border-radius:9px; font-size:0.82rem; }

/* FORCE MDP */
.mdp-force { display:flex; align-items:center; gap:0.75rem; }
.force-bars { display:flex; gap:4px; }
.force-bar { width:50px; height:5px; background:#e2e8f0; border-radius:3px; transition:background 0.3s; }
.force-bar.active.faible { background:#ef4444; }
.force-bar.active.moyen  { background:#f59e0b; }
.force-bar.active.fort   { background:#22c55e; }
.force-label { font-size:0.75rem; font-weight:600; color:#64748b; }

/* BOUTIQUE */
.boutique-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; }
.boutique-item { background:#f8fafc; border:1px solid #f1f5f9; border-radius:10px; padding:0.85rem 1rem; display:flex; flex-direction:column; gap:0.3rem; }
.bi-label { font-size:0.72rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.04em; }
.bi-val { font-size:0.9rem; font-weight:600; color:#0f172a; }
.mono { font-family:monospace; color:#2563eb; }
.role-badge { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; padding:0.18rem 0.6rem; border-radius:20px; font-size:0.72rem; font-weight:700; text-transform:capitalize; }
.info-note { display:flex; align-items:center; gap:0.5rem; background:#f0f9ff; border:1px solid #bae6fd; border-radius:9px; padding:0.65rem 0.9rem; font-size:0.78rem; color:#0369a1; }
.link-btn { background:none; border:none; color:#2563eb; font-family:'Sora',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; padding:0; text-decoration:underline; }

/* NOTIFICATIONS */
.notifs-list { display:flex; flex-direction:column; gap:0.75rem; }
.notif-item { display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; background:#f8fafc; border:1px solid #f1f5f9; border-radius:10px; }
.notif-info { flex:1; }
.notif-title { display:block; font-size:0.87rem; font-weight:600; color:#0f172a; margin-bottom:0.2rem; }
.notif-desc { display:block; font-size:0.75rem; color:#64748b; }
.switch { position:relative; display:inline-block; width:44px; height:24px; flex-shrink:0; }
.switch input { opacity:0; width:0; height:0; }
.slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:#cbd5e1; transition:.3s; border-radius:24px; }
.slider:before { position:absolute; content:""; height:18px; width:18px; left:3px; bottom:3px; background:#fff; transition:.3s; border-radius:50%; }
input:checked + .slider { background:#1d4ed8; }
input:checked + .slider:before { transform:translateX(20px); }

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
    .form-grid,.boutique-grid { grid-template-columns:1fr; }
    .field.full { grid-column:auto; }
    .tabs { gap:0.2rem; }
    .tab { font-size:0.72rem; padding:0.45rem 0.5rem; }
    .page-content { padding:1rem; }
    .toast { right:1rem; left:1rem; }
}
</style>