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
    import Parametres  from './components/parametres.svelte';

    let page = 'landing';

    function checkAuth() {
        // Relire localStorage à chaque appel (sinon token null après login)
        const token = localStorage.getItem("token");
        const user  = JSON.parse(localStorage.getItem("user") || "{}");

        const isTokenValide = () => {
            if (!token) return false;
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.exp * 1000 > Date.now();
            } catch { return false; }
        };

        const estCaissier = (user?.role || "").toLowerCase() === "caissier";

        // Normaliser le hash : "" et "#" → "#/"
        const hash = window.location.hash || '#/';

        // 1. Pages publiques (pas besoin de token)
        if (hash === '#/inscription') return 'inscription';
        if (hash === '#/landing')     return 'landing';
        if (hash === '#/connexion')   return 'connexion';

        // 2. Hash vide ou racine → landing si non connecté, accueil sinon
        if (hash === '#/' || hash === '#') {
            if (!isTokenValide()) return 'landing';
            return estCaissier ? 'caissier' : 'accueil';
        }

        // 3. Toutes les autres pages nécessitent un token valide
        if (!isTokenValide()) return 'landing';

        // 4. Caissier forcé sur sa page
        if (estCaissier) return 'caissier';

        // 5. Pages admin/propriétaire
        if (hash === '#/acceuil')    return 'accueil';
        if (hash === '#/produits')   return 'produits';
        if (hash === '#/ventes')     return 'ventes';
        if (hash === '#/stock')      return 'stock';
        if (hash === '#/rapports')   return 'rapports';
        if (hash === '#/logs')       return 'logs';
        if (hash === '#/parametres') return 'parametres';
        if (hash === '#/caissier')   return 'caissier';

        return 'landing';
    }

    const updatePage = () => { page = checkAuth(); };

    window.addEventListener('hashchange', updatePage);
    updatePage(); // initialisation
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
{:else if page === 'parametres'}
    <Parametres />
{/if}