import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import {
  BalanceIllustration,
  SiteFooter,
  SiteHeader,
} from "@/components/site-chrome";

const reasons = [
  {
    title: "Atención personalizada",
    text: "Escuchamos tu situación y te acompañamos desde la primera consulta.",
  },
  {
    title: "Equipo especializado",
    text: "Profesionales con experiencia en distintas áreas del derecho.",
  },
  {
    title: "Enfoque en resultados",
    text: "Cada estrategia parte de tus objetivos y de un análisis cuidadoso del caso.",
  },
  {
    title: "Transparencia y seguimiento",
    text: "Conoces los avances, las alternativas y los siguientes pasos.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="hero-kicker">
                ESTUDIO JURÍDICO UBILLUS &amp; PARTNERS
              </p>
              <h1>Soluciones jurídicas con compromiso y claridad</h1>
              <p className="hero-lead">
                Cada situación merece ser escuchada y analizada con atención. Te
                orientamos con una estrategia jurídica clara, cercana y enfocada
                en proteger lo que importa.
              </p>
              <p className="hero-support">
                Desde la primera conversación, tendrás un equipo comprometido
                con entender tu caso y explicarte tus alternativas.
              </p>
              <ul className="hero-points">
                <li>
                  <span>
                    <Check size={15} strokeWidth={3} />
                  </span>
                  Atención personalizada desde la primera consulta
                </li>
                <li>
                  <span>
                    <Check size={15} strokeWidth={3} />
                  </span>
                  Estrategia jurídica clara y transparente
                </li>
                <li>
                  <span>
                    <Check size={15} strokeWidth={3} />
                  </span>
                  Seguimiento permanente de tu caso
                </li>
              </ul>
              <Link className="button button--accent" href="/evalua-tu-caso">
                Evalúa tu caso <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
            <div className="hero-art">
              <div className="hero-art-glow" />
              <BalanceIllustration />
            </div>
          </div>
        </section>
        <section className="reasons section-light">
          <div className="container">
            <div className="section-heading">
              <h2>Asesoría jurídica personalizada, enfocada en resultados</h2>
              <p>
                En el Estudio Jurídico Ubillus &amp; Partners trabajamos cada
                caso con dedicación, criterio y comunicación constante. Nuestro
                compromiso es ayudarte a avanzar con claridad.
              </p>
            </div>
            <div className="reason-grid">
              {reasons.map((reason, index) => (
                <article className="reason-item" key={reason.title}>
                  <span aria-hidden="true" className="reason-mark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </article>
              ))}
            </div>
            <div className="center-action">
              <Link className="button button--primary" href="/evalua-tu-caso">
                Evalúa tu caso <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section className="about" id="nosotros">
          <div className="container about-inner">
            <div className="about-intro">
              <p className="eyebrow">Estudio Jurídico Ubillus &amp; Partners</p>
              <h2>Una relación de confianza para defender tus intereses.</h2>
            </div>
            <article className="about-card about-card--mission">
              <h3>Misión</h3>
              <p>
                Brindar asesoría y representación jurídica con compromiso,
                excelencia y transparencia, defendiendo los derechos y el
                patrimonio de quienes confían en nosotros.
              </p>
            </article>
            <article className="about-card about-card--vision">
              <h3>Visión</h3>
              <p>
                Ser un estudio jurídico referente por la calidad de nuestro
                servicio, la confianza de nuestros clientes y nuestro aporte a
                una sociedad más justa.
              </p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
