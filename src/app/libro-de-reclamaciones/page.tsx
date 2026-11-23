"use client";

import { ArrowLeft, Check, Download } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { FormField } from "@/components/form-field";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type RecordType = "Reclamo" | "Queja";
type ActingAs = "Titular (consumidor)" | "Representante legal" | "Otros";

const todayInLima = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Lima",
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${values.day}/${values.month}/${values.year}`;
};

function pdfEscape(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function downloadReceipt(lines: string[]) {
  const wrappedLines = lines.flatMap((line) => {
    const words = pdfEscape(line).split(/\s+/);
    const result: string[] = [];
    let current = "";
    for (const word of words) {
      if (current && `${current} ${word}`.length > 82) {
        result.push(current);
        current = word;
      } else {
        current = current ? `${current} ${word}` : word;
      }
    }
    if (current) result.push(current);
    return result;
  });
  const pageLines = Array.from(
    { length: Math.ceil(wrappedLines.length / 50) },
    (_, index) => wrappedLines.slice(index * 50, (index + 1) * 50),
  );
  const pageObjectIds = pageLines.map((_, index) => 4 + index * 2);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageLines.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  for (const [index, page] of pageLines.entries()) {
    const content = [
      "BT",
      "/F1 10 Tf",
      "52 790 Td",
      ...page.flatMap((line, lineIndex) =>
        lineIndex ? ["0 -14 Td", `(${line}) Tj`] : [`(${line}) Tj`],
      ),
      "ET",
    ].join("\n");
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pageObjectIds[index] + 1} 0 R >>`,
    );
    objects.push(
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    );
  }
  let document = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1))
    document += `${String(offset).padStart(10, "0")} 00000 n \n`;
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(
    new Blob([document], { type: "application/pdf" }),
  );
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = "constancia-libro-de-reclamaciones.pdf";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ComplaintsPage() {
  const [recordType, setRecordType] = useState<RecordType>("Reclamo");
  const [actingAs, setActingAs] = useState<ActingAs>("Titular (consumidor)");
  const [sent, setSent] = useState(false);
  const [fileError, setFileError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submittedAt, setSubmittedAt] = useState("");
  const [receiptLines, setReceiptLines] = useState<string[]>([]);
  const recordNumber = "000000001-2026";
  const [date, setDate] = useState("");
  const needsRepresented = actingAs !== "Titular (consumidor)";
  const needsQuality = actingAs === "Otros";

  useEffect(() => {
    setDate(todayInLima());
  }, []);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.currentTarget.files ?? []);
    const accepted = selected.every(
      (file) =>
        ["application/pdf", "image/jpeg", "image/png"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024,
    );
    if (selected.length > 3) {
      event.currentTarget.value = "";
      setFiles([]);
      setFileError("Puedes adjuntar hasta 3 archivos. Se limpió la selección.");
      return;
    }
    if (!accepted) {
      event.currentTarget.value = "";
      setFiles([]);
      setFileError("Adjunta archivos PDF, JPG o PNG de hasta 5 MB cada uno.");
      return;
    }
    setFiles(selected);
    setFileError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const formData = new FormData(event.currentTarget);
    setSubmittedAt(
      new Intl.DateTimeFormat("es-PE", {
        dateStyle: "short",
        timeStyle: "short",
        hour12: true,
        timeZone: "America/Lima",
      }).format(new Date()),
    );
    setReceiptLines([
      "ESTUDIO JURIDICO UBILLUS & PARTNERS",
      `Libro de Reclamaciones — ${recordType}`,
      `Numero de registro: ${recordNumber}`,
      `Fecha: ${date}`,
      `Razon social: ESTUDIO UBILLUS & PARTNERS S.A.C. | RUC: 20611705311`,
      "Direccion: Av. Circunvalacion del Golf Los Incas 206, Torre 3, Oficina 806 B, Santiago de Surco, Lima",
      `Nombres y apellidos: ${String(formData.get("consumer-name") ?? "")}`,
      `Documento: ${String(formData.get("consumer-document") ?? "")}`,
      `Domicilio: ${String(formData.get("address") ?? "")}`,
      `Telefono: ${String(formData.get("phone") ?? "")}`,
      `Correo: ${String(formData.get("email") ?? "")}`,
      `Presenta como: ${actingAs}`,
      `Representado: ${String(formData.get("represented-name") ?? "—")}`,
      `Documento del representado: ${String(formData.get("represented-document") ?? "—")}`,
      `Servicio: ${String(formData.get("service") ?? "")}`,
      `Numero de caso: ${String(formData.get("case-number") ?? "—")}`,
      `Abogado a cargo: ${String(formData.get("lawyer") ?? "—")}`,
      `Monto reclamado: ${String(formData.get("amount") ?? "—")} S/`,
      `Detalle: ${String(formData.get("details") ?? "")}`,
      `Pedido: ${String(formData.get("request") ?? "")}`,
      `Documentos adjuntos: ${files.map(({ name }) => name).join(", ") || "Ninguno"}`,
      "Esta constancia corresponde a un registro de demostracion.",
    ]);
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <SiteHeader active="none" />
      <main className="form-page">
        <div className="container form-container complaint-container">
          <Link className="back-link" href="/">
            <ArrowLeft size={17} /> Volver al inicio
          </Link>
          <div className="form-heading">
            <h1>Libro de Reclamaciones</h1>
            <p>
              Registra aquí tu queja o reclamo sobre nuestros servicios.
              Recibirás una copia de la hoja de registro en tu correo.
            </p>
          </div>
          {sent ? (
            <section aria-live="polite" className="confirmation-card">
              <span className="confirmation-icon">
                <Check size={28} strokeWidth={2.5} />
              </span>
              <p className="record-label">N.° DE {recordType.toUpperCase()}</p>
              <div className="record-number">{recordNumber}</div>
              <h2>
                Tu {recordType.toLowerCase()} fue{" "}
                {recordType === "Queja" ? "registrada" : "registrado"}
              </h2>
              <p>
                Hemos recibido tu {recordType.toLowerCase()} correctamente.
                Nuestro equipo{" "}
                {recordType === "Queja" ? "la evaluará" : "lo evaluará"} y te
                responderá en un plazo no mayor a 15 días hábiles.
              </p>
              <p className="record-date">
                Registrado el {submittedAt} (hora de Lima)
              </p>
              <p className="receipt-note">
                Enviamos una copia de la constancia a tu correo.
              </p>
              {recordType === "Queja" && (
                <Button
                  onClick={() =>
                    downloadReceipt([
                      ...receiptLines.slice(0, 3),
                      `Fecha y hora: ${submittedAt} (hora de Lima)`,
                      ...receiptLines.slice(3),
                    ])
                  }
                  type="button"
                >
                  <Download data-icon="inline-start" /> Descargar constancia
                </Button>
              )}
              <Link
                className="button button--secondary confirmation-home"
                href="/"
              >
                Volver al inicio
              </Link>
              <p className="prototype-note">
                Demostración: el número es fijo y no se envían correos ni se
                conserva el registro.
              </p>
            </section>
          ) : (
            <form className="form-card complaint-form" onSubmit={handleSubmit}>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>Datos del establecimiento</h2>
                </div>
                <div className="establishment-grid">
                  <div>
                    <span>Razón social</span>
                    <strong>ESTUDIO UBILLUS &amp; PARTNERS S.A.C.</strong>
                  </div>
                  <div>
                    <span>RUC</span>
                    <strong>20611705311</strong>
                  </div>
                  <div>
                    <span>Fecha</span>
                    <strong>{date || "—"}</strong>
                  </div>
                  <div className="establishment-address">
                    <span>Dirección</span>
                    <strong>
                      Av. Circunvalación del Golf Los Incas 206, Torre 3,
                      Oficina 806 B, Santiago de Surco, Lima
                    </strong>
                  </div>
                </div>
              </section>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>1. Tipo de registro</h2>
                </div>
                <FieldSet>
                  <FieldLegend className="sr-only">
                    Tipo de registro
                  </FieldLegend>
                  <ToggleGroup
                    className="record-options"
                    value={[recordType]}
                    onValueChange={(value) => {
                      if (value[0]) setRecordType(value[0] as RecordType);
                    }}
                  >
                    {(["Reclamo", "Queja"] as const).map((type) => (
                      <ToggleGroupItem
                        className="record-option"
                        key={type}
                        value={type}
                      >
                        <strong>{type}</strong>
                        <span>
                          {type === "Reclamo"
                            ? "Disconformidad relacionada con el servicio jurídico contratado"
                            : "Disconformidad o malestar con la atención al público"}
                        </span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FieldSet>
              </section>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>2. Identificación del consumidor</h2>
                  <p>Todos los campos son obligatorios.</p>
                </div>
                <FieldGroup className="field-grid">
                  <FormField
                    id="consumer-name"
                    label="Nombres y apellidos"
                    required
                  >
                    <Input
                      autoComplete="name"
                      id="consumer-name"
                      name="consumer-name"
                      required
                    />
                  </FormField>
                  <FormField
                    id="consumer-document"
                    label="DNI / CE / Pasaporte"
                    required
                  >
                    <Input
                      id="consumer-document"
                      name="consumer-document"
                      required
                    />
                  </FormField>
                  <FormField id="address" label="Domicilio" required full>
                    <Input
                      autoComplete="street-address"
                      id="address"
                      name="address"
                      required
                    />
                  </FormField>
                  <FormField id="phone" label="Teléfono" required>
                    <Input
                      autoComplete="tel"
                      id="phone"
                      inputMode="tel"
                      name="phone"
                      pattern="[+0-9 ()-]{7,18}"
                      required
                      title="Ingresa un número de teléfono válido."
                      type="tel"
                    />
                  </FormField>
                  <FormField id="email" label="Correo electrónico" required>
                    <Input
                      autoComplete="email"
                      id="email"
                      name="email"
                      required
                      type="email"
                    />
                  </FormField>
                  <FormField
                    id="acting-as"
                    label="Presentas este registro como"
                    required
                    full
                  >
                    <NativeSelect
                      id="acting-as"
                      onChange={(event) =>
                        setActingAs(event.target.value as ActingAs)
                      }
                      required
                      value={actingAs}
                    >
                      <NativeSelectOption>
                        Titular (consumidor)
                      </NativeSelectOption>
                      <NativeSelectOption>
                        Representante legal
                      </NativeSelectOption>
                      <NativeSelectOption>Otros</NativeSelectOption>
                    </NativeSelect>
                  </FormField>
                  {needsQuality && (
                    <FormField
                      id="quality"
                      label="Especifica la calidad con la que actúas"
                      required
                      full
                    >
                      <Input id="quality" name="quality" required />
                    </FormField>
                  )}
                  {needsRepresented && (
                    <>
                      <FormField
                        id="represented-name"
                        label="Nombre o razón social del representado"
                        required
                      >
                        <Input
                          id="represented-name"
                          name="represented-name"
                          required
                        />
                      </FormField>
                      <FormField
                        id="represented-document"
                        label="DNI / RUC del representado"
                        required
                      >
                        <Input
                          id="represented-document"
                          name="represented-document"
                          required
                        />
                      </FormField>
                    </>
                  )}
                </FieldGroup>
              </section>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>3. Identificación del servicio contratado</h2>
                </div>
                <FieldGroup className="field-grid">
                  <FormField id="case-number" label="Número de caso">
                    <Input id="case-number" name="case-number" />
                  </FormField>
                  <FormField id="lawyer" label="Abogado a cargo">
                    <Input id="lawyer" name="lawyer" />
                  </FormField>
                  <FormField
                    id="service"
                    label="Servicio contratado"
                    required
                    description="Opciones provisionales, pendientes de confirmación."
                  >
                    <NativeSelect
                      defaultValue=""
                      id="service"
                      name="service"
                      required
                    >
                      <NativeSelectOption disabled value="">
                        Selecciona un servicio
                      </NativeSelectOption>
                      {[
                        "Recuperación de Capital",
                        "Recuperación de Licencias",
                        "Derecho Corporativo",
                        "Otro",
                      ].map((service) => (
                        <NativeSelectOption key={service}>
                          {service}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </FormField>
                  <FormField id="amount" label="Monto reclamado en S/">
                    <Input
                      id="amount"
                      inputMode="decimal"
                      min="0"
                      name="amount"
                      step="0.01"
                      type="number"
                    />
                  </FormField>
                </FieldGroup>
              </section>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>
                    4. Detalle de la queja o reclamo y pedido del consumidor
                  </h2>
                </div>
                <FieldGroup className="field-grid">
                  <FormField
                    id="details"
                    label="Detalle (hechos con fechas concretas)"
                    required
                    full
                  >
                    <Textarea id="details" name="details" required rows={5} />
                  </FormField>
                  <FormField
                    id="request"
                    label="Pedido del consumidor"
                    required
                    full
                  >
                    <Textarea id="request" name="request" required rows={4} />
                  </FormField>
                  <FormField
                    id="documents"
                    label="Documentos de sustento"
                    full
                    invalid={Boolean(fileError)}
                  >
                    <Input
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      aria-invalid={Boolean(fileError)}
                      id="documents"
                      multiple
                      name="documents"
                      onChange={handleFiles}
                      type="file"
                    />
                    <FieldDescription>
                      Hasta 3 archivos PDF, JPG o PNG. Máximo 5 MB cada uno.{" "}
                      {files.length > 0 &&
                        `${files.length} archivo${files.length === 1 ? "" : "s"} seleccionado${files.length === 1 ? "" : "s"}.`}
                    </FieldDescription>
                    {fileError && <FieldError>{fileError}</FieldError>}
                  </FormField>
                </FieldGroup>
              </section>
              <div className="notice-box">
                <strong>Plazo de respuesta: máximo 15 días hábiles.</strong>
                <p>
                  La queja o el reclamo no impiden acudir a otras vías ni son
                  requisito previo para denunciar ante el INDECOPI.
                </p>
              </div>
              <FieldSet className="consents">
                <FieldLegend className="sr-only">
                  Declaraciones obligatorias
                </FieldLegend>
                <Field className="check-row" orientation="horizontal">
                  <Checkbox id="truth" name="truth" required />
                  <FieldLabel htmlFor="truth">
                    Declaro que la información proporcionada es verdadera.{" "}
                    <b aria-hidden="true">*</b>
                  </FieldLabel>
                </Field>
                <Field className="check-row" orientation="horizontal">
                  <Checkbox id="personal-data" name="personal-data" required />
                  <FieldLabel htmlFor="personal-data">
                    Acepto el tratamiento de mis datos personales para gestionar
                    este registro. <b aria-hidden="true">*</b>
                  </FieldLabel>
                </Field>
              </FieldSet>
              <div className="form-actions">
                <Button type="submit">Enviar registro</Button>
                <span className="required-hint">* Campos obligatorios</span>
              </div>
              <p className="prototype-disclaimer">
                Prototipo: el registro, el correlativo y los correos se simulan.
                No ingreses datos reales.
              </p>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
