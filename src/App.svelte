<script>
    import Accueil     from './components/accueil.svelte';
    import Inscription from './pages/inscription.svelte';
    import Connexion   from './pages/connexion.svelte';
    import Landing     from './pages/landing.svelte';
    import Produits    from './components/produits.svelte';
    import Ventes      from './components/ventes.svelte';
    import Caissier    from './components/caissier.svelte';
    import Stock       from './components/stock.svelte';
    import Rapports    from './components/rapports.svelte';
    import Logs        from './components/logs.svelte';

    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "{}");

    function tokenValide() {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    function estCaissier() {
        return user?.role === "caissier";
    }

    // Pages réservées aux admins
    const pagesAdmin = ['#/acceuil', '#/produits', '#/ventes', '#/stock', '#/rapports', '#/logs'];

    function getPage() {
        const hash = window.location.hash;

        if (hash === '#/inscription') return 'inscription';
        if (hash === '#/connexion')   return 'connexion';
        if (hash === '#/caissier')    return 'caissier';

        // Pages admin protégées
        if (pagesAdmin.includes(hash)) {
            if (!tokenValide()) return 'connexion';
            if (estCaissier())  return 'caissier'; // ✅ caissier bloqué
            if (hash === '#/acceuil')  return 'accueil';
            if (hash === '#/produits') return 'produits';
            if (hash === '#/ventes')   return 'ventes';
            if (hash === '#/stock')    return 'stock';
            if (hash === '#/rapports') return 'rapports';
            if (hash === '#/logs')     return 'logs';  // ✅ ajouté
        }

        // Page par défaut
        if (hash === '#/landing') return 'landing';
    if (!hash || hash === '#/' || hash === '#') {
            if (!tokenValide()) return 'landing'; // page d'accueil publique
            return estCaissier() ? 'caissier' : 'accueil';
        }

        return 'inscription';
    }

    let page = getPage();

    window.addEventListener('hashchange', () => {
        page = getPage();
    });
</script>

{#if page === 'landing'}
        <Landing />
    {:else if page === 'inscription'}
    <Inscription />

{:else if page === 'connexion'}
    <Connexion />

{:else if page === 'accueil'}
    <Accueil />

{:else if page === 'produits'}
    <Produits />

{:else if page === 'ventes'}
    <Ventes />

{:else if page === 'caissier'}
    <Caissier />

{:else if page === 'stock'}
    <Stock />
{:else if page === 'rapports'}
    <Rapports />
{:else if page === 'logs'}
    <Logs />

{/if}