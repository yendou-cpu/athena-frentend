<script>
let email = "";
let password = "";
let message = "";
let erreur = "";
let chargement = false;

async function login() {
    message = "";
    erreur = "";
    chargement = true;

    try {
        if (email && password) {
            const response = await fetch("https://main-athena-api.onrender.com/api/utilisateurs/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                erreur = data.message || "Email ou mot de passe incorrect.";
            } else {
                // 1. Stockage immédiat
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                message = "Connexion réussie !";

                // 2. Redirection plus rapide (500ms au lieu de 2000ms pour laisser lire le message)
                // Si vous utilisez un routeur, remplacez par : push('/accueil')
                setTimeout(() => {
                    window.location.assign('#/acceuil'); 
                }, 500);
            }
        } else {
            erreur = "Veuillez remplir tous les champs.";
        }
    } catch (e) {
        erreur = "Impossible de contacter le serveur. Vérifiez votre connexion.";
    } finally {
        chargement = false;
    }
}
</script>

<div class="page">
    <div class="card">

        <div class="card-header">
            <h1>Connexion</h1>
            <p class="subtitle">Accédez à votre espace Athena</p>
        </div>

        <div class="form">

            <div class="field">
                <label for="email">Adresse email</label>
                <input id="email" type="email" bind:value={email} placeholder="jean@exemple.com" required />
            </div>

            <div class="field">
                <label for="password">Mot de passe</label>
                <input id="password" type="password" bind:value={password} placeholder="••••••••" required />
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

            <button class="btn-primary" on:click={login} disabled={chargement}>
                {#if chargement}
                    <span class="spinner"></span> Connexion en cours...
                {:else}
                    Se connecter
                {/if}
            </button>

            <p class="login-link">
                Pas encore de compte ? <a href="#/inscription">S'inscrire</a>
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
    padding: 42px;
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

input {
    padding: 13px 14px;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    font-family: 'Inter', sans-serif;
    transition:
        border-color .2s,
        box-shadow .2s,
        background .2s;
    width: 100%;
    box-sizing: border-box;
    outline: none;
}

input::placeholder { color: #9ca3af; }

input:focus {
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
        box-shadow .2s ease,
        background .2s;
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
    .card {
        padding: 28px;
        border-radius: 16px;
    }
    h1 { font-size: 22px; }
}
</style>