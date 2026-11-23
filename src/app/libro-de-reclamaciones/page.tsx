"use client";

import { ArrowLeft, Check, Download } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

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
      <SiteHeader />
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
                <button
                  className="button button--primary"
                  onClick={() =>
                    downloadReceipt([
                      ...receiptLines.slice(0, 3),
                      `Fecha y hora: ${submittedAt} (hora de Lima)`,
                      ...receiptLines.slice(3),
                    ])
                  }
                  type="button"
                >
                  <Download size={17} /> Descargar constancia
                </button>
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
                <fieldset className="record-options">
                  <legend className="sr-only">Tipo de registro</legend>
                  {(["Reclamo", "Queja"] as const).map((type) => (
                    <button
                      aria-pressed={recordType === type}
                      className={`record-option${recordType === type ? " is-selected" : ""}`}
                      key={type}
                      onClick={() => setRecordType(type)}
                      type="button"
                    >
                      <strong>{type}</strong>
                      <span>
                        {type === "Reclamo"
                          ? "Disconformidad relacionada con el servicio jurídico contratado"
                          : "Disconformidad o malestar con la atención al público"}
                      </span>
                    </button>
                  ))}
                </fieldset>
              </section>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>2. Identificación del consumidor</h2>
                  <p>Todos los campos son obligatorios.</p>
                </div>
                <div className="field-grid">
                  <label className="field">
                    <span>
                      Nombres y apellidos <b>*</b>
                    </span>
                    <input autoComplete="name" name="consumer-name" required />
                  </label>
                  <label className="field">
                    <span>
                      DNI / CE / Pasaporte <b>*</b>
                    </span>
                    <input name="consumer-document" required />
                  </label>
                  <label className="field field--full">
                    <span>
                      Domicilio <b>*</b>
                    </span>
                    <input
                      autoComplete="street-address"
                      name="address"
                      required
                    />
                  </label>
                  <label className="field">
                    <span>
                      Teléfono <b>*</b>
                    </span>
                    <input
                      autoComplete="tel"
                      inputMode="tel"
                      name="phone"
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
                      name="email"
                      required
                      type="email"
                    />
                  </label>
                  <label className="field field--full">
                    <span>
                      Presentas este registro como <b>*</b>
                    </span>
                    <select
                      onChange={(event) =>
                        setActingAs(event.target.value as ActingAs)
                      }
                      required
                      value={actingAs}
                    >
                      <option>Titular (consumidor)</option>
                      <option>Representante legal</option>
                      <option>Otros</option>
                    </select>
                  </label>
                  {needsQuality && (
                    <label className="field field--full">
                      <span>
                        Especifica la calidad con la que actúas <b>*</b>
                      </span>
                      <input name="quality" required />
                    </label>
                  )}
                  {needsRepresented && (
                    <>
                      <label className="field">
                        <span>
                          Nombre o razón social del representado <b>*</b>
                        </span>
                        <input name="represented-name" required />
                      </label>
                      <label className="field">
                        <span>
                          DNI / RUC del representado <b>*</b>
                        </span>
                        <input name="represented-document" required />
                      </label>
                    </>
                  )}
                </div>
              </section>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>3. Identificación del servicio contratado</h2>
                </div>
                <div className="field-grid">
                  <label className="field">
                    <span>Número de caso</span>
                    <input name="case-number" />
                  </label>
                  <label className="field">
                    <span>Abogado a cargo</span>
                    <input name="lawyer" />
                  </label>
                  <label className="field">
                    <span>
                      Servicio contratado <b>*</b>
                    </span>
                    <select defaultValue="" name="service" required>
                      <option disabled value="">
                        Selecciona un servicio
                      </option>
                      <option>Recuperación de Capital</option>
                      <option>Recuperación de Licencias</option>
                      <option>Derecho Corporativo</option>
                      <option>Otro</option>
                    </select>
                    <small>
                      Opciones provisionales, pendientes de confirmación.
                    </small>
                  </label>
                  <label className="field">
                    <span>Monto reclamado en S/</span>
                    <input
                      inputMode="decimal"
                      min="0"
                      name="amount"
                      step="0.01"
                      type="number"
                    />
                  </label>
                </div>
              </section>
              <section className="complaint-block">
                <div className="form-section-head">
                  <h2>
                    4. Detalle de la queja o reclamo y pedido del consumidor
                  </h2>
                </div>
                <div className="field-grid">
                  <label className="field field--full">
                    <span>
                      Detalle (hechos con fechas concretas) <b>*</b>
                    </span>
                    <textarea name="details" required rows={5} />
                  </label>
                  <label className="field field--full">
                    <span>
                      Pedido del consumidor <b>*</b>
                    </span>
                    <textarea name="request" required rows={4} />
                  </label>
                  <label className="field field--full">
                    <span>Documentos de sustento</span>
                    <input
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      multiple
                      name="documents"
                      onChange={handleFiles}
                      type="file"
                    />
                    <small>
                      Hasta 3 archivos PDF, JPG o PNG. Máximo 5 MB cada uno.{" "}
                      {files.length > 0 &&
                        `${files.length} archivo${files.length === 1 ? "" : "s"} seleccionado${files.length === 1 ? "" : "s"}.`}
                    </small>
                    {fileError && (
                      <span className="field-error" role="alert">
                        {fileError}
                      </span>
                    )}
                  </label>
                </div>
              </section>
              <div className="notice-box">
                <strong>Plazo de respuesta: máximo 15 días hábiles.</strong>
                <p>
                  La queja o el reclamo no impiden acudir a otras vías ni son
                  requisito previo para denunciar ante el INDECOPI.
                </p>
              </div>
              <div className="consents">
                <label className="check-row">
                  <input name="truth" required type="checkbox" />
                  <span>
                    Declaro que la información proporcionada es verdadera.{" "}
                    <b>*</b>
                  </span>
                </label>
                <label className="check-row">
                  <input name="personal-data" required type="checkbox" />
                  <span>
                    Acepto el tratamiento de mis datos personales para gestionar
                    este registro. <b>*</b>
                  </span>
                </label>
              </div>
              <div className="form-actions">
                <button className="button button--primary" type="submit">
                  Enviar registro
                </button>
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
