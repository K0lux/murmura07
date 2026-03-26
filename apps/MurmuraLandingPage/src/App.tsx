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
                <span>Messagerie privee augmentee</span>
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
              <div className="eyebrow">Conversation privee, contexte durable</div>
              <h1>Murmura est une messagerie privee qui se souvient de ce qui compte.</h1>
              <p className="hero-lead">
                Pour la vie personnelle comme pour le travail, Murmura aide a proteger la conversation,
                conserver la memoire de la relation, comprendre la situation et n utiliser un autre canal
                que lorsque cela devient vraiment utile.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#solution">Explorer la solution</a>
                <a className="button button-secondary" href="#fonctionnement">Voir le fonctionnement</a>
                <a className="button button-tertiary" href="#waitlist">Rejoindre la waitlist</a>
              </div>

              <div className="hero-metrics">
                <article className="metric-card reveal">
                  <span className="metric-label">Valeur centrale</span>
                  <strong>Conversation privee de reference</strong>
                </article>
                <article className="metric-card reveal">
                  <span className="metric-label">Ce que Murmura preserve</span>
                  <strong>Memoire relationnelle durable</strong>
                </article>
                <article className="metric-card reveal">
                  <span className="metric-label">Extension optionnelle</span>
                  <strong>Action externe sous controle</strong>
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
                  Murmura remet la conversation privee au centre, conserve le contexte relationnel
                  et aide a mieux repondre avant toute sortie vers un autre canal.
                </p>
              </div>

              <div className="console-signals">
                {[
                  ['Contexte', '94%'],
                  ['Memoire', '91%'],
                  ['Nuance', '86%'],
                  ['Protection', '89%']
                ].map(([label, width]) => (
                  <div key={label} className="signal">
                    <span>{label}</span>
                    <div className="signal-bar"><span style={{ width }} /></div>
                  </div>
                ))}
              </div>

              <div className="console-grid">
                {[
                  ['Messagerie', 'Privee'],
                  ['IA', 'Contextualisee'],
                  ['Usage', 'Personnel ou pro'],
                  ['Canaux externes', 'Secondaires']
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
                  Les messageries actuelles sont excellentes pour envoyer vite. Elles sont beaucoup moins
                  bonnes pour proteger une conversation privee, conserver sa memoire et aider a bien agir
                  dans la duree.
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
                  Murmura reste une messagerie simple a utiliser, mais elle ajoute ce qui manque aux outils
                  classiques: memoire, contexte, intelligence relationnelle et controle.
                </p>
              </div>
            </div>

            <div className="solution-grid">
              {[
                ['Base', 'Une vraie conversation privee de reference', "La relation se construit d'abord dans Murmura. La conversation retrouve un centre stable au lieu d'etre dispersee entre plusieurs applications."],
                ['Memoire', 'Une memoire relationnelle utile', 'Promesses, sensibilites, habitudes, antecedents et sujets delicats restent disponibles pour mieux comprendre chaque nouvel echange.'],
                ['IA', 'Une assistance qui comprend la relation', "L'IA ne se limite pas a reformuler. Elle aide a lire la situation, le ton, le risque et la bonne posture dans le temps."],
                ['Usage', 'Un produit pour la vie perso comme pour le travail', "Murmura peut servir a proteger une relation intime, familiale, amicale ou professionnelle. Le coeur reste le meme: mieux converser en prive."],
                ['Action', 'Un jumeau numerique seulement quand il faut', "Si un email, un appel ou un autre canal est necessaire, Murmura peut le preparer sans faire sortir la conversation du cadre de decision."],
                ['Architecture', 'Les autres canaux restent autour, pas au centre', "Email, telephone et services tiers servent a nourrir le contexte ou a executer une action. Ils ne definissent plus seuls la relation."]
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
                  Murmura suit une logique simple: converser, se souvenir, comprendre, puis agir si
                  necessaire. Cette chaine fonctionne autant pour un usage personnel que professionnel.
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
                  Murmura traite un probleme quotidien: nous avons tous des conversations importantes,
                  mais presque aucun outil ne nous aide a les garder privees, coherentes et intelligentes
                  dans la duree.
                </p>
              </div>
            </div>

            <div className="impact-grid">
              <article className="impact-overview reveal">
                <div className="eyebrow">Effets attendus</div>
                <div className="impact-overline">La conversation privee gagne en qualite</div>
                <h3>Moins d oubli. Plus de nuance. Une relation mieux protegee dans le temps.</h3>
                <p>
                  La valeur de Murmura vient d une meilleure qualite de conversation, d une memoire plus
                  fiable et d une aide plus juste au moment de repondre ou d agir.
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
                  ['Usage personnel', 'Pour mieux proteger des conversations intimes, familiales, sensibles ou emotionnellement chargees.'],
                  ['Usage professionnel', 'Pour suivre une relation client, partenaire, candidat ou collegue avec plus de memoire et moins d improvisation.'],
                  ['Usage assiste par IA', "Pour beneficier d'une aide contextuelle sans laisser l'automatisation prendre le controle de la relation."]
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
                  Murmura s adresse a toutes les personnes qui veulent une meilleure messagerie privee,
                  ainsi qu aux equipes qui gerent des relations importantes. Rejoignez la waitlist pour
                  suivre les prochaines ouvertures et demonstrations du produit.
                </p>
              </div>

              <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
                <label className="waitlist-field">
                  <span>Email</span>
                  <input type="email" placeholder="vous@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </label>
                <label className="waitlist-field">
                  <span>Organisation ou contexte d usage</span>
                  <input type="text" placeholder="Personnel, equipe, entreprise..." value={organization} onChange={(event) => setOrganization(event.target.value)} required />
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
              <h2>Murmura remet la conversation privee au centre et lui redonne de la memoire.</h2>
              <p>
                Le produit donne aux personnes et aux equipes une base claire pour converser, se souvenir,
                comprendre une relation et agir avec plus de justesse.
              </p>
              <p>
                Le probleme resolu est simple a comprendre: trop de conversations importantes reposent
                encore sur des outils qui transportent des messages, mais ne protegent ni la memoire,
                ni la nuance, ni la qualite de la relation. Murmura corrige exactement cela.
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
