"use client";

import { useState } from "react";

export function QuoteForm({ numero }: { numero: string | null }) {
  const [ambiente, setAmbiente] = useState("");
  const [material, setMaterial] = useState("");
  const [medidas, setMedidas] = useState("");
  const [cidade, setCidade] = useState("");
  const [rascunho, setRascunho] = useState("");
  function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mensagem = `Olá, gostaria de pedir um orçamento. Ambiente: ${ambiente}. Material: ${material}. Medidas aproximadas: ${medidas}. Cidade: ${cidade}.`;
    if (!numero) { setRascunho(mensagem); return; }
    const base = numero ? `https://wa.me/${numero}` : "https://api.whatsapp.com/send";
    window.open(`${base}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener,noreferrer");
  }
  return <form onSubmit={enviar} className="quote-form">
    <label>Ambiente<input value={ambiente} onChange={(event) => setAmbiente(event.target.value)} required /></label>
    <label>Material de interesse<input value={material} onChange={(event) => setMaterial(event.target.value)} required /></label>
    <label>Medidas aproximadas<input value={medidas} onChange={(event) => setMedidas(event.target.value)} /></label>
    <label>Cidade<input value={cidade} onChange={(event) => setCidade(event.target.value)} required /></label>
    <button type="submit">{numero ? "Preparar mensagem no WhatsApp" : "Preparar rascunho do pedido"}</button>
    {rascunho && <div role="status"><p>Rascunho preparado. O WhatsApp aguarda confirmação; para falar com a JK, use o telefone.</p><p className="quote-draft">{rascunho}</p></div>}
  </form>;
}
