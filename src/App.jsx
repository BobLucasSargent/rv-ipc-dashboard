import { useState, useEffect, useMemo, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell, Area, AreaChart } from "recharts";

const API_BASE = "https://r-v-price-monitor-production.up.railway.app";

const RAW = {
  // Nivel general — base dic 2016 = 100
  nivel_general: [
    // ... (mantener todos los datos históricos anteriores a feb 2026 sin cambios)
    { fecha: "2026-02", indice: 10714.63, variacion: 2.9,  es_oficial: true  },
    { fecha: "2026-03", indice: 11078.93, variacion: 3.4,  es_oficial: true  },
  ],
 
  // División 01 — Alimentos y bebidas no alcohólicas
  "01": [
    { fecha: "2026-02", indice: 11624.98, variacion: 2.9,  es_oficial: true  },
    { fecha: "2026-03", indice: 11962.10, variacion: 2.9,  es_oficial: true  },
  ],
 
  // División 02 — Bebidas alcohólicas y tabaco
  "02": [
    { fecha: "2026-02", indice: 7659.91,  variacion: 2.8,  es_oficial: true  },
    { fecha: "2026-03", indice: 7820.77,  variacion: 2.1,  es_oficial: true  },
  ],
 
  // División 04 — Vivienda, agua, electricidad y gas
  "04": [
    { fecha: "2026-02", indice: 11614.19, variacion: 3.4,  es_oficial: true  },
    { fecha: "2026-03", indice: 12032.30, variacion: 3.6,  es_oficial: true  },
  ],
 
  // División 05 — Equipamiento y mantenimiento del hogar
  "05": [
    { fecha: "2026-02", indice: 8811.54,  variacion: 1.5,  es_oficial: true  },
    { fecha: "2026-03", indice: 8926.09,  variacion: 1.3,  es_oficial: true  },
  ],
 
  // División 06 — Salud
  "06": [
    { fecha: "2026-02", indice: 11886.50, variacion: 2.3,  es_oficial: true  },
    { fecha: "2026-03", indice: 12243.10, variacion: 3.0,  es_oficial: true  },
  ],
 
  // División 07 — Transporte
  "07": [
    { fecha: "2026-02", indice: 11124.88, variacion: 2.0,  es_oficial: true  },
    { fecha: "2026-03", indice: 11647.75, variacion: 4.7,  es_oficial: true  },
  ],
 
  // División 08 — Comunicación
  "08": [
    { fecha: "2026-02", indice: 9784.56,  variacion: 3.6,  es_oficial: true  },
    { fecha: "2026-03", indice: 10078.10, variacion: 3.0,  es_oficial: true  },
  ],
 
  // División 09 — Recreación y cultura
  "09": [
    { fecha: "2026-02", indice: 9427.94,  variacion: 1.3,  es_oficial: true  },
    { fecha: "2026-03", indice: 9729.63,  variacion: 3.2,  es_oficial: true  },
  ],
 
  // División 10 — Educación (excluida de R&V pero visible en histórico)
  "10": [
    { fecha: "2026-02", indice: 9010.40,  variacion: 1.7,  es_oficial: true  },
    { fecha: "2026-03", indice: 9974.51,  variacion: 10.7, es_oficial: true  },
  ],
 
  // División 11 — Restaurantes y hoteles (excluida de R&V)
  "11": [
    { fecha: "2026-02", indice: 13228.65, variacion: 4.1,  es_oficial: true  },
    { fecha: "2026-03", indice: 13665.20, variacion: 3.3,  es_oficial: true  },
  ],
 
  // División 12 — Bienes y servicios varios
  "12": [
    { fecha: "2026-02", indice: 10476.99, variacion: 2.9,  es_oficial: true  },
    { fecha: "2026-03", indice: 10665.58, variacion: 1.8,  es_oficial: true  },
  ],
};
 

