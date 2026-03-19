<script>
    import { onMount, onDestroy } from "svelte";

    let mobileNav = false;
    let visible = {};
    let observer;

    function goTo(hash) {
        window.location.hash = hash;
    }

    function observe() {
        if (typeof IntersectionObserver === "undefined") {
            // Fallback : tout visible si pas de support
            document.querySelectorAll("[data-reveal]").forEach(el => {
                el.classList.add("revealed");
            });
            return;
        }
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    visible = { ...visible, [entry.target.dataset.reveal]: true };
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    }

    onMount(() => { observe(); });
    onDestroy(() => { if (observer) observer.disconnect(); });
</script>

<!-- NAV -->
<header class="nav">
    <div class="nav-inner">
        <a href="/" class="nav-logo">
            <div class="nav-logo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <span>ATHENA</span>
        </a>

        <nav class="nav-links" class:open={mobileNav}>
            <a href="#fonctionnalites" on:click={() => mobileNav = false}>Fonctionnalités</a>
            <a href="#tarifs"          on:click={() => mobileNav = false}>Tarifs</a>
            <a href="#contact"         on:click={() => mobileNav = false}>Contact</a>
        </nav>

        <div class="nav-cta">
            <button class="btn-ghost"   on:click={() => goTo('#/connexion')}>Se connecter</button>
            <button class="btn-primary" on:click={() => goTo('#/inscription')}>Commencer gratuitement</button>
        </div>

        <button class="hamburger" on:click={() => mobileNav = !mobileNav} aria-label="Menu">
            <span class:open={mobileNav}></span>
            <span class:open={mobileNav}></span>
            <span class:open={mobileNav}></span>
        </button>
    </div>
</header>

