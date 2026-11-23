import { BookOpenText, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContentMotion } from "@/components/content-motion";
import { SiteNavigation } from "@/components/site-navigation";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      aria-label="Estudio Jurídico Ubillus & Partners — Inicio"
      className={`brand${compact ? " brand--compact" : ""}`}
      href="/"
    >
      <Image
        alt=""
        className="brand-logo"
        height={70}
        loading={compact ? "lazy" : "eager"}
        src="/logo%20ubillus%20partners%20blanco/UBILLUS-PARTNERS-HORIZONTAL-BLANCO.svg"
        width={262}
      />
    </Link>
  );
}

export function SiteHeader({
  active = "inicio",
}: {
  active?: "inicio" | "evalua" | "none";
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <SiteNavigation active={active} />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <ContentMotion />
      <div className="container footer-grid" data-content-reveal="">
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
            <li className="footer-contact-item">
              <MapPin aria-hidden="true" />
              <span>
                Av. Circunvalación del Golf Los Incas 206, Torre 3, Oficina 806
                B, Santiago de Surco, Lima
              </span>
            </li>
            <li>
              <a
                className="footer-contact-item footer-contact-link"
                href="https://wa.me/51906532532"
              >
                <Phone aria-hidden="true" />
                <span>Teléfono / WhatsApp: 906 532 532</span>
              </a>
            </li>
            <li>
              <a
                className="footer-contact-item footer-contact-link"
                href="mailto:administracion@ubilluspartners.com"
              >
                <Mail aria-hidden="true" />
                <span>administracion@ubilluspartners.com</span>
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
                <BookOpenText aria-hidden="true" />
                <span>Libro de Reclamaciones</span>
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