const RV_PESOS_AJUSTADOS = {
  "Alimentos":           30.1867,
  "Bebidas y tabaco":     4.2112,
  "Vivienda y servicios":13.4707,
  "Equipamiento hogar":   8.0747,
  "Salud":               11.3329,
  "Transporte":          14.9259,
  "Comunicación":         3.6188,
  "Recreación y cultura": 9.6072,
  "Bienes y serv. varios":4.5718,
};

const EXCLUIDAS = new Set(["Indumentaria", "Educación", "Restaurantes y hoteles"]);
const RV_DIVISIONES = RAW.divisiones.filter(d => !EXCLUIDAS.has(d.short));

const C = {
  bg: "#06080d", card: "#0d1017", cardHover: "#141924", border: "#1a2035",
  borderLt: "#243050", text: "#e4e8f1", muted: "#6878a0", dim: "#374266",
  teal: "#43d9ad", tealBg: "rgba(67,217,173,0.08)", tealBorder: "rgba(67,217,173,0.2)",
  red: "#ef6461", redBg: "rgba(239,100,97,0.1)", amber: "#f0b429",
  blue: "#5b9cf6", purple: "#a78bfa", orange: "#ff9f43",
  greenGlow: "rgba(67,217,173,0.3)",
};
const FONT = "'Space Grotesk','DM Sans',system-ui,sans-serif";
const MONO = "'IBM Plex Mono','JetBrains Mono',monospace";
const DIV_COLORS = ["#43d9ad","#5b9cf6","#a78bfa","#ef6461","#f0b429","#e879a8","#36d6c5","#ff9f43","#7c83ff","#45b7d1"];
const fmt = (n,d=1) => n==null?"—":n.toLocaleString("es-AR",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtIdx = n => n==null?"—":n.toLocaleString("es-AR",{minimumFractionDigits:0,maximumFractionDigits:0});
const monthLabel = d => { const [y,m]=d.split("-"); const ms=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]; return `${ms[+m-1]} ${y.slice(2)}`; };
const dayLabel = d => { const parts = d.split("-"); return `${parts[2]}/${parts[1]}`; };

function TimeRangeSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[["all","Todo"],["3y","3 años"],["2y","2 años"],["1y","1 año"]].map(([k,l]) => (
        <button key={k} onClick={() => onChange(k)} style={{
          background: value===k ? C.tealBg : "transparent", color: value===k ? C.teal : C.dim,
          border: `1px solid ${value===k ? C.tealBorder : "transparent"}`, borderRadius: 5,
          padding: "3px 10px", fontSize: 10, fontFamily: MONO, cursor: "pointer", fontWeight: 500
        }}>{l}</button>
      ))}
    </div>
  );
}

