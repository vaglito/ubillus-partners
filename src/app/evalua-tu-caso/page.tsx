"use client";

import { ArrowLeft, Check, MessageSquareText, UserRound } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { FormField } from "@/components/form-field";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

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
            <span aria-hidden="true" className="form-heading-icon">
              <MessageSquareText />
            </span>
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
                <h2>
                  <UserRound aria-hidden="true" />
                  Cuéntanos sobre ti
                </h2>
                <p>Todos los campos son obligatorios.</p>
              </div>
              <FieldGroup className="field-grid">
                <FormField id="nombre" label="Nombres y apellidos" required>
                  <Input
                    autoComplete="name"
                    id="nombre"
                    name="nombre"
                    required
                  />
                </FormField>
                <FormField id="documento" label="DNI / RUC" required>
                  <Input
                    autoComplete="off"
                    id="documento"
                    name="documento"
                    required
                  />
                </FormField>
                <FormField id="telefono" label="Teléfono / WhatsApp" required>
                  <Input
                    autoComplete="tel"
                    id="telefono"
                    inputMode="tel"
                    name="telefono"
                    pattern="[+0-9 ()-]{7,18}"
                    required
                    title="Ingresa un número de teléfono válido."
                    type="tel"
                  />
                </FormField>
                <FormField id="correo" label="Correo electrónico" required>
                  <Input
                    autoComplete="email"
                    id="correo"
                    name="correo"
                    required
                    type="email"
                  />
                </FormField>
                <FormField id="area" label="Área de tu consulta" required full>
                  <NativeSelect defaultValue="" id="area" name="area" required>
                    <NativeSelectOption disabled value="">
                      Selecciona un área
                    </NativeSelectOption>
                    {[
                      "Civil",
                      "Penal",
                      "Laboral",
                      "Familia",
                      "Comercial y societario",
                      "Otro",
                    ].map((area) => (
                      <NativeSelectOption key={area}>{area}</NativeSelectOption>
                    ))}
                  </NativeSelect>
                </FormField>
                <FormField id="caso" label="Cuéntanos tu caso" required full>
                  <Textarea id="caso" name="caso" required rows={5} />
                </FormField>
              </FieldGroup>
              <Field className="check-row" orientation="horizontal">
                <Checkbox id="datos" name="datos" required />
                <FieldLabel htmlFor="datos">
                  Acepto el tratamiento de mis datos personales para la atención
                  de esta consulta. <b aria-hidden="true">*</b>
                </FieldLabel>
              </Field>
              <div className="form-actions">
                <Button disabled={sending} type="submit">
                  {sending ? "Enviando…" : "Enviar consulta"}
                </Button>
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
