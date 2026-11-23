import {
  ArrowUpRight,
  Check,
  Compass,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reasons = [
  {
    title: "Atención personalizada",
    text: "Escuchamos tu situación y te acompañamos desde la primera consulta.",
    icon: MessageSquareText,
  },
  {
    title: "Equipo especializado",
    text: "Profesionales con experiencia en distintas áreas del derecho.",
    icon: UsersRound,
  },
  {
    title: "Enfoque en resultados",
    text: "Cada estrategia parte de tus objetivos y de un análisis cuidadoso del caso.",
    icon: Target,
  },
  {
    title: "Transparencia y seguimiento",
    text: "Conoces los avances, las alternativas y los siguientes pasos.",
    icon: ListChecks,
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
          <div className="container reasons-layout">
            <div className="section-heading" data-content-reveal="">
              <h2>Asesoría jurídica personalizada, enfocada en resultados</h2>
              <p>
                En el Estudio Jurídico Ubillus &amp; Partners trabajamos cada
                caso con dedicación, criterio y comunicación constante. Nuestro
                compromiso es ayudarte a avanzar con claridad.
              </p>
            </div>
            <div className="reason-grid" data-content-reveal="">
              {reasons.map((reason) => (
                <Card className="reason-item" key={reason.title}>
                  <CardHeader>
                    <div aria-hidden="true" className="reason-icon">
                      <reason.icon />
                    </div>
                    <CardTitle>
                      <h3>{reason.title}</h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{reason.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="center-action" data-content-reveal="">
              <Link className="button button--primary" href="/evalua-tu-caso">
                Evalúa tu caso <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section aria-labelledby="about-title" className="about" id="nosotros">
          <div className="container about-inner" data-content-reveal="">
            <div className="about-intro">
              <h2 id="about-title">
                Una relación de <span>confianza</span> para defender tus
                intereses.
              </h2>
            </div>
            <Card className="about-card about-card--mission">
              <CardHeader>
                <div aria-hidden="true" className="about-icon">
                  <ShieldCheck />
                </div>
                <CardTitle>
                  <h3>Misión</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Brindar asesoría y representación jurídica con compromiso,
                  excelencia y transparencia, defendiendo los derechos y el
                  patrimonio de quienes confían en nosotros.
                </p>
              </CardContent>
            </Card>
            <Card className="about-card about-card--vision">
              <CardHeader>
                <div aria-hidden="true" className="about-icon">
                  <Compass />
                </div>
                <CardTitle>
                  <h3>Visión</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ser un estudio jurídico referente por la calidad de nuestro
                  servicio, la confianza de nuestros clientes y nuestro aporte a
                  una sociedad más justa.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section aria-labelledby="closing-title" className="closing-cta">
          <div className="container closing-inner" data-content-reveal="">
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