export default function IPCDashboard() {
  const [tab, setTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("all");
  const [selDiv, setSelDiv] = useState(null);
  const [proxy, setProxy] = useState(null);
  const [proxyStatus, setProxyStatus] = useState("loading");
  const [intrames, setIntrames] = useState(null);
  const [intramesStatus, setIntramesStatus] = useState("loading");
  const [monthStatus, setMonthStatus] = useState(null);
  // ── NUEVO: núcleo R&V desde backend ──
  const [nucleoRV, setNucleoRV] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/v1/index/nivel-general`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/v1/index/divisiones`).then(r => r.json()).catch(() => null),
    ]).then(([indexData, divData]) => {
      if (indexData && !indexData.error) {
        setProxy({ index: indexData, divisiones: divData });
        setProxyStatus("ok");
      } else { setProxyStatus("error"); }
    }).catch(() => setProxyStatus("error"));

    fetch(`${API_BASE}/api/v1/index/intrames`).then(r => r.json())
      .then(d => { setIntrames(d); setIntramesStatus(d.error ? "no_data" : "ok"); })
      .catch(() => setIntramesStatus("error"));

    fetch(`${API_BASE}/api/v1/index/month-status`).then(r => r.json())
      .then(d => setMonthStatus(d))
      .catch(() => null);

    // ── NUEVO: fetch núcleo R&V ──
    fetch(`${API_BASE}/api/v1/index/intrames/nucleo`).then(r => r.json())
      .then(d => { if (!d.error && d.nucleo != null) setNucleoRV(d.nucleo); })
      .catch(() => null);
  }, []);

  const refreshProxy = () => {
    setProxyStatus("loading");
    fetch(`${API_BASE}/api/v1/index/nivel-general`).then(r => r.json())
      .then(d => { setProxy(p => ({ ...p, index: d })); setProxyStatus("ok"); })
      .catch(() => setProxyStatus("error"));
  };

  const refreshIntrames = () => {
    setIntramesStatus("loading");
    fetch(`${API_BASE}/api/v1/index/intrames`).then(r => r.json())
      .then(d => { setIntrames(d); setIntramesStatus(d.error ? "no_data" : "ok"); })
      .catch(() => setIntramesStatus("error"));
    // ── NUEVO: refrescar núcleo también ──
    fetch(`${API_BASE}/api/v1/index/intrames/nucleo`).then(r => r.json())
      .then(d => { if (!d.error && d.nucleo != null) setNucleoRV(d.nucleo); })
      .catch(() => null);
  };

  const varMensualData = useMemo(() => RAW.datesVar.map((date, i) => ({ date, label: monthLabel(date), varMensual: RAW.nivelGeneral.varMensual[i] })), []);
  const varYoYData = useMemo(() => RAW.datesYoY.map((date, i) => ({ date, label: monthLabel(date), varYoY: RAW.nivelGeneral.varInteranual[i] })), []);

  const filterByRange = (data) => {
    if (timeRange === "all") return data;
    const n = timeRange === "3y" ? 36 : timeRange === "1y" ? 12 : 24;
    return data.slice(-n);
  };
  const filteredMensual = useMemo(() => filterByRange(varMensualData), [varMensualData, timeRange]);
  const filteredYoY = useMemo(() => filterByRange(varYoYData), [varYoYData, timeRange]);

  const latestVarVal = RAW.nivelGeneral.varMensual[RAW.nivelGeneral.varMensual.length - 1];
  const latestYoYVal = RAW.nivelGeneral.varInteranual[RAW.nivelGeneral.varInteranual.length - 1];
  const nucleoVal = RAW.categorias["Núcleo"].varMensual[RAW.categorias["Núcleo"].varMensual.length - 1];
  const proxyVarAcum = intrames?.variacion_acumulada_mes ?? proxy?.index?.variacion_periodo;

  // Núcleo a mostrar: R&V si disponible, sino INDEC feb como fallback
  const nucleoDisplay = nucleoRV ?? nucleoVal;
  const nucleoEsRV = nucleoRV != null;

  const intramesVarByDiv = useMemo(() => {
    if (!intrames?.variaciones_por_division) return {};
    const map = {};
    Object.entries(intrames.variaciones_por_division).forEach(([cod, v]) => {
      if (v.tiene_datos && v.variacion_acumulada != null) {
        map[v.nombre] = v.variacion_acumulada;
      }
    });
    return map;
  }, [intrames]);

  const getIntramesVar = (short) => {
    for (const [key, val] of Object.entries(intramesVarByDiv)) {
      if (key.includes(short) || short.includes(key.split(" ")[0])) return val;
    }
    return null;
  };

  const divData = RV_DIVISIONES.map((d, i) => ({
    ...d,
    pesoAjustado: RV_PESOS_AJUSTADOS[d.short] ?? d.peso,
    color: DIV_COLORS[i % DIV_COLORS.length],
    lastVar: d.varMensual[d.varMensual.length - 1],
    prevVar: d.varMensual[d.varMensual.length - 2],
    intramesVar: getIntramesVar(d.short),
  })).sort((a, b) => b.lastVar - a.lastVar);

  const tooltipStyle = {
    backgroundColor: C.card, border: `1px solid ${C.border}`,
    borderRadius: 8, fontSize: 12, fontFamily: MONO, color: "#ffffff",
  };

  const selDivObj = selDiv != null ? RV_DIVISIONES[selDiv] : null;

  const selDivChart = useMemo(() => {
    if (!selDivObj) return [];
    const last24 = RAW.datesVar.slice(-24).map((date, i) => {
      const idx = RAW.datesVar.length - 24 + i;
      return { label: monthLabel(date), var: selDivObj.varMensual[idx], isProxy: false };
    });
    const intramesVar = getIntramesVar(selDivObj.short);
    if (intramesVar != null) {
      const now = new Date();
      const mesLabel = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][now.getMonth()] + " " + String(now.getFullYear()).slice(2) + " R&V";
      last24.push({ label: mesLabel, var: intramesVar, isProxy: true });
    } else if (proxyStatus === "ok" && proxy?.index?.variacion_periodo != null) {
      last24.push({ label: "Abr 26 R&V", var: proxy.index.variacion_periodo, isProxy: true });
    }
    return last24;
  }, [selDiv, selDivObj, intramesVarByDiv, proxy, proxyStatus]);

  const intramesChartData = useMemo(() => {
    if (!intrames?.serie_diaria || !Array.isArray(intrames.serie_diaria)) return [];
    return intrames.serie_diaria.map(d => ({ fecha: d.fecha, label: dayLabel(d.fecha), var_acumulada: d.var_acumulada }));
  }, [intrames]);

  const intramesDivData = useMemo(() => {
    if (!intrames?.variaciones_por_division || typeof intrames.variaciones_por_division !== 'object') return [];
    return Object.entries(intrames.variaciones_por_division)
      .filter(([_, v]) => v.tiene_datos && v.variacion_acumulada != null)
      .map(([cod, v], i) => ({ codigo: cod, nombre: v.nombre, variacion: v.variacion_acumulada, peso: v.peso_ajustado, color: DIV_COLORS[i % DIV_COLORS.length] }))
      .sort((a, b) => b.variacion - a.variacion);
  }, [intrames]);

  const currentMonth = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const mesActualLabel = (() => {
    const now = new Date();
    return ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][now.getMonth()] + " " + now.getFullYear();
  })();

  return (
    <div style={{ fontFamily: FONT, background: C.bg, color: C.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      <header style={{ padding: "20px 28px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: MONO, color: C.teal, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 2 }}>R&V IPC · Base dic 2016=100</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Inflación Argentina</h1>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: MONO, marginTop: 2 }}>Serie INDEC ene 2017 – feb 2026 + Proxy R&V en vivo</div>
        </div>
        <div style={{ display: "flex", gap: 3, background: C.card, borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
          {[["overview","Panel"],["intrames","En vivo"],["divisiones","Divisiones R&V"],["categorias","Categorías"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab===k ? (k==="intrames" ? "rgba(91,156,246,0.15)" : C.tealBg) : "transparent",
              color: tab===k ? (k==="intrames" ? C.blue : C.teal) : C.muted,
              border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontFamily: MONO,
              fontWeight: 600, cursor: "pointer", letterSpacing: 0.3
            }}>{l}{k==="intrames" && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: intramesStatus==="ok" ? C.teal : C.amber, marginLeft: 6 }} />}</button>
          ))}
        </div>
      </header>

      <div style={{ padding: "20px 28px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ── TOP 5 METRICS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 12 }}>
          <MetricBox label="Nivel general INDEC" value={fmtIdx(RAW.nivelGeneral.indices[RAW.nivelGeneral.indices.length-1])} sub="Feb 2026" accent />
          <MetricBox label="Var. mensual INDEC" value={`+${fmt(latestVarVal)}%`} sub="Feb 2026 vs ene 2026" />
          <MetricBox label="Acumulada mes R&V" value={proxyVarAcum != null ? `+${fmt(proxyVarAcum)}%` : "—"} sub={intrames?.mes ? `${currentMonth} (${intrames.n_dias || 0} días)` : "Conectando..."} highlight />
          <MetricBox label="Var. interanual" value={`+${fmt(latestYoYVal)}%`} sub="Feb 2026 vs feb 2025" />
          <MetricBox
            label="Inflación núcleo"
            value={`+${fmt(nucleoDisplay)}%`}
            sub={nucleoEsRV ? `${mesActualLabel} R&V (excl. reg.)` : "Feb 2026 INDEC (excl. estac. y reg.)"}
            nucleoStyle
          />
        </div>

        {/* ── R&V PROXY PANEL ── */}
        <div style={{ background: C.card, border: `1px solid ${proxyStatus==="ok" ? C.tealBorder : C.border}`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontFamily: MONO, color: C.teal, letterSpacing: 1.5, textTransform: "uppercase" }}>R&V IPC PROXY — EN VIVO</span>
              <span style={{ fontSize: 9, fontFamily: MONO, padding: "2px 8px", borderRadius: 4,
                background: proxyStatus==="ok" ? "rgba(67,217,173,0.15)" : proxyStatus==="loading" ? "rgba(240,180,41,0.15)" : "rgba(239,100,97,0.15)",
                color: proxyStatus==="ok" ? C.teal : proxyStatus==="loading" ? C.amber : C.red,
              }}>{proxyStatus==="ok" ? "CONECTADO" : proxyStatus==="loading" ? "CONECTANDO..." : "OFFLINE"}</span>
            </div>
            <button onClick={refreshProxy} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 10, fontFamily: MONO, padding: "4px 12px", cursor: "pointer" }}>Actualizar</button>
          </div>
          {proxyStatus==="ok" && proxy?.index ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <ProxyCard label="Nivel General Proxy" value={proxy.index.nivel_general?.toLocaleString("es-AR")||"—"} sub={proxy.index.fecha} accent />
              <ProxyCard label="Precios mes actual" value={monthStatus?.n_precios_totales || proxy.index.n_precios_recolectados || "0"} sub={`${monthStatus?.n_dias_recoleccion || 0} días recolectados`} />
              <ProxyCard label="Divisiones con datos" value={intrames?.divisiones_con_datos || proxy.index.divisiones_con_datos || "0"} sub="de 9 activas" />
              {/* ── NUEVO: núcleo R&V en proxy panel ── */}
              <ProxyCard
                label="Inflación núcleo"
                value={`+${fmt(nucleoDisplay)}%`}
                sub={nucleoEsRV ? `${mesActualLabel} R&V` : "Feb 2026 INDEC"}
              />
            </div>
          ) : proxyStatus==="loading" ? (
            <div style={{ fontSize: 12, color: C.muted, fontFamily: MONO, textAlign: "center", padding: 16 }}>Conectando con R&V backend...</div>
          ) : (
            <div style={{ fontSize: 12, color: C.dim, fontFamily: MONO, textAlign: "center", padding: 16 }}>Backend no disponible — mostrando datos INDEC históricos.</div>
          )}
        </div>

        {/* ── TAB: EN VIVO ── */}
        {tab === "intrames" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 13, fontFamily: MONO, color: C.blue, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Inflación en tiempo real — {currentMonth}</span>
                <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, marginTop: 2 }}>Variación acumulada de precios desde el primer día del mes</div>
              </div>
              <button onClick={refreshIntrames} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 10, fontFamily: MONO, padding: "4px 12px", cursor: "pointer" }}>Actualizar</button>
            </div>

            {intramesStatus === "ok" && intrames ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "rgba(91,156,246,0.08)", border: `1px solid rgba(91,156,246,0.25)`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Inflación acumulada mes</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.blue, lineHeight: 1.1, fontFamily: FONT }}>{intrames.variacion_acumulada_mes >= 0 ? "+" : ""}{fmt(intrames.variacion_acumulada_mes)}%</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{intrames.fecha_inicio} → {intrames.fecha_fin}</div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Días recolectados</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.1, fontFamily: FONT }}>{intrames.n_dias}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{intrames.mes}</div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Cobertura</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.1, fontFamily: FONT }}>{fmt(intrames.cobertura_pct, 0)}%</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{intrames.divisiones_con_datos} divisiones</div>
                  </div>
                  {/* ── NUEVO: card núcleo con dato R&V si disponible ── */}
                  <div style={{ background: "rgba(167,139,250,0.08)", border: `1px solid rgba(167,139,250,0.25)`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Inflación núcleo</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.purple, lineHeight: 1.1, fontFamily: FONT }}>+{fmt(nucleoDisplay)}%</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>
                      {nucleoEsRV ? `${mesActualLabel} R&V · excl. reg.` : "Feb 2026 INDEC · excl. estac. y reg."}
                    </div>
                  </div>
                </div>

                {intramesChartData.length > 1 ? (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 10 }}>Evolución diaria — Variación acumulada (%)</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={intramesChartData} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
                        <defs>
                          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.blue} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={C.blue} stopOpacity={0.02}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={v => [`${fmt(v, 3)}%`, "Var. acumulada"]} labelFormatter={l => `Día ${l}`} />
                        <ReferenceLine y={0} stroke={C.dim} strokeDasharray="2 2" />
                        <Area type="monotone" dataKey="var_acumulada" stroke={C.blue} strokeWidth={2.5} fill="url(#gradBlue)" dot={{ fill: C.blue, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: C.blue, stroke: C.bg, strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 30, textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 14, color: C.muted, marginBottom: 6 }}>Esperando más datos...</div>
                    <div style={{ fontSize: 11, color: C.dim, fontFamily: MONO }}>{intrames.mensaje || "Se necesitan al menos 2 días con precios para graficar la evolución."}</div>
                  </div>
                )}

                {intramesDivData.length > 0 && (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Variación por división — Acumulada {currentMonth}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {intramesDivData.map((d, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, color: C.muted, fontFamily: MONO, width: 150, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.nombre}</span>
                          <div style={{ flex: 1, height: 16, background: C.bg, borderRadius: 3, overflow: "hidden", position: "relative" }}>
                            <div style={{ height: "100%", width: `${Math.min(100,Math.max(2,Math.abs(d.variacion)/5*100))}%`, background: d.variacion >= 0 ? C.blue : C.teal, borderRadius: 3, opacity: 0.7 }} />
                          </div>
                          <span style={{ fontSize: 12, fontFamily: MONO, color: d.variacion > 0 ? C.red : d.variacion < 0 ? C.teal : C.muted, fontWeight: 600, width: 60, textAlign: "right" }}>{d.variacion>0?"+":""}{fmt(d.variacion)}%</span>
                          <span style={{ fontSize: 9, fontFamily: MONO, color: C.dim, width: 36, textAlign: "right" }}>{fmt(d.peso,1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : intramesStatus === "loading" ? (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 14, color: C.muted }}>Cargando datos intra-mensuales...</div>
              </div>
            ) : (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 16, color: C.muted, marginBottom: 8 }}>Sin datos intra-mensuales aún</div>
                <div style={{ fontSize: 11, color: C.dim, fontFamily: MONO, maxWidth: 500, margin: "0 auto" }}>El sistema está recolectando precios diariamente. En 2-3 días vas a ver la curva de evolución de precios del mes en curso.</div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: OVERVIEW ── */}
        {tab === "overview" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Variaciones históricas</span>
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 8 }}>Variación mensual (%)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={filteredMensual} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} interval={Math.max(1,Math.floor(filteredMensual.length/12))} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${fmt(v)}%`, "Var. mensual"]} />
                  <ReferenceLine y={0} stroke={C.dim} strokeDasharray="2 2" />
                  <Bar dataKey="varMensual" radius={[2,2,0,0]} fill={C.teal} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 8 }}>Variación interanual (%)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={filteredYoY} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} interval={Math.max(1,Math.floor(filteredYoY.length/12))} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${fmt(v)}%`, "Var. i.a."]} />
                  <Bar dataKey="varYoY" radius={[2,2,0,0]} fill={C.red} fillOpacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
                Divisiones R&V — Var. acumulada {mesActualLabel}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {divData.map((d, i) => {
                  const displayVar = d.intramesVar ?? d.lastVar;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: C.muted, fontFamily: MONO, width: 150, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.short}</span>
                      <div style={{ flex: 1, height: 16, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(100,Math.max(2,(displayVar/8)*100))}%`, background: d.color, borderRadius: 3, opacity: 0.7 }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: MONO, color: displayVar > latestVarVal ? C.red : C.teal, fontWeight: 600, width: 52, textAlign: "right" }}>{displayVar>0?"+":""}{fmt(displayVar)}%</span>
                      <span style={{ fontSize: 9, fontFamily: MONO, color: C.dim, width: 36, textAlign: "right" }}>{fmt(d.pesoAjustado,1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: DIVISIONES R&V ── */}
        {tab === "divisiones" && (
          <>
            <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
              Divisiones medidas por R&V — Seleccioná una para ver evolución
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 8, marginBottom: 16 }}>
              {RV_DIVISIONES.map((d, i) => {
                const pesoAjustado = RV_PESOS_AJUSTADOS[d.short] ?? d.peso;
                const intramesVar = getIntramesVar(d.short);
                const displayVar = intramesVar ?? d.varMensual[d.varMensual.length - 1];
                const hasIntrames = intramesVar != null;
                return (
                  <button key={i} onClick={() => setSelDiv(selDiv===i ? null : i)} style={{
                    background: selDiv===i ? DIV_COLORS[i%DIV_COLORS.length]+"18" : C.card,
                    border: `1px solid ${selDiv===i ? DIV_COLORS[i%DIV_COLORS.length]+"50" : C.border}`,
                    borderRadius: 8, padding: "10px 12px", cursor: "pointer", textAlign: "left",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: selDiv===i ? DIV_COLORS[i%DIV_COLORS.length] : C.text, marginBottom: 3 }}>{d.short}</div>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted }}>Peso: {fmt(pesoAjustado,1)}%</div>
                    <div style={{ fontSize: 14, fontFamily: MONO, fontWeight: 600, color: displayVar > latestVarVal ? C.red : C.teal, marginTop: 2 }}>
                      {displayVar > 0 ? "+" : ""}{fmt(displayVar)}%
                    </div>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.dim, marginTop: 1 }}>
                      {hasIntrames ? `Acum. ${mesActualLabel}` : "Feb 2026 INDEC"}
                    </div>
                  </button>
                );
              })}
            </div>

            {selDivObj && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: 16, marginRight: 16, marginBottom: 4 }}>
                  <div>
                    <span style={{ fontSize: 13, fontFamily: MONO, fontWeight: 600, color: DIV_COLORS[selDiv%DIV_COLORS.length] }}>{selDivObj.nombre}</span>
                    <span style={{ fontSize: 10, fontFamily: MONO, color: C.muted, marginLeft: 10 }}>
                      Peso R&V: {fmt(RV_PESOS_AJUSTADOS[selDivObj.short] ?? selDivObj.peso, 1)}%
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10, fontFamily: MONO }}>
                    <span style={{ color: DIV_COLORS[selDiv%DIV_COLORS.length] }}>■ INDEC</span>
                    <span style={{ color: C.orange }}>■ R&V {mesActualLabel}</span>
                  </div>
                </div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, marginLeft: 16, marginBottom: 10 }}>Variación mensual (%) — últimos 24 meses + estimación R&V acumulada</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={selDivChart} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 7, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#ffffff" }} itemStyle={{ color: "#ffffff" }}
                      formatter={(v, n, props) => {
                        const src = props.payload.isProxy ? `R&V ${mesActualLabel}` : "INDEC";
                        return [`${fmt(v)}%`, `${selDivObj.short} (${src})`];
                      }}
                    />
                    <ReferenceLine y={0} stroke={C.dim} strokeDasharray="2 2" />
                    <Bar dataKey="var" radius={[2,2,0,0]}>
                      {selDivChart.map((entry, idx) => (
                        <Cell key={idx} fill={entry.isProxy ? C.orange : DIV_COLORS[selDiv%DIV_COLORS.length]} fillOpacity={entry.isProxy ? 1 : 0.7} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: MONO }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.borderLt}` }}>
                    {["División R&V","Peso R&V","Var. mensual","Mes anterior","Tendencia"].map(h => (
                      <th key={h} style={{ textAlign: h.includes("División")?"left":"right", padding: "10px 12px", color: C.dim, fontWeight: 500, fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {divData.map((d, i) => {
                    const pesoAjustado = RV_PESOS_AJUSTADOS[d.short] ?? d.peso;
                    const varMensual = d.intramesVar ?? d.lastVar;
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "8px 12px", color: C.text }}>
                          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: d.color, marginRight: 8 }} />
                          {d.short}
                        </td>
                        <td style={{ textAlign: "right", padding: "8px 12px", color: C.muted }}>{fmt(pesoAjustado,1)}%</td>
                        <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: varMensual > latestVarVal ? C.red : C.teal }}>
                          +{fmt(varMensual)}%
                          {d.intramesVar != null && <span style={{ fontSize: 8, color: C.orange, marginLeft: 4 }}>R&V</span>}
                        </td>
                        <td style={{ textAlign: "right", padding: "8px 12px", color: C.dim, fontStyle: "italic" }}>—</td>
                        <td style={{ textAlign: "right", padding: "8px 12px", color: C.dim, fontSize: 10 }}>—</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding: "8px 12px", fontSize: 9, fontFamily: MONO, color: C.dim, borderTop: `1px solid ${C.border}` }}>
                Var. mensual: estimación R&V acumulada al {mesActualLabel} donde disponible (marcado R&V), resto feb 2026 INDEC · Mes anterior: pendiente datos INDEC marzo 2026
              </div>
            </div>
          </>
        )}

        {/* ── TAB: CATEGORIAS ── */}
        {tab === "categorias" && (
          <>
            <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Categorías IPC — Núcleo · Estacional · Regulados</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              {[["Núcleo", C.teal, nucleoVal], ["Estacional", C.amber, -1.3], ["Regulados", C.purple, 4.3]].map(([name, color, last]) => (
                <div key={name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: MONO, color: C.text }}>{last>=0?"+":""}{fmt(last)}%</div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: MONO }}>mensual feb 2026</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0" }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 10 }}>Inflación núcleo — Var. mensual últimos 24 meses</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={RAW.datesVar.slice(-24).map((date, i) => {
                  const idx = RAW.datesVar.length - 24 + i;
                  return { label: monthLabel(date), nucleo: RAW.categorias["Núcleo"].varMensual[idx] };
                })} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#ffffff" }} itemStyle={{ color: "#ffffff" }} formatter={v => [`${fmt(v)}%`, "Núcleo"]} />
                  <Bar dataKey="nucleo" radius={[2,2,0,0]} fill={C.teal} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        <div style={{ marginTop: 20, padding: "14px 0", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "center", fontSize: 10, fontFamily: MONO, color: C.dim }}>
          <span>R&V IPC · Fuente: INDEC Metodología N°32 + Precios Claros / ArgentinaDatos · IPC base dic 2016=100</span>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, sub, accent, delta, highlight, nucleoStyle }) {
  const bg = accent ? C.tealBg : highlight ? "rgba(91,156,246,0.08)" : nucleoStyle ? "rgba(167,139,250,0.08)" : C.card;
  const borderColor = accent ? C.tealBorder : highlight ? "rgba(91,156,246,0.25)" : nucleoStyle ? "rgba(167,139,250,0.25)" : C.border;
  const valColor = accent ? C.teal : highlight ? C.blue : nucleoStyle ? C.purple : C.text;
  return (
    <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: valColor, lineHeight: 1.1, fontFamily: FONT }}>
        {value}
        {delta != null && <span style={{ fontSize: 10, fontFamily: MONO, marginLeft: 6, color: delta>0?C.red:C.teal }}>{delta>0?"▲":"▼"}{Math.abs(delta).toFixed(1)}pp</span>}
      </div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{sub}</div>}
    </div>
  );
}

function ProxyCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: C.bg, borderRadius: 6, padding: "10px 12px" }}>
      <div style={{ fontSize: 9, fontFamily: MONO, color: C.dim }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: accent ? C.teal : C.text, fontFamily: MONO }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: C.muted, fontFamily: MONO }}>{sub}</div>}
    </div>
  );
}
