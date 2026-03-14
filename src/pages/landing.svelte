<script>
    // Routing simple vers connexion/inscription
    function goTo(hash) { window.location.href = hash; }

    // Animation scroll reveal
    let visible = {};
    function observe() {
        if (typeof IntersectionObserver === 'undefined') return;
        document.querySelectorAll('[data-reveal]').forEach(el => {
            new IntersectionObserver(entries => {
                entries.forEach(e => { if (e.isIntersecting) { visible[e.target.dataset.reveal] = true; visible = visible; } });
            }, { threshold: 0.15 }).observe(el);
        });
    }

    import { onMount } from 'svelte';
    onMount(() => { observe(); });

    let mobileNav = false;
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
            <a href="#fonctionnalites" on:click={() => mobileNav=false}>Fonctionnalités</a>
            <a href="#tarifs" on:click={() => mobileNav=false}>Tarifs</a>
            <a href="#contact" on:click={() => mobileNav=false}>Contact</a>
        </nav>

        <div class="nav-cta">
            <button class="btn-ghost" on:click={() => goTo('#/connexion')}>Se connecter</button>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
                Voir la démo
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
    <div class="hero-preview" data-reveal="preview" class:revealed={visible['preview']}>
        <div class="preview-bar">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
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
                        <div class="preview-bar" style="height:{h}%"></div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>

