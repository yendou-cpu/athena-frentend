    <script>
    import './app.css';
    import Acceuil from './components/accueil.svelte';
    import Stock from './components/stock.svelte';
    import Parametres from './components/parametres.svelte';

    let menuItems = ["acceuil", "stock", "parametres"];
    let selectedMenuItem = $state(menuItems[0]);
    let ongletName = $state(menuItems[0]);
    function selectedAcceuil(){
        selectedMenuItem = menuItems[0];
        ongletName = menuItems[0];
    }
    function selectedStock(){
        selectedMenuItem = menuItems[1];
        ongletName = menuItems[1];
    }
    function selectedParametres(){
        selectedMenuItem = menuItems[2];
        ongletName = menuItems[2];
    }
    </script>

    <div class="menu">
    <div class="menu-top">
        <span>Menu</span>
        <button onclick={selectedAcceuil}>Acceuil</button>
        <button onclick={selectedStock}>Stock</button>

    </div>
    <div class="menu-bottom">
        <button onclick={selectedParametres}>Parametres</button>
    </div>
    </div>

    <div class="onglet">
    <!--  bar option(permet le light mode, dark mode et de savoir nom de l'onglet dans lequel l'utilisateur se trouve)-->
    <div class="option-bar">
        <span>{ongletName}</span>

    </div>

    <!--    onglet(composants importer contenant d'autres composants)-->
    {#if ongletName===menuItems[0]}
        <Acceuil/>
        {:else if ongletName===menuItems[1]}
        <Stock/>
        {:else if ongletName===menuItems[2]}
        <Parametres/>
    {/if}

    </div>


    <style>

    </style>