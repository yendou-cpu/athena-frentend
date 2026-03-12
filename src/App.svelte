<script>
    import Accueil     from './components/accueil.svelte';
    import Inscription from './pages/inscription.svelte';
    import Connexion   from './pages/connexion.svelte';
    import Produits    from './components/produits.svelte';
    import Ventes      from './components/ventes.svelte';
    import Caissier    from './components/caissier.svelte';
    import Stock       from './components/stock.svelte';

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
    const pagesAdmin = ['#/acceuil', '#/produits', '#/ventes', '#/stock'];

    function getPage() {
        const hash = window.location.hash;

        if (hash === '#/inscription') return 'inscription';
        if (hash === '#/connexion')   return 'connexion';
        if (hash === '#/caissier')    return 'caissier';

        // Pages admin protégées
        if (pagesAdmin.includes(hash)) {
            if (!tokenValide()) return 'connexion';
            if (estCaissier())  return 'caissier'; //  caissier bloqué
            if (hash === '#/acceuil')  return 'accueil';
            if (hash === '#/produits') return 'produits';
            if (hash === '#/ventes')   return 'ventes';
            if (hash === '#/stock')    return 'stock';  //  ajouté
        }

        // Page par défaut
        if (!hash || hash === '#/' || hash === '#') {
            if (!tokenValide()) return 'inscription';
            return estCaissier() ? 'caissier' : 'ventes';
        }

        return 'inscription';
    }

    let page = getPage();

    window.addEventListener('hashchange', () => {
        page = getPage();
    });
</script>

{#if page === 'inscription'}
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

{/if}