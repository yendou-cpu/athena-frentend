<script>
    let nom          = "";
    let prenoms      = "";
    let nom_boutique = "";
    let email        = "";
    let numerotel    = "";
    let password     = "";
    let role         = "Admin";

    let message    = "";
    let erreur     = "";
    let chargement = false;

    async function register() {
        message    = "";
        erreur     = "";
        chargement = true;

        try {
            if (!nom || !prenoms || !email || !password || !role) {
                erreur = "Veuillez remplir tous les champs obligatoires.";
                return;
            }

            const response = await fetch("https://main-athena-api.onrender.com/api/utilisateurs/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, prenoms, nom_boutique, email, numerotel, password, role })
            });

            const data = await response.json();

            if (!response.ok) {
                erreur = data.message || "Une erreur est survenue.";
            } else {
                message = "Compte créé avec succès ! Redirection...";
                setTimeout(() => window.location.href = '#/connexion', 2000);
            }

        } catch (e) {
            erreur = "Impossible de contacter le serveur.";
        } finally {
            chargement = false;
        }
    }
</script>

<div class="page">
    <div class="card">

        <div class="card-header">
            <h1>Créer un compte</h1>
            <p class="subtitle">Rejoignez ATHENA pour gérer votre boutique</p>
        </div>

        <div class="form">

            <div class="row-2">
                <div class="field">
                    <label for="nom">Nom <span class="required">*</span></label>
                    <input id="nom" type="text" bind:value={nom} placeholder="KOLA" />
                </div>
                <div class="field">
                    <label for="prenoms">Prénom <span class="required">*</span></label>
                    <input id="prenoms" type="text" bind:value={prenoms} placeholder="Jean" />
                </div>
            </div>

            <div class="field">
                <label for="nom_boutique">Nom de la boutique <span class="optional">(optionnel)</span></label>
                <input id="nom_boutique" type="text" bind:value={nom_boutique} placeholder="Ma Boutique" />
            </div>

            <div class="field">
                <label for="email">Adresse email <span class="required">*</span></label>
                <input id="email" type="email" bind:value={email} placeholder="kola@exemple.com" />
            </div>

            <div class="row-2">
                <div class="field">
                    <label for="numerotel">Téléphone</label>
                    <input id="numerotel" type="tel" bind:value={numerotel} placeholder="+228 00 00 00 00" />
                </div>
                <div class="field">
                    <label for="role">Rôle <span class="required">*</span></label>
                    <select id="role" bind:value={role}>
                        <option value="proprietaire">Admin</option>
                    </select>
                </div>
            </div>

            <div class="field">
                <label for="password">Mot de passe <span class="required">*</span></label>
                <input id="password" type="password" bind:value={password} placeholder="••••••••" />
            </div>

            {#if erreur}
                <div class="alert alert-error">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    {erreur}
                </div>
            {/if}

            {#if message}
                <div class="alert alert-success">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {message}
                </div>
            {/if}

            <button class="btn-primary" on:click={register} disabled={chargement}>
                {#if chargement}
                    <span class="spinner"></span> Inscription en cours...
                {:else}
                    S'inscrire
                {/if}
            </button>

            <p class="login-link">
                Déjà un compte ? <a href="#/connexion">Se connecter</a>
            </p>

        </div>
    </div>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #f8fafc, #eef2f7);
    color: #1f2937;
}

.page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}

.card {
    width: 100%;
    max-width: 520px;
    background: white;
    padding: 0 42px 0 42px;
    height: auto;
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    box-shadow:
        0 10px 25px rgba(0,0,0,0.06),
        0 2px 6px rgba(0,0,0,0.04);
    transition: transform .2s ease, box-shadow .2s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow:
        0 14px 35px rgba(0,0,0,0.08),
        0 3px 8px rgba(0,0,0,0.05);
}

.card-header {
    text-align: center;
    margin-bottom: 34px;
}

h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
}

.subtitle {
    margin-top: 6px;
    font-size: 14px;
    color: #6b7280;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
}

.required { color: #ef4444; font-size: 13px; }
.optional { font-weight: 400; font-size: 12px; color: #9ca3af; }

input, select {
    padding: 13px 14px;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    font-family: 'Inter', sans-serif;
    color: #1f2937;
    transition:
        border-color .2s,
        box-shadow .2s,
        background .2s;
    width: 100%;
    box-sizing: border-box;
    outline: none;
}

input::placeholder { color: #9ca3af; }

input:focus, select:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}

.btn-primary {
    margin-top: 10px;
    padding: 14px;
    border-radius: 10px;
    border: none;
    font-size: 15px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'Inter', sans-serif;
    transition:
        transform .15s ease,
        box-shadow .2s ease;
    width: 100%;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59,130,246,.35);
}

.btn-primary:active { transform: scale(.98); }

.btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
}

.alert {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    padding: 12px 16px;
    border-radius: 10px;
}

.alert-error {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
}

.alert-success {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin .8s linear infinite;
    display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.login-link {
    margin-top: 18px;
    text-align: center;
    font-size: 14px;
    color: #6b7280;
}

.login-link a {
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;
}

.login-link a:hover { text-decoration: underline; }

@media (max-width: 480px) {
    .row-2 { grid-template-columns: 1fr; }
    .card {
        padding: 28px;
        border-radius: 16px;
    }
    h1 { font-size: 22px; }
}
</style>