<!-- LOGOS / SOCIAL PROOF -->
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
        <div class="section-header" data-reveal="feat-h" class:revealed={visible['feat-h']}>
            <span class="section-tag">Fonctionnalités</span>
            <h2>Tout ce qu'il faut pour<br/>gérer votre boutique</h2>
            <p>Une suite complète d'outils pensés pour le commerce de détail en Afrique.</p>
        </div>

        <div class="features-grid">
            {#each [
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Caisse rapide", desc:"Interface caisse optimisée pour les transactions rapides. Ajout au panier en un clic, calcul automatique du rendu monnaie.", color:"blue", delay:0 },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Gestion de stock", desc:"Suivi en temps réel de votre inventaire. Alertes automatiques quand un produit approche du seuil de rupture.", color:"green", delay:1 },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Multi-caissiers", desc:"Créez des comptes caissiers avec accès limité à leur propre caisse. Chaque boutique garde ses données isolées.", color:"purple", delay:2 },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Rapports détaillés", desc:"Analysez vos performances par période. CA, panier moyen, top produits, ventes par caissier — tout en un coup d'œil.", color:"orange", delay:3 },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, title:"Logs d'activité", desc:"Historique complet de toutes les actions. Connexions, ventes, modifications — une traçabilité totale de votre boutique.", color:"teal", delay:4 },
                { icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>`, title:"Tableau de bord", desc:"Vue d'ensemble de votre activité en temps réel. Chiffre d'affaires, ventes du jour, stock faible — tout en un seul écran.", color:"indigo", delay:5 },
            ] as f, i}
                <div class="feature-card fc-{f.color}" data-reveal="feat-{i}" class:revealed={visible[`feat-${i}`]} style="animation-delay:{f.delay * 0.08}s">
                    <div class="feature-icon fi-{f.color}">{@html f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- SCREENSHOT SECTION -->
<section class="showcase">
    <div class="section-inner">
        <div class="showcase-content" data-reveal="sc" class:revealed={visible['sc']}>
            <div class="showcase-text">
                <span class="section-tag">Interface intuitive</span>
                <h2>Conçu pour aller vite</h2>
                <p>Votre équipe sera opérationnelle en quelques minutes. Pas de formation longue, pas de manuel d'utilisation — juste une interface claire qui fait le travail.</p>
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
                <button class="btn-primary" on:click={() => goTo('#/inscription')}>Essayer maintenant</button>
            </div>
            <div class="showcase-visual">
                <div class="visual-card vc-main">
                    <div class="vc-header">
                        <div class="vc-dot"></div>
                        <div class="vc-title"></div>
                        <div class="vc-badge"></div>
                    </div>
                    <div class="vc-rows">
                        {#each [85,60,90,45,75] as w, i}
                            <div class="vc-row">
                                <div class="vc-rank">{i+1}</div>
                                <div class="vc-name" style="width:{w}%"></div>
                                <div class="vc-val"></div>
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="visual-card vc-small vc-top">
                    <div class="vc-s-label"></div>
                    <div class="vc-s-val"></div>
                    <div class="vc-s-trend up">↑ +12%</div>
                </div>
                <div class="visual-card vc-small vc-bottom">
                    <div class="vc-s-label"></div>
                    <div class="vc-s-val"></div>
                    <div class="vc-s-trend ok">✓ En stock</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TARIFS -->
<section class="pricing" id="tarifs">
    <div class="section-inner">
        <div class="section-header" data-reveal="pricing-h" class:revealed={visible['pricing-h']}>
            <span class="section-tag">Tarifs</span>
            <h2>Commencez gratuitement,<br/>évoluez quand vous voulez</h2>
            <p>Aucune carte bancaire requise pour démarrer.</p>
        </div>
        <div class="pricing-grid">
            <!-- Gratuit -->
            <div class="pricing-card" data-reveal="plan-0" class:revealed={visible['plan-0']}>
                <div class="plan-header">
                    <span class="plan-name">Starter</span>
                    <div class="plan-price"><span class="plan-amount">0</span><span class="plan-currency">FCFA/mois</span></div>
                    <p class="plan-desc">Parfait pour démarrer et tester ATHENA sans risque.</p>
                </div>
                <ul class="plan-features">
                    {#each ['1 boutique','Jusqu\'à 50 produits','1 caissier inclus','Tableau de bord','Gestion des ventes','Support par email'] as f}
                        <li><span class="pf-check">✓</span>{f}</li>
                    {/each}
                </ul>
                <button class="plan-btn plan-btn-ghost" on:click={() => goTo('#/inscription')}>Commencer gratuitement</button>
            </div>

            <!-- Pro -->
            <div class="pricing-card pricing-card-pro" data-reveal="plan-1" class:revealed={visible['plan-1']}>
                <div class="plan-popular">Recommandé</div>
                <div class="plan-header">
                    <span class="plan-name">Pro</span>
                    <div class="plan-price"><span class="plan-amount">9 900</span><span class="plan-currency">FCFA/mois</span></div>
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
    <div class="cta-inner" data-reveal="cta" class:revealed={visible['cta']}>
        <div class="cta-orb"></div>
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
            <div class="nav-logo-icon" style="width:26px;height:26px">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <span class="footer-logo-name">ATHENA</span>
        </div>
        <p class="footer-copy">© 2026 ATHENA Gestion. Fait avec ❤️ pour les commerçants africains.</p>
        <div class="footer-links">
            <a href="#/connexion">Connexion</a>
            <a href="#/inscription">Inscription</a>
        </div>
    </div>
</footer>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:global(body) { font-family: 'Sora', sans-serif; background: #060d1f; color: #e2e8f0; overflow-x: hidden; }
:global(html) { scroll-behavior: smooth; }

/* ══ NAV ══ */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(6,13,31,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.06); }
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; height: 64px; display: flex; align-items: center; gap: 2rem; }
.nav-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; font-weight: 800; font-size: 1rem; color: #fff; letter-spacing: 0.05em; }
.nav-logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 12px rgba(59,130,246,0.4); }
.nav-links { display: flex; align-items: center; gap: 2rem; flex: 1; }
.nav-links a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.88rem; font-weight: 500; transition: color 0.2s; }
.nav-links a:hover { color: #fff; }
.nav-cta { display: flex; align-items: center; gap: 0.75rem; margin-left: auto; }
.btn-ghost { padding: 0.48rem 1rem; background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); border-radius: 9px; font-family: 'Sora',sans-serif; font-size: 0.83rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-ghost:hover { border-color: rgba(255,255,255,0.35); color: #fff; background: rgba(255,255,255,0.05); }
.btn-primary { padding: 0.5rem 1.1rem; background: #2563eb; color: #fff; border: none; border-radius: 9px; font-family: 'Sora',sans-serif; font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.4); }
.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.7); border-radius: 2px; transition: all 0.3s; }

/* ══ HERO ══ */
.hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 1.5rem 80px; position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25; }
.orb1 { width: 600px; height: 600px; background: radial-gradient(circle, #2563eb, transparent); top: -100px; left: -100px; animation: float 8s ease-in-out infinite; }
.orb2 { width: 400px; height: 400px; background: radial-gradient(circle, #7c3aed, transparent); bottom: -50px; right: 10%; animation: float 10s ease-in-out infinite reverse; }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%); }
@keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)} }

.hero-inner { max-width: 700px; text-align: center; position: relative; z-index: 1; }
.hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); color: #93c5fd; padding: 0.38rem 1rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; margin-bottom: 1.5rem; }
.badge-dot { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: pulse 2s ease infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)} }
.hero-title { font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.12; color: #f8fafc; margin-bottom: 1.25rem; letter-spacing: -0.02em; }
.gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-desc { font-size: 1.05rem; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 2rem; max-width: 540px; margin-left: auto; margin-right: auto; }
.hero-actions { display: flex; align-items: center; justify-content: center; gap: 0.85rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
.btn-hero-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.6rem; background: linear-gradient(135deg,#2563eb,#1d4ed8); color: #fff; border: none; border-radius: 12px; font-family: 'Sora',sans-serif; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(37,99,235,0.4); }
.btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(37,99,235,0.5); }
.btn-hero-ghost { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.73rem 1.4rem; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; font-family: 'Sora',sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-hero-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
.hero-stats { display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
.stat { display: flex; flex-direction: column; align-items: center; }
.stat-num { font-size: 1.2rem; font-weight: 800; color: #f8fafc; }
.stat-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.4); font-weight: 500; }
.stat-div { width: 1px; height: 32px; background: rgba(255,255,255,0.1); }

/* PREVIEW */
.hero-preview { width: 100%; max-width: 860px; margin-top: 4rem; position: relative; z-index: 1; opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(.4,0,.2,1); }
.hero-preview.revealed { opacity: 1; transform: translateY(0); }
.preview-bar { background: #1e293b; border-radius: 12px 12px 0 0; padding: 0.65rem 1rem; display: flex; align-items: center; gap: 0.5rem; border: 1px solid rgba(255,255,255,0.08); border-bottom: none; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #22c55e; }
.preview-url { margin-left: 0.5rem; font-size: 0.72rem; color: rgba(255,255,255,0.3); font-family: monospace; }
.preview-body { display: flex; height: 320px; background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: 0 0 12px 12px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
.preview-sidebar { width: 52px; background: #0a1628; border-right: 1px solid rgba(255,255,255,0.05); padding: 12px 8px; display: flex; flex-direction: column; gap: 6px; }
.preview-logo { width: 36px; height: 24px; background: linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius: 6px; margin-bottom: 8px; }
.preview-nav-item { height: 28px; background: rgba(255,255,255,0.04); border-radius: 6px; }
.preview-nav-item.active { background: #1d4ed8; }
.preview-main { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.preview-topbar { height: 28px; background: rgba(255,255,255,0.04); border-radius: 6px; }
.preview-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.preview-card { background: rgba(255,255,255,0.04); border-radius: 8px; padding: 10px 8px; border: 1px solid rgba(255,255,255,0.05); }
.preview-card::before { content:''; display:block; height:2px; border-radius:2px; margin-bottom:8px; }
.p-blue::before { background: linear-gradient(90deg,#2563eb,#60a5fa); }
.p-green::before { background: linear-gradient(90deg,#16a34a,#4ade80); }
.p-orange::before { background: linear-gradient(90deg,#ea580c,#fb923c); }
.preview-card-line { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; width: 60%; margin-bottom: 6px; }
.preview-card-val { height: 10px; background: rgba(255,255,255,0.15); border-radius: 3px; width: 80%; margin-bottom: 5px; }
.preview-card-sub { height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; width: 50%; }
.preview-chart { display: flex; align-items: flex-end; gap: 5px; height: 80px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; }
.preview-bar { flex: 1; background: linear-gradient(180deg,#60a5fa,#2563eb); border-radius: 3px 3px 0 0; min-height: 4px; }

/* ══ TRUST ══ */
.trust { padding: 2rem 1.5rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); }
.trust-label { font-size: 0.78rem; color: rgba(255,255,255,0.35); font-weight: 500; margin-bottom: 1rem; letter-spacing: 0.06em; text-transform: uppercase; }
.trust-countries { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 1rem; }
.trust-country { font-size: 0.88rem; color: rgba(255,255,255,0.5); font-weight: 500; }

/* ══ SECTIONS ══ */
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.section-header { text-align: center; margin-bottom: 3.5rem; opacity: 0; transform: translateY(30px); transition: all 0.7s ease; }
.section-header.revealed { opacity: 1; transform: translateY(0); }
.section-tag { display: inline-block; background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.25); color: #93c5fd; padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1rem; }
.section-header h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #111213; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 1rem; }
.section-header p { font-size: 1rem; color: rgba(255,255,255,0.5); max-width: 500px; margin: 0 auto; line-height: 1.7; }

/* ══ FEATURES ══ */
.features { padding: 6rem 0; }
.features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
.feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.75rem; opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
.feature-card.revealed { opacity: 1; transform: translateY(0); }
.feature-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.12); transform: translateY(-4px) !important; }
.feature-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.1rem; }
.fi-blue   { background: rgba(37,99,235,0.15);  color: #60a5fa; }
.fi-green  { background: rgba(22,163,74,0.15);  color: #4ade80; }
.fi-purple { background: rgba(124,58,237,0.15); color: #a78bfa; }
.fi-orange { background: rgba(234,88,12,0.15);  color: #fb923c; }
.fi-teal   { background: rgba(6,182,212,0.15);  color: #22d3ee; }
.fi-indigo { background: rgba(99,102,241,0.15); color: #818cf8; }
.feature-card h3 { font-size: 1rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.6rem; }
.feature-card p { font-size: 0.84rem; color: rgba(255,255,255,0.5); line-height: 1.7; }

/* ══ SHOWCASE ══ */
.showcase { padding: 6rem 0; background: rgba(255,255,255,0.015); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.showcase-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
.showcase-content.revealed { opacity: 1; transform: translateY(0); }
.showcase-text .section-tag { margin-bottom: 0.85rem; }
.showcase-text h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 800; color: #f8fafc; line-height: 1.2; margin-bottom: 1rem; letter-spacing: -0.02em; }
.showcase-text p { font-size: 0.93rem; color: rgba(255,255,255,0.5); line-height: 1.75; margin-bottom: 1.5rem; }
.showcase-list { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 2rem; }
.showcase-list li { display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; color: rgba(255,255,255,0.7); }
.check-icon { width: 20px; height: 20px; background: rgba(37,99,235,0.2); border: 1px solid rgba(37,99,235,0.3); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #60a5fa; flex-shrink: 0; }
.showcase-visual { position: relative; height: 320px; }
.visual-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.1rem; }
.vc-main { position: absolute; top: 0; left: 0; right: 60px; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
.vc-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
.vc-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; }
.vc-title { height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; flex: 1; }
.vc-badge { height: 16px; width: 40px; background: rgba(37,99,235,0.3); border-radius: 8px; }
.vc-rows { display: flex; flex-direction: column; gap: 0.5rem; }
.vc-row { display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 0.5rem; }
.vc-rank { width: 18px; height: 18px; background: rgba(255,255,255,0.08); border-radius: 5px; font-size: 0.6rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.vc-name { height: 7px; background: rgba(255,255,255,0.1); border-radius: 3px; flex: 1; }
.vc-val { width: 50px; height: 16px; background: rgba(22,163,74,0.2); border-radius: 6px; }
.vc-small { position: absolute; width: 140px; }
.vc-top { top: 20px; right: 0; }
.vc-bottom { bottom: 30px; right: 0; }
.vc-s-label { height: 7px; background: rgba(255,255,255,0.1); border-radius: 3px; width: 70%; margin-bottom: 0.5rem; }
.vc-s-val { height: 18px; background: rgba(255,255,255,0.15); border-radius: 4px; margin-bottom: 0.4rem; }
.vc-s-trend { font-size: 0.72rem; font-weight: 700; }
.vc-s-trend.up { color: #4ade80; }
.vc-s-trend.ok { color: #4ade80; }

/* ══ PRICING ══ */
.pricing { padding: 6rem 0; }
.pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 760px; margin: 0 auto; }
.pricing-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
.pricing-card.revealed { opacity: 1; transform: translateY(0); }
.pricing-card-pro { background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.3); position: relative; }
.plan-popular { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#2563eb,#7c3aed); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.28rem 1rem; border-radius: 20px; white-space: nowrap; }

.plan-name { font-size: 1.05rem; font-weight: 700; color: #f8fafc; display: block; margin-bottom: 0.6rem; }
.plan-price { display: flex; align-items: baseline; gap: 0.35rem; margin-bottom: 0.6rem; }
.plan-amount { font-size: 2rem; font-weight: 800; color: #f8fafc; }
.plan-currency { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
.plan-desc { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.6; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; flex: 1; }
.plan-features li { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: rgba(255,255,255,0.65); }
.pf-check { color: #4ade80; font-weight: 700; flex-shrink: 0; }
.plan-btn { padding: 0.7rem; border-radius: 10px; font-family: 'Sora',sans-serif; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; width: 100%; }
.plan-btn-ghost { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.12); }
.plan-btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
.plan-btn-primary { background: linear-gradient(135deg,#2563eb,#1d4ed8); color: #201c1c; border: none; box-shadow: 0 4px 16px rgba(37,99,235,0.4); }
.plan-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.5); }

/* ══ CTA ══ */
.cta-section { padding: 6rem 1.5rem; text-align: center; position: relative; overflow: hidden; }
.cta-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 1; opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
.cta-inner.revealed { opacity: 1; transform: translateY(0); }
.cta-orb { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(37,99,235,0.2), transparent); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; filter: blur(60px); }
.cta-inner h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #101214; line-height: 1.2; margin: 0.75rem 0; letter-spacing: -0.02em; }
.cta-inner p { color: rgba(255,255,255,0.5); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.7; }
.cta-actions { display: flex; align-items: center; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }

/* ══ FOOTER ══ */
.footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 2rem 1.5rem; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.footer-brand { display: flex; align-items: center; gap: 0.5rem; }
.footer-logo-name { font-weight: 800; font-size: 0.92rem; color: #fff; letter-spacing: 0.05em; }
.footer-copy { font-size: 0.78rem; color: rgba(255,255,255,0.3); }
.footer-links { display: flex; gap: 1.5rem; }
.footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
.footer-links a:hover { color: rgba(7, 7, 7, 0.8); }

/* ══ RESPONSIVE ══ */
@media (max-width: 900px) {
    .features-grid { grid-template-columns: repeat(2,1fr); }
    .showcase-content { grid-template-columns: 1fr; }
    .showcase-visual { display: none; }
    .pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
    .nav-links { display: none; }
    .nav-cta .btn-ghost { display: none; }
}
@media (max-width: 640px) {
    .features-grid { grid-template-columns: 1fr; }
    .hero { padding: 100px 1rem 60px; }
    .hero-stats { gap: 1rem; }
    .nav-cta { display: none; }
    .hamburger { display: flex; }
    .nav-links.open { display: flex; flex-direction: column; position: fixed; top: 64px; left: 0; right: 0; background: rgba(6,13,31,0.98); padding: 1.5rem; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .footer-inner { flex-direction: column; text-align: center; }
}
</style>