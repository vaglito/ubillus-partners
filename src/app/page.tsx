import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

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
              <div className="hero-actions">
                <Link className="button button--accent" href="/evalua-tu-caso">
                  Evalúa tu caso <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
                <a className="hero-whatsapp" href="https://wa.me/51906532532">
                  Habla por WhatsApp
                </a>
              </div>
            </div>
            <div aria-hidden="true" className="hero-art">
              <div className="hero-seal-frame">
                <Image
                  alt=""
                  className="hero-seal"
                  height={500}
                  loading="eager"
                  src="/logo%20ubillus%20partners%20blanco/UBILLUS-PARTNERS-SELLO-BLANCO.svg"
                  width={500}
                />
              </div>
            </div>
          </div>
          <div className="hero-proof">
            <ul className="container hero-points">
              <li>
                <span aria-hidden="true">
                  <Check size={15} strokeWidth={3} />
                </span>
                Atención personalizada desde la primera consulta
              </li>
              <li>
                <span aria-hidden="true">
                  <Check size={15} strokeWidth={3} />
                </span>
                Estrategia jurídica clara y transparente
              </li>
              <li>
                <span aria-hidden="true">
                  <Check size={15} strokeWidth={3} />
                </span>
                Seguimiento permanente de tu caso
              </li>
            </ul>
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
              {reasons.map((reason) => (
                <article className="reason-item" key={reason.title}>
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
        <section aria-labelledby="closing-title" className="closing-cta">
          <div className="container closing-inner">
            <div>
              <h2 id="closing-title">
                Cada caso empieza con una conversación clara.
              </h2>
              <p>
                Cuéntanos qué necesitas y conversemos sobre el siguiente paso.
              </p>
            </div>
            <div className="closing-actions">
              <a
                className="button button--primary"
                href="https://wa.me/51906532532"
              >
                Escribir por WhatsApp{" "}
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <Link href="/evalua-tu-caso">Evalúa tu caso</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
