"use client";

import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function EvaluateCasePage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 450);
  }

  return (
    <>
      <SiteHeader active="evalua" />
      <main className="form-page">
        <div className="container form-container">
          <Link className="back-link" href="/">
            <ArrowLeft size={17} /> Volver al inicio
          </Link>
          <div className="form-heading">
            <h1>Evalúa tu caso</h1>
            <p>
              Cuéntanos cómo podemos ayudarte. Revisaremos la información y nos
              pondremos en contacto contigo.
            </p>
          </div>
          {sent ? (
            <section aria-live="polite" className="confirmation-card">
              <span className="confirmation-icon">
                <Check size={27} strokeWidth={2.5} />
              </span>
              <h2>Hemos recibido tu consulta</h2>
              <p>
                Gracias por compartir tu caso. En breve nos comunicaremos
                contigo para orientarte.
              </p>
              <p className="prototype-note">
                Este prototipo muestra la confirmación; no envía correos ni
                almacena datos.
              </p>
              <Link className="button button--secondary" href="/">
                Volver al inicio
              </Link>
            </section>
          ) : (
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="form-section-head">
                <h2>Cuéntanos sobre ti</h2>
                <p>Todos los campos son obligatorios.</p>
              </div>
              <div className="field-grid">
                <label className="field">
                  <span>
                    Nombres y apellidos <b>*</b>
                  </span>
                  <input autoComplete="name" name="nombre" required />
                </label>
                <label className="field">
                  <span>
                    DNI / RUC <b>*</b>
                  </span>
                  <input autoComplete="off" name="documento" required />
                </label>
                <label className="field">
                  <span>
                    Teléfono / WhatsApp <b>*</b>
                  </span>
                  <input
                    autoComplete="tel"
                    inputMode="tel"
                    name="telefono"
                    pattern="[+0-9 ()-]{7,18}"
                    required
                    title="Ingresa un número de teléfono válido."
                    type="tel"
                  />
                </label>
                <label className="field">
                  <span>
                    Correo electrónico <b>*</b>
                  </span>
                  <input
                    autoComplete="email"
                    name="correo"
                    required
                    type="email"
                  />
                </label>
                <label className="field field--full">
                  <span>
                    Área de tu consulta <b>*</b>
                  </span>
                  <select defaultValue="" name="area" required>
                    <option disabled value="">
                      Selecciona un área
                    </option>
                    <option>Civil</option>
                    <option>Penal</option>
                    <option>Laboral</option>
                    <option>Familia</option>
                    <option>Comercial y societario</option>
                    <option>Otro</option>
                  </select>
                </label>
                <label className="field field--full">
                  <span>
                    Cuéntanos tu caso <b>*</b>
                  </span>
                  <textarea name="caso" required rows={5} />
                </label>
              </div>
              <label className="check-row">
                <input name="datos" required type="checkbox" />
                <span>
                  Acepto el tratamiento de mis datos personales para la atención
                  de esta consulta. <b>*</b>
                </span>
              </label>
              <div className="form-actions">
                <button
                  className="button button--primary"
                  disabled={sending}
                  type="submit"
                >
                  {sending ? "Enviando…" : "Enviar consulta"}
                </button>
                <span className="required-hint">* Campos obligatorios</span>
              </div>
              <p className="prototype-disclaimer">
                Prototipo: el envío se simula en esta pantalla. Para recibir
                consultas se requiere conectar un servicio de correo.
              </p>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
