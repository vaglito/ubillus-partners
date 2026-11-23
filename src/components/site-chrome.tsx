import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      aria-label="Estudio Jurídico Ubillus & Partners — Inicio"
      className={`brand${compact ? " brand--compact" : ""}`}
      href="/"
    >
      <span aria-hidden="true" className="brand-mark">
        U
      </span>
      <span className="brand-copy">
        <span>ESTUDIO JURÍDICO</span>
        <strong>
          UBILLUS <i>&amp;</i> PARTNERS
        </strong>
      </span>
    </Link>
  );
}

export function SiteHeader({
  active = "inicio",
}: {
  active?: "inicio" | "evalua";
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav aria-label="Navegación principal" className="main-nav">
          <Link
            aria-current={active === "inicio" ? "page" : undefined}
            href="/"
          >
            Inicio
          </Link>
          <Link href="/#nosotros">Nosotros</Link>
          <Link
            className="button button--accent header-cta"
            href="/evalua-tu-caso"
          >
            Evalúa tu caso
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Brand compact />
          <p>
            Estudio jurídico comprometido con la defensa de tus derechos y tu
            patrimonio.
          </p>
        </div>
        <div>
          <h2>Navegación</h2>
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/#nosotros">Nosotros</Link>
            </li>
            <li>
              <Link href="/evalua-tu-caso">Evalúa tu caso</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Contacto</h2>
          <ul>
            <li>
              Av. Circunvalación del Golf Los Incas 206, Torre 3, Oficina 806 B,
              Santiago de Surco, Lima
            </li>
            <li>
              <a href="https://wa.me/51906532532">
                Teléfono / WhatsApp: 906 532 532
              </a>
            </li>
            <li>
              <a href="mailto:administracion@ubilluspartners.com">
                administracion@ubilluspartners.com
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul>
            <li>
              <Link
                className="footer-complaints"
                href="/libro-de-reclamaciones"
              >
                Libro de Reclamaciones
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Datos de la empresa</h2>
          <ul>
            <li>ESTUDIO UBILLUS &amp; PARTNERS S.A.C.</li>
            <li>RUC: 20611705311</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © 2026 ESTUDIO UBILLUS &amp; PARTNERS S.A.C. Todos los derechos
          reservados.
        </span>
        <span>Lima, Perú</span>
      </div>
    </footer>
  );
}

export function BalanceIllustration() {
  return (
    <svg
      aria-label="Balanza de la justicia"
      className="balance-illustration"
      role="img"
      viewBox="0 0 560 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pedestal" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#94D2CE" />
          <stop offset="1" stopColor="#4C9899" />
        </linearGradient>
        <linearGradient id="metal" x1="0" x2="1">
          <stop stopColor="#E7F1F0" />
          <stop offset=".52" stopColor="#93C9C6" />
          <stop offset="1" stopColor="#E7F1F0" />
        </linearGradient>
      </defs>
      <ellipse
        cx="281"
        cy="438"
        rx="178"
        ry="22"
        fill="#001D2E"
        opacity=".24"
      />
      <path d="M232 391h98l29 40H203z" fill="url(#pedestal)" />
      <path d="M248 374h66l17 17h-99z" fill="#D7ECE9" />
      <path d="M275 108h18v270h-18z" fill="url(#metal)" />
      <circle cx="284" cy="98" r="26" fill="#73BDB8" />
      <circle cx="284" cy="98" r="12" fill="#0B2B40" />
      <path
        d="M145 160h278"
        stroke="url(#metal)"
        strokeLinecap="round"
        strokeWidth="14"
      />
      <path
        d="M180 165 142 296m38-131 39 131m162-131-39 131m39-131 39 131"
        fill="none"
        stroke="#A8D9D4"
        strokeWidth="5"
      />
      <path
        d="M95 300c12 41 45 64 85 64s73-23 85-64H95Zm198 0c12 41 45 64 85 64s73-23 85-64H293Z"
        fill="url(#pedestal)"
        stroke="#B7E1DD"
        strokeWidth="4"
      />
      <path
        d="M113 300h136m62 0h136"
        stroke="#E4F2EF"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="m105 89 18-29m327 53-19-30"
        stroke="#73BDB8"
        strokeLinecap="round"
        strokeWidth="4"
        opacity=".8"
      />
      <circle cx="123" cy="59" r="6" fill="#73BDB8" />
      <circle cx="431" cy="81" r="5" fill="#73BDB8" />
      <path
        d="M89 194h19m344-52h19M152 403h18m227-9h18"
        stroke="#73BDB8"
        strokeLinecap="round"
        strokeWidth="4"
        opacity=".55"
      />
    </svg>
  );
}
