"use client";

import { useState } from "react";

export default function HomePage() {
  const [name, setName] = useState("");
  const [hasCompanion, setHasCompanion] = useState(false);
  const [companionPartner, setCompanionPartner] = useState(false);
  const [companionChildren, setCompanionChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState<number | "">("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      name,
      hasCompanion,
      companionPartner,
      companionChildren,
      childrenCount: companionChildren ? Number(childrenCount || 0) : 0,
    };

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alert("Erro ao salvar. Tente novamente.");
      return;
    }

    alert("Salvo. Nos vemos lá!");
  };

  const resetCompanions = (checked: boolean) => {
    setHasCompanion(checked);
    if (!checked) {
      setCompanionPartner(false);
      setCompanionChildren(false);
      setChildrenCount("");
    }
  };

  const handleChildrenToggle = (checked: boolean) => {
    setCompanionChildren(checked);
    if (!checked) {
      setChildrenCount("");
    }
  };

  return (
    <main
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    backgroundColor: "#ffffff",
    backgroundImage: "url('/myphoto.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left bottom",
    backgroundSize: "550px auto", 
  }}
>

      <div
        style={{
          background: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ marginBottom: "16px", textAlign: "center" }}>
          Confirmação de Presença
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>
              <input
                type="checkbox"
                checked={hasCompanion}
                onChange={(e) => resetCompanions(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Vou levar acompanhante
            </label>
          </div>

          {hasCompanion && (
            <div
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <p style={{ marginTop: 0 }}>Quem vai com você?</p>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>
                  <input
                    type="checkbox"
                    checked={companionPartner}
                    onChange={(e) => setCompanionPartner(e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  Conge
                </label>

                <label style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={companionChildren}
                    onChange={(e) => handleChildrenToggle(e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  Filhos
                </label>
              </div>

              {companionChildren && (
                <div>
                  <label
                    htmlFor="childrenCount"
                    style={{ display: "block", marginBottom: "4px" }}
                  >
                    Quantos filhos?
                  </label>
                  <input
                    id="childrenCount"
                    type="number"
                    min={1}
                    step={1}
                    value={childrenCount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setChildrenCount(value === "" ? "" : Number(value));
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              background: "#111827",
              color: "#ffffff",
            }}
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}