<!-- HERO -->
<section class="hero">
    <div class="hero-bg">
        <div class="hero-orb orb1"></div>
        <div class="hero-orb orb2"></div>
        <div class="hero-grid"></div>
    </div>

    <div class="hero-inner">
        <div class="hero-badge">
            <span class="badge-dot"></span>
            Gestion de boutique intelligente
        </div>
        <h1 class="hero-title">
            Gérez votre boutique<br/>
            <span class="gradient-text">avec précision</span>
        </h1>
        <p class="hero-desc">
            ATHENA centralise vos ventes, stocks, caissiers et rapports en un seul tableau de bord. Simple, rapide, fait pour les commerçants africains.
        </p>
        <div class="hero-actions">
            <button class="btn-hero-primary" on:click={() => goTo('#/inscription')}>
                Démarrer gratuitement
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="btn-hero-ghost" on:click={() => goTo('#/connexion')}>
                J'ai déjà un compte
            </button>
        </div>
        <div class="hero-stats">
            <div class="stat"><span class="stat-num">100%</span><span class="stat-lbl">En ligne</span></div>
            <div class="stat-div"></div>
            <div class="stat"><span class="stat-num">0 FCFA</span><span class="stat-lbl">Pour démarrer</span></div>
            <div class="stat-div"></div>
            <div class="stat"><span class="stat-num">24/7</span><span class="stat-lbl">Disponible</span></div>
        </div>
    </div>

    <!-- Dashboard preview -->
    <div class="hero-preview" data-reveal="preview">
        <div class="preview-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="preview-url">app.athena-gestion.com</span>
        </div>
        <div class="preview-body">
            <div class="preview-sidebar">
                <div class="preview-logo"></div>
                {#each [1,2,3,4,5,6] as i}
                    <div class="preview-nav-item" class:active={i===1}></div>
                {/each}
            </div>
            <div class="preview-main">
                <div class="preview-topbar"></div>
                <div class="preview-cards">
                    {#each ['blue','green','orange'] as c}
                        <div class="preview-card p-{c}">
                            <div class="preview-card-line"></div>
                            <div class="preview-card-val"></div>
                            <div class="preview-card-sub"></div>
                        </div>
                    {/each}
                </div>
                <div class="preview-chart">
                    {#each [40,65,50,80,55,90,70] as h}
                        <div class="preview-bar-item" style="height:{h}%"></div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SOCIAL PROOF -->
<section class="trust">
    <p class="trust-label">Conçu pour les commerçants de</p>
    <div class="trust-countries">
        {#each ['🇹🇬 Togo','🇧🇯 Bénin','🇨🇮 Côte d\'Ivoire','🇸🇳 Sénégal','🇨🇲 Cameroun'] as c}
            <span class="trust-country">{c}</span>
        {/each}
    </div>
</section>

<!-- FONCTIONNALITÉS -->
<section class="features" id="fonctionnalites">
    <div class="section-inner">
        <div class="section-header" data-reveal="feat-h">
            <span class="section-tag">Fonctionnalités</span>
            <h2>Tout ce qu'il faut pour<br/>gérer votre boutique</h2>
            <p>Une suite complète d'outils pensés pour le commerce de détail en Afrique.</p>
        </div>
        <div class="features-grid">
            {#each [
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Caisse rapide",     desc:"Interface caisse optimisée pour les transactions rapides. Ajout au panier en un clic, calcul automatique du rendu monnaie.", color:"blue"   },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Gestion de stock",  desc:"Suivi en temps réel de votre inventaire. Alertes automatiques quand un produit approche du seuil de rupture.",           color:"green"  },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Multi-caissiers",  desc:"Créez des comptes caissiers avec accès limité à leur propre caisse. Chaque boutique garde ses données isolées.",            color:"purple" },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Rapports détaillés",desc:"Analysez vos performances par période. CA, panier moyen, top produits, ventes par caissier.",                              color:"orange" },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Logs d'activité",  desc:"Historique complet de toutes les actions. Connexions, ventes, modifications — une traçabilité totale.",                  color:"teal"   },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>`, title:"Tableau de bord",  desc:"Vue d'ensemble de votre activité en temps réel. Chiffre d'affaires, ventes, stock faible — tout en un écran.",           color:"indigo" },
            ] as f, i}
                <div class="feature-card fi-{f.color}" data-reveal="feat-{i}" style="transition-delay:{i * 0.07}s">
                    <div class="feature-icon-wrap fi-{f.color}-bg">{@html f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- SHOWCASE -->
<section class="showcase">
    <div class="section-inner">
        <div class="showcase-content" data-reveal="sc">
            <div class="showcase-text">
                <span class="section-tag">Interface intuitive</span>
                <h2>Conçu pour aller vite</h2>
                <p>Votre équipe sera opérationnelle en quelques minutes. Pas de formation longue, pas de manuel — juste une interface claire qui fait le travail.</p>
                <ul class="showcase-list">
                    {#each ['Navigation latérale rapide', 'Filtres et recherche instantanée', 'Compatible mobile et tablette', 'Thème sombre professionnel'] as item}
                        <li>
                            <span class="check-icon">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </span>
                            {item}
                        </li>
                    {/each}
                </ul>
                <button class="btn-hero-primary" on:click={() => goTo('#/inscription')}>
                    Essayer maintenant
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>

            <!-- Mockup dashboard -->
            <div class="showcase-visual">
                <div class="sv-card sv-main">
                    <div class="sv-header">
                        <div class="sv-dot"></div>
                        <div class="sv-title-bar"></div>
                        <div class="sv-badge-bar"></div>
                    </div>
                    {#each [85,60,90,45,75] as w, i}
                        <div class="sv-row">
                            <div class="sv-rank">{i+1}</div>
                            <div class="sv-name" style="width:{w}%"></div>
                            <div class="sv-val"></div>
                        </div>
                    {/each}
                </div>
                <div class="sv-card sv-float sv-float-top">
                    <div class="sv-fl-label"></div>
                    <div class="sv-fl-val"></div>
                    <span class="sv-trend up">↑ +12%</span>
                </div>
                <div class="sv-card sv-float sv-float-bottom">
                    <div class="sv-fl-label"></div>
                    <div class="sv-fl-val"></div>
                    <span class="sv-trend ok">✓ En stock</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TARIFS -->
<section class="pricing" id="tarifs">
    <div class="section-inner">
        <div class="section-header" data-reveal="pricing-h">
            <span class="section-tag">Tarifs</span>
            <h2>Commencez gratuitement,<br/>évoluez quand vous voulez</h2>
            <p>Aucune carte bancaire requise pour démarrer.</p>
        </div>
        <div class="pricing-grid">
            <div class="pricing-card" data-reveal="plan-0">
                <div class="plan-header">
                    <span class="plan-name">Starter</span>
                    <div class="plan-price">
                        <span class="plan-amount">0</span>
                        <span class="plan-currency">FCFA/mois</span>
                    </div>
                    <p class="plan-desc">Parfait pour démarrer et tester ATHENA sans risque.</p>
                </div>
                <ul class="plan-features">
                    {#each ['1 boutique','Jusqu\'à 50 produits','1 caissier inclus','Tableau de bord','Gestion des ventes','Support par email'] as f}
                        <li><span class="pf-check">✓</span>{f}</li>
                    {/each}
                </ul>
                <button class="plan-btn plan-btn-ghost" on:click={() => goTo('#/inscription')}>Commencer gratuitement</button>
            </div>

            <div class="pricing-card pricing-card-pro" data-reveal="plan-1">
                <div class="plan-popular">Recommandé</div>
                <div class="plan-header">
                    <span class="plan-name">Pro</span>
                    <div class="plan-price">
                        <span class="plan-amount">9 900</span>
                        <span class="plan-currency">FCFA/mois</span>
                    </div>
                    <p class="plan-desc">Pour les boutiques qui veulent tout contrôler sans limite.</p>
                </div>
                <ul class="plan-features">
                    {#each ['1 boutique','Produits illimités','Caissiers illimités','Tableau de bord avancé','Rapports & analyses','Logs d\'activité complets','Alertes stock automatiques','Support prioritaire 24/7'] as f}
                        <li><span class="pf-check">✓</span>{f}</li>
                    {/each}
                </ul>
                <button class="plan-btn plan-btn-primary" on:click={() => goTo('#/inscription')}>Démarrer l'essai gratuit</button>
            </div>
        </div>
    </div>
</section>

<!-- CTA FINAL -->
<section class="cta-section" id="contact">
    <div class="cta-orb"></div>
    <div class="cta-inner" data-reveal="cta">
        <span class="section-tag">Prêt à démarrer ?</span>
        <h2>Lancez votre boutique<br/>en 2 minutes</h2>
        <p>Rejoignez les commerçants qui utilisent ATHENA pour gérer leur activité au quotidien.</p>
        <div class="cta-actions">
            <button class="btn-hero-primary" on:click={() => goTo('#/inscription')}>
                Créer mon compte gratuitement
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="btn-hero-ghost" on:click={() => goTo('#/connexion')}>J'ai déjà un compte</button>
        </div>
    </div>
</section>

<!-- FOOTER -->
<footer class="footer">
    <div class="footer-inner">
        <div class="footer-brand">
            <div class="nav-logo-icon" style="width:28px;height:28px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <span class="footer-logo-name">ATHENA</span>
        </div>
        <p class="footer-copy">© 2026 ATHENA Gestion · Fait avec ❤️ pour les commerçants africains</p>
        <div class="footer-links">
            <button class="footer-link" on:click={() => goTo('#/connexion')}>Connexion</button>
            <button class="footer-link" on:click={() => goTo('#/inscription')}>Inscription</button>
        </div>
    </div>
</footer>

<style>
/* ═══════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════ */
:global(:root) {
    --bg:       #080b14;
    --bg-card:  #0f1523;
    --primary:  #3b82f6;
    --primary-glow: rgba(59,130,246,.45);
    --purple:   #8b5cf6;
    --text:     #f0f4ff;
    --muted:    #64748b;
    --border:   rgba(255,255,255,.07);
    --gradient: linear-gradient(135deg,#3b82f6,#8b5cf6);
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 22px;
}

:global(*,*::before,*::after) { box-sizing:border-box; margin:0; padding:0; }
:global(html) { scroll-behavior:smooth; background:var(--bg); color:var(--text); font-family:'Inter',system-ui,sans-serif; overflow-x:hidden; }
:global(body) { overflow-x:hidden; }

/* Reveal animation — :global car ajouté par JS */
:global([data-reveal]) { opacity:0; transform:translateY(28px); transition:opacity .75s cubic-bezier(.16,1,.3,1), transform .75s cubic-bezier(.16,1,.3,1); }
:global([data-reveal].revealed) { opacity:1; transform:translateY(0); }

/* ═══ NAVBAR ═══ */
.nav { position:fixed; top:0; left:0; right:0; z-index:200; backdrop-filter:blur(14px); background:rgba(8,11,20,.88); border-bottom:1px solid var(--border); }
.nav-inner { max-width:1200px; margin:auto; padding:.9rem 2rem; display:flex; align-items:center; gap:1.5rem; }
.nav-logo { display:flex; align-items:center; gap:.65rem; font-weight:800; font-size:1.1rem; color:#fff; text-decoration:none; }
.nav-logo-icon { background:var(--gradient); width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.nav-links { display:flex; gap:2rem; flex:1; justify-content:center; }
.nav-links a { text-decoration:none; color:var(--muted); font-size:.92rem; transition:color .2s; }
.nav-links a:hover { color:#fff; }
.nav-cta { display:flex; gap:.7rem; margin-left:auto; }

/* ═══ BUTTONS ═══ */
button { cursor:pointer; font-family:inherit; transition:.22s; border:none; }

.btn-primary { background:#fff; color:#080b14; padding:.58rem 1.25rem; border-radius:var(--radius-sm); font-weight:700; font-size:.9rem; }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,.3); }

.btn-ghost { background:transparent; border:1px solid var(--border); color:#fff; padding:.58rem 1.25rem; border-radius:var(--radius-sm); font-size:.9rem; }
.btn-ghost:hover { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.2); }

.btn-hero-primary { background:var(--gradient); color:#fff; padding:.85rem 1.75rem; border-radius:var(--radius-md); font-size:.98rem; font-weight:700; display:inline-flex; align-items:center; gap:.5rem; box-shadow:0 8px 24px -4px var(--primary-glow); }
.btn-hero-primary:hover { transform:translateY(-3px); box-shadow:0 14px 32px -4px var(--primary-glow); }

.btn-hero-ghost { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.85); padding:.85rem 1.6rem; border-radius:var(--radius-md); font-size:.98rem; font-weight:600; }
.btn-hero-ghost:hover { background:rgba(255,255,255,.1); color:#fff; }

/* ═══ HERO ═══ */
.hero { padding:9rem 2rem 5rem; text-align:center; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; }
.hero-bg { position:absolute; inset:0; z-index:0; pointer-events:none; }
.hero-orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:.18; }
.orb1 { width:500px; height:500px; background:var(--primary); top:-80px; left:-80px; animation:float 9s ease-in-out infinite; }
.orb2 { width:350px; height:350px; background:var(--purple); bottom:0; right:5%; animation:float 11s ease-in-out infinite reverse; }
.hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size:56px 56px; mask-image:radial-gradient(ellipse at center,black 30%,transparent 75%); }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-28px)} }

.hero-inner { position:relative; z-index:1; max-width:700px; }
.hero-badge { display:inline-flex; align-items:center; gap:.5rem; background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.25); color:#93c5fd; padding:.38rem 1rem; border-radius:100px; font-size:.8rem; font-weight:600; margin-bottom:1.75rem; }
.badge-dot { width:6px; height:6px; background:var(--primary); border-radius:50%; box-shadow:0 0 10px var(--primary); animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
.hero-title { font-size:clamp(2.5rem,6vw,4.2rem); font-weight:800; line-height:1.1; letter-spacing:-.03em; margin-bottom:1.4rem; }
.gradient-text { background:var(--gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hero-desc { max-width:560px; margin:0 auto 2.5rem; color:var(--muted); font-size:1.08rem; line-height:1.7; }
.hero-actions { display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:3rem; }

/* Hero stats */
.hero-stats { display:flex; align-items:center; justify-content:center; gap:1.5rem; }
.stat { display:flex; flex-direction:column; align-items:center; gap:.2rem; }
.stat-num { font-size:1.3rem; font-weight:800; color:#fff; }
.stat-lbl { font-size:.72rem; color:var(--muted); font-weight:500; }
.stat-div { width:1px; height:32px; background:var(--border); }

/* Hero preview */
.hero-preview { position:relative; z-index:1; width:100%; max-width:820px; margin-top:4rem; border-radius:var(--radius-md); overflow:hidden; box-shadow:0 40px 80px rgba(0,0,0,.6); border:1px solid var(--border); }
.preview-bar { background:#1a2030; padding:.55rem 1rem; display:flex; align-items:center; gap:.45rem; border-bottom:1px solid var(--border); }
.dot { width:11px; height:11px; border-radius:50%; }
.dot.red    { background:#ef4444; }
.dot.yellow { background:#f59e0b; }
.dot.green  { background:#22c55e; }
.preview-url { margin-left:.5rem; font-size:.7rem; color:rgba(255,255,255,.25); font-family:monospace; }
.preview-body { display:flex; height:280px; background:#0d1220; }
.preview-sidebar { width:50px; background:#09111e; border-right:1px solid var(--border); padding:10px 7px; display:flex; flex-direction:column; gap:5px; }
.preview-logo { width:36px; height:22px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius:5px; margin-bottom:8px; }
.preview-nav-item { height:26px; background:rgba(255,255,255,.04); border-radius:5px; }
.preview-nav-item.active { background:#1d4ed8; }
.preview-main { flex:1; padding:10px; display:flex; flex-direction:column; gap:8px; }
.preview-topbar { height:26px; background:rgba(255,255,255,.04); border-radius:5px; }
.preview-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; }
.preview-card { background:rgba(255,255,255,.04); border-radius:7px; padding:8px 7px; border:1px solid rgba(255,255,255,.05); }
.preview-card::before { content:''; display:block; height:2px; border-radius:2px; margin-bottom:7px; }
.p-blue::before   { background:linear-gradient(90deg,#2563eb,#60a5fa); }
.p-green::before  { background:linear-gradient(90deg,#16a34a,#4ade80); }
.p-orange::before { background:linear-gradient(90deg,#ea580c,#fb923c); }
.preview-card-line { height:5px; background:rgba(255,255,255,.08); border-radius:3px; width:55%; margin-bottom:5px; }
.preview-card-val  { height:9px; background:rgba(255,255,255,.14); border-radius:3px; width:75%; margin-bottom:4px; }
.preview-card-sub  { height:4px; background:rgba(255,255,255,.05); border-radius:3px; width:45%; }
.preview-chart { display:flex; align-items:flex-end; gap:5px; flex:1; padding:6px; background:rgba(255,255,255,.02); border-radius:7px; }
.preview-bar-item { flex:1; background:linear-gradient(180deg,#60a5fa,#2563eb); border-radius:3px 3px 0 0; min-height:4px; }

/* ═══ TRUST ═══ */
.trust { padding:2.5rem 2rem; text-align:center; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:rgba(255,255,255,.015); }
.trust-label { color:var(--muted); font-size:.8rem; font-weight:500; text-transform:uppercase; letter-spacing:.08em; margin-bottom:1rem; }
.trust-countries { display:flex; flex-wrap:wrap; justify-content:center; gap:.75rem; }
.trust-country { background:var(--bg-card); border:1px solid var(--border); padding:.42rem 1.1rem; border-radius:100px; font-size:.9rem; }

/* ═══ SECTIONS ═══ */
.section-inner { max-width:1200px; margin:auto; padding:0 2rem; }
.section-header { text-align:center; margin-bottom:3.5rem; }
.section-header h2 { font-size:clamp(1.9rem,4vw,3rem); font-weight:800; letter-spacing:-.02em; margin:.75rem 0 1rem; line-height:1.2; }
.section-header p { color:var(--muted); font-size:1rem; max-width:520px; margin:auto; line-height:1.7; }
.section-tag { display:inline-block; color:var(--primary); font-size:.75rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }

/* ═══ FEATURES ═══ */
.features { padding:7rem 0; }
.features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
.feature-card { background:var(--bg-card); border:1px solid var(--border); padding:2rem; border-radius:var(--radius-lg); transition:transform .3s, border-color .3s; }
.feature-card:hover { transform:translateY(-6px); border-color:rgba(255,255,255,.14); }
.feature-icon-wrap { width:48px; height:48px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; margin-bottom:1.2rem; }
.fi-blue-bg   { background:rgba(59,130,246,.12);  color:#3b82f6; }
.fi-green-bg  { background:rgba(34,197,94,.12);   color:#22c55e; }
.fi-purple-bg { background:rgba(168,85,247,.12);  color:#a855f7; }
.fi-orange-bg { background:rgba(249,115,22,.12);  color:#f97316; }
.fi-teal-bg   { background:rgba(20,184,166,.12);  color:#14b8a6; }
.fi-indigo-bg { background:rgba(99,102,241,.12);  color:#818cf8; }
.feature-card h3 { font-size:1.05rem; font-weight:700; margin-bottom:.5rem; color:#fff; }
.feature-card p  { color:var(--muted); font-size:.88rem; line-height:1.65; }

/* ═══ SHOWCASE ═══ */
.showcase { padding:6rem 0; background:rgba(255,255,255,.015); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.showcase-content { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; }
.showcase-text .section-tag { margin-bottom:.75rem; display:block; }
.showcase-text h2 { font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; letter-spacing:-.02em; margin-bottom:1rem; }
.showcase-text p  { color:var(--muted); font-size:.95rem; line-height:1.75; margin-bottom:1.5rem; }
.showcase-list { list-style:none; margin-bottom:2rem; display:flex; flex-direction:column; gap:.6rem; }
.showcase-list li { display:flex; align-items:center; gap:.7rem; color:rgba(255,255,255,.7); font-size:.92rem; }
.check-icon { width:22px; height:22px; background:rgba(59,130,246,.15); border:1px solid rgba(59,130,246,.3); border-radius:6px; display:flex; align-items:center; justify-content:center; color:var(--primary); flex-shrink:0; }

/* Showcase mockup */
.showcase-visual { position:relative; height:300px; }
.sv-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:1rem; }
.sv-main { position:absolute; top:0; left:0; right:55px; box-shadow:0 20px 50px rgba(0,0,0,.5); }
.sv-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.85rem; }
.sv-dot { width:8px; height:8px; background:var(--primary); border-radius:50%; }
.sv-title-bar { height:7px; background:rgba(255,255,255,.12); border-radius:4px; flex:1; }
.sv-badge-bar { height:14px; width:40px; background:rgba(59,130,246,.25); border-radius:6px; }
.sv-row { display:flex; align-items:center; gap:.55rem; background:rgba(255,255,255,.03); border-radius:7px; padding:.45rem .6rem; margin-bottom:.4rem; }
.sv-rank { width:16px; height:16px; background:rgba(255,255,255,.07); border-radius:4px; font-size:.58rem; color:rgba(255,255,255,.4); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.sv-name { height:6px; background:rgba(255,255,255,.1); border-radius:3px; flex:1; }
.sv-val { width:44px; height:14px; background:rgba(34,197,94,.2); border-radius:5px; }
.sv-float { position:absolute; width:130px; }
.sv-float-top    { top:10px; right:0; }
.sv-float-bottom { bottom:20px; right:0; }
.sv-fl-label { height:6px; background:rgba(255,255,255,.08); border-radius:3px; width:65%; margin-bottom:.45rem; }
.sv-fl-val   { height:16px; background:rgba(255,255,255,.12); border-radius:4px; margin-bottom:.4rem; }
.sv-trend { font-size:.7rem; font-weight:700; }
.sv-trend.up { color:#4ade80; }
.sv-trend.ok { color:#4ade80; }

/* ═══ PRICING ═══ */
.pricing { padding:7rem 0; }
.pricing-grid { display:flex; justify-content:center; gap:1.75rem; flex-wrap:wrap; margin-top:4rem; }
.pricing-card { background:var(--bg-card); border:1px solid var(--border); padding:2.5rem; border-radius:var(--radius-lg); max-width:360px; width:100%; position:relative; transition:transform .3s; }
.pricing-card:hover { transform:translateY(-5px); }
.pricing-card-pro { border-color:var(--primary); border-width:2px; }
.plan-popular { position:absolute; top:1.1rem; right:1.1rem; background:var(--gradient); font-size:.68rem; padding:.28rem .85rem; border-radius:100px; font-weight:800; color:#fff; }
.plan-name { display:block; font-size:1.15rem; font-weight:700; margin-bottom:.85rem; color:#fff; }
.plan-price { display:flex; align-items:baseline; gap:.35rem; margin-bottom:.75rem; }
.plan-amount { font-size:2.8rem; font-weight:800; color:#fff; }
.plan-currency { color:var(--muted); font-size:.9rem; }
.plan-desc { color:var(--muted); font-size:.88rem; line-height:1.6; margin-bottom:1.75rem; }
.plan-features { list-style:none; margin-bottom:2rem; display:flex; flex-direction:column; gap:.5rem; }
.plan-features li { display:flex; align-items:center; gap:.6rem; padding:.45rem 0; color:rgba(255,255,255,.7); font-size:.9rem; border-bottom:1px solid var(--border); }
.plan-features li:last-child { border-bottom:none; }
.pf-check { color:var(--primary); font-weight:700; flex-shrink:0; }
.plan-btn { width:100%; padding:.9rem; border-radius:var(--radius-sm); font-weight:700; font-size:.92rem; }
.plan-btn-primary { background:var(--gradient); color:#fff; box-shadow:0 4px 16px -2px var(--primary-glow); }
.plan-btn-primary:hover { transform:translateY(-2px); }
.plan-btn-ghost { background:transparent; border:1px solid var(--border); color:#fff; }
.plan-btn-ghost:hover { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.2); }

/* ═══ CTA ═══ */
.cta-section { padding:8rem 2rem; text-align:center; position:relative; overflow:hidden; }
.cta-orb { position:absolute; width:500px; height:500px; background:var(--gradient); border-radius:50%; filter:blur(100px); opacity:.15; top:50%; left:50%; transform:translate(-50%,-50%); z-index:0; pointer-events:none; }
.cta-inner { position:relative; z-index:1; max-width:600px; margin:auto; }
.cta-inner h2 { font-size:clamp(2rem,4vw,3rem); font-weight:800; letter-spacing:-.02em; margin:.75rem 0 1rem; }
.cta-inner p  { color:var(--muted); font-size:1rem; line-height:1.7; margin-bottom:2.5rem; }
.cta-actions { display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; }

/* ═══ FOOTER ═══ */
.footer { padding:3rem 2rem; border-top:1px solid var(--border); }
.footer-inner { max-width:1200px; margin:auto; display:flex; flex-direction:column; align-items:center; gap:1.25rem; }
.footer-brand { display:flex; align-items:center; gap:.5rem; }
.footer-logo-name { font-weight:800; font-size:1rem; }
.footer-copy { color:var(--muted); font-size:.82rem; }
.footer-links { display:flex; gap:1.5rem; }
.footer-link { background:none; border:none; color:var(--muted); font-size:.85rem; cursor:pointer; padding:0; transition:color .2s; font-family:inherit; }
.footer-link:hover { color:#fff; }

/* ═══ HAMBURGER ═══ */
.hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; padding:4px; }
.hamburger span { display:block; width:22px; height:2px; background:#fff; border-radius:2px; transition:.3s; }
.hamburger span.open:first-child  { transform:rotate(45deg) translate(5px,5px); }
.hamburger span.open:nth-child(2) { opacity:0; }
.hamburger span.open:last-child   { transform:rotate(-45deg) translate(5px,-5px); }

/* ═══ RESPONSIVE ═══ */
@media (max-width:1024px) { .features-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:860px) {
    .nav-links,.nav-cta { display:none; }
    .hamburger { display:flex; }
    .nav-links.open { display:flex; flex-direction:column; position:fixed; top:60px; left:0; right:0; background:rgba(8,11,20,.98); padding:2rem; border-bottom:1px solid var(--border); z-index:199; gap:1.25rem; }
    .showcase-content { grid-template-columns:1fr; }
    .showcase-visual { display:none; }
    .pricing-card-pro { transform:none; }
    .pricing-card-pro:hover { transform:translateY(-5px); }
}
@media (max-width:640px) {
    .features-grid { grid-template-columns:1fr; }
    .hero { padding:7rem 1.25rem 4rem; }
    .hero-stats { gap:1rem; }
    .hero-preview { display:none; }
    .pricing-grid { flex-direction:column; align-items:center; }
    .section-inner { padding:0 1.25rem; }
}
</style>