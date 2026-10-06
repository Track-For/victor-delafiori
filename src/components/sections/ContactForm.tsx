"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight } from "lucide-react";
import { cloneElement, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { company, formOptions, uiCopy } from "@/data/company";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  company: z.string().min(2, "Informe o nome da marca."),
  website: z.string().min(2, "Informe o Instagram, site ou escreva 'não possui'."),
  industry: z.string().min(2, "Informe o segmento."),
  identityStatus: z.string().min(1, "Selecione uma opção."),
  service: z.string().min(1, "Selecione uma opção."),
  story: z.string().min(20, "Conte um pouco mais sobre a marca."),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido."),
  email: z.email("Informe um e-mail válido."),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const labels = uiCopy.form.fields;
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const url = createWhatsAppUrl(company.whatsapp, {
      name: data.name,
      company: data.company,
      service: data.service,
    });
    setSent(true);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const error = (name: keyof FormData) => errors[name]?.message;

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grid">
        <Field label={labels.name} error={error("name")}><input {...register("name")} autoComplete="name" /></Field>
        <Field label={labels.company} error={error("company")}><input {...register("company")} autoComplete="organization" /></Field>
        <Field label={labels.website} error={error("website")}><input {...register("website")} inputMode="url" /></Field>
        <Field label={labels.industry} error={error("industry")}><input {...register("industry")} /></Field>
      </div>
      <RadioGroup legend={labels.identityStatus} name="identityStatus" options={formOptions.identityStatus} register={register} error={error("identityStatus")} />
      <RadioGroup legend={labels.service} name="service" options={formOptions.services} register={register} error={error("service")} />
      <Field label={labels.story} error={error("story")}><textarea {...register("story")} rows={5} /></Field>
      <div className="form-grid">
        <Field label={labels.whatsapp} error={error("whatsapp")}><input {...register("whatsapp")} autoComplete="tel" inputMode="tel" /></Field>
        <Field label={labels.email} error={error("email")}><input {...register("email")} autoComplete="email" inputMode="email" /></Field>
      </div>
      <button className="form-submit" type="submit" disabled={isSubmitting} data-cursor="CONTACT">
        <span>{isSubmitting ? uiCopy.form.submitting : uiCopy.form.submit}</span>
        <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {sent ? uiCopy.form.success : ""}
      </p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactElement<{ "aria-invalid"?: boolean; "aria-describedby"?: string }>; }) {
  const id = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      {withFieldId(children, id, error)}
      {error ? <small id={`${id}-error`} role="alert">{error}</small> : null}
    </label>
  );
}

function withFieldId(child: React.ReactElement, id: string, error?: string) {
  return cloneElement(child, {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  } as React.HTMLAttributes<HTMLElement>);
}

function RadioGroup({ legend, name, options, register, error }: {
  legend: string;
  name: "identityStatus" | "service";
  options: readonly string[];
  register: ReturnType<typeof useForm<FormData>>["register"];
  error?: string;
}) {
  return (
    <fieldset className="radio-group" aria-describedby={error ? `${name}-error` : undefined}>
      <legend>{legend}</legend>
      <div>
        {options.map((option) => (
          <label key={option}>
            <input type="radio" value={option} {...register(name)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error ? <small id={`${name}-error`} role="alert">{error}</small> : null}
    </fieldset>
  );
}
