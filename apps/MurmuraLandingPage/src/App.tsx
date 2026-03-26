import { useEffect, useMemo, useRef, useState } from 'react';
import { impactMetrics, problemData, workflowData } from './data/landing';
import { trackWaitlistSubmission } from './services/analytics';
import { submitWaitlist } from './services/waitlist';

function navigate(to: string) {
  if (window.location.pathname === to) {
    return;
  }

  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return pathname;
}

function BrandMark() {
  return (
    <svg viewBox="0 0 160 150" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <path
        d="M22 4 L138 4 Q156 4 156 22 L156 106 Q156 124 138 124 L44 124 L12 150 L30 124 L22 124 Q4 124 4 106 L4 22 Q4 4 22 4 Z"
        fill="url(#brandGradient)"
      />
      <path d="M26 54 C46 40,66 40,80 54 S118 68,130 54" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M26 72 C46 58,66 58,80 72 S118 86,130 72" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M26 90 C46 76,66 76,80 90 S118 104,130 90" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Counter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const start = performance.now();
          const duration = 900;

          const tick = (time: number) => {
            const progress = Math.min((time - start) / duration, 1);
            setDisplayValue(Math.round(value * progress));
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className="impact-number">{displayValue}</span>;
}

function OutcomePage({
  title,
  message,
  tone
}: {
  title: string;
  message: string;
  tone: 'success' | 'error';
}) {
  return (
    <div className="outcome-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="outcome-panel">
        <div className={tone === 'success' ? 'eyebrow outcome-badge success' : 'eyebrow outcome-badge error'}>
          {tone === 'success' ? 'Soumission enregistree' : 'Soumission en erreur'}
        </div>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="outcome-actions">
          <button type="button" className="button button-primary" onClick={() => navigate('/')}>
            Retour a la landing
          </button>
          <a className="button button-secondary" href="#waitlist" onClick={() => navigate('/')}>
            Retour au formulaire
          </a>
        </div>
      </section>
    </div>
  );
}

function LandingPage() {
  useReveal();

  const [activeProblemId, setActiveProblemId] = useState(problemData[0]?.id ?? '');
  const [activeWorkflowId, setActiveWorkflowId] = useState(workflowData[0]?.id ?? '');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const activeProblem = useMemo(
    () => problemData.find((item) => item.id === activeProblemId) ?? problemData[0],
    [activeProblemId]
  );
  const activeWorkflow = useMemo(
    () => workflowData.find((item) => item.id === activeWorkflowId) ?? workflowData[0],
    [activeWorkflowId]
  );

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState('submitting');
    setSubmitMessage(null);

    const payload = {
      email: email.trim(),
      organization: organization.trim()
    };

    try {
      await submitWaitlist(payload);
      trackWaitlistSubmission({
        status: 'success',
        ...payload
      });
      setSubmitState('success');
      setSubmitMessage('Inscription envoyee. La demande a ete ajoutee a la waitlist.');
      setEmail('');
      setOrganization('');
      navigate('/success');
    } catch (error) {
      const message = error instanceof Error ? error.message : "L'inscription a la waitlist a echoue.";
      trackWaitlistSubmission({
        status: 'error',
        ...payload,
        message
      });
      setSubmitState('error');
      setSubmitMessage(message);
      navigate('/error');
    }
  };

  return (
    <>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="page-shell">
        <header className="hero">
          <nav className="site-nav">
            <a className="brand" href="#top" aria-label="Murmura">
              <span className="brand-mark">
                <BrandMark />
              </span>
              <span className="brand-copy">
                <strong>Murmura</strong>
                <span>Messagerie relationnelle augmentee</span>
              </span>
            </a>

            <div className="nav-links">
              <a href="#probleme">Probleme</a>
              <a href="#solution">Solution</a>
              <a href="#fonctionnement">Fonctionnement</a>
              <a href="#impact">Impact</a>
              <a className="nav-waitlist" href="#waitlist">Waitlist</a>
            </div>
          </nav>

          <div id="top" className="hero-grid">
            <section className="hero-copy reveal">
              <div className="eyebrow">Infrastructure relationnelle</div>
              <h1>Murmura transforme chaque conversation en contexte exploitable.</h1>
              <p className="hero-lead">
                Une messagerie interne de reference, une memoire contextuelle durable, une lecture
                relationnelle de la situation, puis une action externe seulement quand elle est
                justifiee et gouvernee.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#solution">Explorer la solution</a>
                <a className="button button-secondary" href="#fonctionnement">Voir le fonctionnement</a>
                <a className="button button-tertiary" href="#waitlist">Rejoindre la waitlist</a>
              </div>

              <div className="hero-metrics">
                <article className="metric-card reveal">
                  <span className="metric-label">Centre de gravite</span>
                  <strong>Conversation interne Murmura</strong>
                </article>
                <article className="metric-card reveal">
                  <span className="metric-label">Actif principal</span>
                  <strong>Memoire relationnelle persistante</strong>
                </article>
                <article className="metric-card reveal">
                  <span className="metric-label">Execution externe</span>
                  <strong>Jumeau numerique sous controle</strong>
                </article>
              </div>
            </section>

            <aside className="hero-console reveal">
              <div className="console-topline">
                <span className="console-chip">Etat du systeme</span>
                <span className="console-status">Operationnel</span>
              </div>

              <div className="console-block">
                <div className="console-heading">Ce que Murmura fait</div>
                <p>
                  Murmura capte la conversation, reconstruit l'historique, qualifie la relation et
                  prepare la bonne action avant toute sortie vers un canal externe.
                </p>
              </div>

              <div className="console-signals">
                {[
                  ['Contexte', '94%'],
                  ['Memoire', '88%'],
                  ['Decision', '82%'],
                  ['Gouvernance', '91%']
                ].map(([label, width]) => (
                  <div key={label} className="signal">
                    <span>{label}</span>
                    <div className="signal-bar"><span style={{ width }} /></div>
                  </div>
                ))}
              </div>

              <div className="console-grid">
                {[
                  ['Messagerie', "Interne d'abord"],
                  ['IA', 'Contextualisee'],
                  ['Canaux externes', 'Secondaires'],
                  ['Action', 'Tracee']
                ].map(([label, value]) => (
                  <article key={label} className="console-panel">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </header>

        <main className="content">
          <section id="probleme" className="section">
            <div className="section-heading reveal">
              <span className="section-index">01</span>
              <div>
                <h2>Le probleme que Murmura traite</h2>
                <p>
                  La plupart des organisations gerent des relations critiques avec des outils qui savent
                  transporter des messages, mais pas conserver le sens, l'historique et les contraintes
                  de ces relations.
                </p>
              </div>
            </div>

            <div className="problem-layout">
              <div className="panel-tabs reveal" aria-label="Problemes cle">
                {problemData.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === activeProblemId ? 'tab-button active' : 'tab-button'}
                    onClick={() => setActiveProblemId(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <article className="dynamic-panel reveal">
                <div className="panel-kicker">Probleme structurel</div>
                <h3>{activeProblem?.title}</h3>
                <p>{activeProblem?.intro}</p>
                <ul className="panel-list">
                  {activeProblem?.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            </div>
          </section>

          <section id="solution" className="section">
            <div className="section-heading reveal">
              <span className="section-index">02</span>
              <div>
                <h2>Ce que Murmura apporte</h2>
                <p>
                  Murmura n'est pas une simple interface de chat. C'est une couche relationnelle qui
                  relie conversation, memoire, analyse, arbitrage et execution.
                </p>
              </div>
            </div>

            <div className="solution-grid">
              {[
                ['Base operationnelle', 'Messagerie interne de reference', "La relation se construit d'abord dans un espace Murmura central. Le canal externe n'impose plus seul le rythme ni la logique de decision."],
                ['Actif durable', 'Memoire contextuelle exploitable', 'Engagements, tensions, antecedents, signaux faibles, sujets sensibles et habitudes deviennent des donnees utiles au lieu de rester des souvenirs disperses.'],
                ['Decision', 'Analyse IA avec profondeur relationnelle', "L'IA ne travaille plus sur un message isole. Elle raisonne sur la trajectoire de la relation et aide a choisir la bonne posture, pas seulement la bonne formulation."],
                ['Pilotage', 'Vue relationnelle et priorisation', "Murmura expose la tension, l'urgence, les opportunites et les risques pour permettre un pilotage plus rigoureux des echanges sensibles."],
                ['Execution', 'Jumeau numerique sous gouvernance', "L'action externe passe par un niveau dedie: simulation, preparation, puis execution controlee seulement quand le contexte valide cette transition."],
                ['Architecture', 'Canaux externes ramenes au rang de sources', "Email, telephone et messageries tierces servent d'abord a nourrir le contexte. Ils ne sont plus le centre fonctionnel du systeme."]
              ].map(([kicker, title, body]) => (
                <article key={title} className="solution-card reveal">
                  <div className="solution-kicker">{kicker}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="fonctionnement" className="section">
            <div className="section-heading reveal">
              <span className="section-index">03</span>
              <div>
                <h2>Fonctionnement du systeme</h2>
                <p>
                  Murmura suit une chaine simple: initier, contextualiser, analyser, arbitrer, puis
                  agir. Chaque etape ajoute une couche de qualite et de controle.
                </p>
              </div>
            </div>

            <div className="workflow-layout">
              <div className="workflow-steps reveal" aria-label="Etapes du systeme">
                {workflowData.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === activeWorkflowId ? 'tab-button active' : 'tab-button'}
                    onClick={() => setActiveWorkflowId(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <article className="dynamic-panel workflow-panel reveal">
                <div className="panel-kicker">Etape cle</div>
                <h3>{activeWorkflow?.title}</h3>
                <p>{activeWorkflow?.body}</p>
                <div className="panel-note">{activeWorkflow?.note}</div>
              </article>
            </div>
          </section>

          <section id="impact" className="section">
            <div className="section-heading reveal">
              <span className="section-index">04</span>
              <div>
                <h2>Pourquoi cela compte</h2>
                <p>
                  Murmura resout un probleme de fond: l'incapacite des organisations a traiter la
                  relation comme un actif operationnel, memorise, pilotable et gouverne.
                </p>
              </div>
            </div>

            <div className="impact-grid">
              <article className="impact-overview reveal">
                <div className="eyebrow">Effets attendus</div>
                <div className="impact-overline">La relation devient un actif pilotable</div>
                <h3>Moins de perte de contexte. Plus de maitrise. Une meilleure qualite d'action.</h3>
                <p>
                  La valeur de Murmura vient d'une meilleure qualite de decision dans des environnements
                  ou les echanges ont des consequences durables.
                </p>

                <div className="impact-metrics impact-metrics-premium">
                  {impactMetrics.map((metric) => (
                    <div key={metric.caption} className="impact-metric featured">
                      <Counter value={metric.value} />
                      <span className="impact-caption">{metric.caption}</span>
                      <span className="impact-detail">{metric.detail}</span>
                    </div>
                  ))}
                </div>
              </article>

              <div className="impact-cases">
                {[
                  ['Directions et fondateurs', 'Pour piloter les relations a haute sensibilite avec plus de memoire, de discernement et de discipline.'],
                  ['Business, operations et account management', "Pour suivre les engagements, clarifier les risques et reduire l'improvisation dans les interactions recurrentes."],
                  ['Environnements IA sous contrainte', "Pour disposer d'une IA contextuelle et utile sans abandonner la gouvernance de l'action externe."]
                ].map(([title, body]) => (
                  <article key={title} className="impact-card reveal">
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="waitlist" className="section">
            <div className="waitlist-panel reveal">
              <div className="waitlist-copy">
                <div className="eyebrow">Acces anticipe</div>
                <h2>Rejoindre la waitlist Murmura</h2>
                <p>
                  Murmura s'adresse aux equipes qui veulent traiter la relation comme une infrastructure.
                  Rejoignez la waitlist pour suivre les prochaines ouvertures, demos privees et mises en
                  circulation du produit.
                </p>
              </div>

              <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
                <label className="waitlist-field">
                  <span>Email professionnel</span>
                  <input type="email" placeholder="vous@entreprise.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </label>
                <label className="waitlist-field">
                  <span>Organisation</span>
                  <input type="text" placeholder="Nom de votre structure" value={organization} onChange={(event) => setOrganization(event.target.value)} required />
                </label>
                <button type="submit" className="button button-primary waitlist-button" disabled={submitState === 'submitting'}>
                  {submitState === 'submitting' ? 'Envoi en cours...' : 'Rejoindre la waitlist'}
                </button>
                {submitMessage ? (
                  <div className={submitState === 'error' ? 'waitlist-feedback error' : 'waitlist-feedback success'}>
                    {submitMessage}
                  </div>
                ) : null}
              </form>
            </div>
          </section>

          <section className="section final-section">
            <div className="final-panel reveal">
              <div className="eyebrow">Synthese</div>
              <h2>Murmura fait passer la conversation du statut de flux a celui d'infrastructure.</h2>
              <p>
                Le produit donne aux organisations une base claire pour comprendre une relation, en
                conserver la memoire, raisonner avec contexte et agir avec plus de justesse.
              </p>
              <p>
                Le probleme resolu est structurel: trop de conversations importantes reposent encore sur
                des outils sans memoire relationnelle, sans lecture de situation et sans gouvernance de
                l'action. Murmura corrige exactement cela.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export function App() {
  const pathname = usePathname();

  if (pathname === '/success') {
    return (
      <OutcomePage
        tone="success"
        title="Votre demande a ete enregistree."
        message="La soumission waitlist a bien ete transmise. Vous pouvez revenir a la landing ou soumettre une nouvelle demande."
      />
    );
  }

  if (pathname === '/error') {
    return (
      <OutcomePage
        tone="error"
        title="La soumission n'a pas abouti."
        message="Le formulaire n'a pas pu etre transmis. Verifiez la configuration du endpoint waitlist ou reessayez depuis la page principale."
      />
    );
  }

  return <LandingPage />;
}
