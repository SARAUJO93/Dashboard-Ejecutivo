import React, { useState, useMemo } from 'react';
import {
  Building2,
  Activity,
  QrCode,
  Sliders,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Truck,
  ShieldCheck,
  Cpu,
  RefreshCw,
  X,
  Gauge,
  Compass,
  Users,
  Target,
  FileText,
  Calendar,
  CheckSquare
} from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 'PRJ-901',
    name: 'Nave Industrial Aeroespacial Fase II',
    client: 'Safran / Parque Industrial Chihuahua',
    plant: 'Planta Chihuahua (Pesada)',
    tons: 680,
    plannedMargin: 24.5,
    actualMargin: 23.8,
    spi: 1.02,
    cpi: 0.98,
    otif: 96,
    copq: 4200,
    status: 'ok',
    norm: 'AISC / AWS D1.1',
    blocker: 'Sin bloqueos críticos. Montaje de armaduras principales al 78%.',
    cosAction: 'Liberar estimación #4 con finanzas para facturación anticipada.'
  },
  {
    id: 'PRJ-904',
    name: 'Centro Logístico & Cross-Docking Norte',
    client: 'DHL Supply Chain / Cd. Juárez',
    plant: 'Planta Cd. Juárez (SJI Joist)',
    tons: 520,
    plannedMargin: 22.0,
    actualMargin: 18.4,
    spi: 0.88,
    cpi: 0.89,
    otif: 82,
    copq: 19500,
    status: 'warn',
    norm: 'SJI / ASTM A992',
    blocker: 'Desfase entre revisión de ingeniería en Tekla y lote de Joist J-14 en pintura SSPC.',
    cosAction: 'Congelar embarque de 65 Ton hasta validar anclajes en sitio con residente de obra.'
  },
  {
    id: 'PRJ-908',
    name: 'Planta Manufactura Semiconductores',
    client: 'Foxconn / Corredor Industrial',
    plant: 'Ambas Plantas (Híbrido)',
    tons: 950,
    plannedMargin: 26.0,
    actualMargin: 25.4,
    spi: 1.04,
    cpi: 1.01,
    otif: 98,
    copq: 2100,
    status: 'ok',
    norm: 'AISC / SJI / SSPC-SP10',
    blocker: 'Operación óptima. Sincronización BIM-ERP al 100%.',
    cosAction: 'Mantener ritmo de embarque de 120 Ton semanales.'
  },
  {
    id: 'PRJ-912',
    name: 'Ampliación Complejo Minero & Trituración',
    client: 'Grupo México / Sonora',
    plant: 'Planta Chihuahua (Pesada)',
    tons: 410,
    plannedMargin: 25.0,
    actualMargin: 16.9,
    spi: 0.81,
    cpi: 0.84,
    otif: 74,
    copq: 34800,
    status: 'critical',
    norm: 'ASTM A572 Gr.50 / IMCA',
    blocker: 'Terracerías del cliente atrasadas; 90 Ton de columnas acumuladas en patio Chihuahua.',
    cosAction: 'Aplicar cláusula de almacenaje y reasignar 2 cuadrillas de montaje a PRJ-904.'
  }
];

const INITIAL_LOTS = [
  {
    id: 'QR-CHH-4410',
    project: 'PRJ-901 • Nave Aeroespacial',
    element: 'Girders Principales G-12 al G-18',
    tons: 48.5,
    stage: 'Recibido en Obra',
    siteReady: true,
    scans: 4,
    norm: 'Ultrasonido AWS OK'
  },
  {
    id: 'QR-JUA-8821',
    project: 'PRJ-904 • Centro Logístico Juárez',
    element: 'Lote Joist Serie LH (SJI Cert.)',
    tons: 65.0,
    stage: 'Pintura SSPC',
    siteReady: false,
    scans: 2,
    norm: 'SSPC-PA2 Pendiente'
  },
  {
    id: 'QR-CHH-4419',
    project: 'PRJ-908 • Planta Semiconductores',
    element: 'Columnas Armadas HSS & Placas Base',
    tons: 112.0,
    stage: 'En Tránsito',
    siteReady: true,
    scans: 3,
    norm: 'Líquidos Penetrantes OK'
  },
  {
    id: 'QR-CHH-4425',
    project: 'PRJ-912 • Complejo Minero Sonora',
    element: 'Armaduras Pesadas Tramo C',
    tons: 90.0,
    stage: 'Fabricación',
    siteReady: false,
    scans: 1,
    norm: 'AISC Tolerancias OK'
  }
];

// DESGLOSE ACTIVIDAD POR ACTIVIDAD ULTRA DETALLADO (WBS & GANTT)
const DETAILED_ACTIVITIES = [
  {
    id: 'ACT-01',
    phase: 'Fase 1: Meses 1 - 12 (Visibilidad y Datos)',
    code: 'F1.01',
    task: 'Diseño e implementación de la Torre de Control Base (EVM & SPI/CPI)',
    duration: 'Meses 1 - 3',
    progress: 100,
    resource: 'Chief of Staff (CoS) + Analista BI',
    deliverable: 'Tableros interactivos Vercel / Supabase en producción',
    status: 'Completado'
  },
  {
    id: 'ACT-02',
    phase: 'Fase 1: Meses 1 - 12 (Visibilidad y Datos)',
    code: 'F1.02',
    task: 'Auditoría y estandarización de flujos BIM (Tekla Structures / Advance Steel)',
    duration: 'Meses 3 - 6',
    progress: 75,
    resource: 'Líder de Integración BIM + Ing. Detalle',
    deliverable: 'Manual unificado de validación de listas de materiales (BOM)',
    status: 'En Proceso'
  },
  {
    id: 'ACT-03',
    phase: 'Fase 1: Meses 1 - 12 (Visibilidad y Datos)',
    code: 'F1.03',
    task: 'Instauración del Comité Directivo Semanal de PMO (Rhythm of Business)',
    duration: 'Mes 2 en adelante',
    progress: 90,
    resource: 'Dirección General + CoS + Gerentes de Planta',
    deliverable: 'Minutas automatizadas y cadencia semanal de 45 min',
    status: 'En Proceso'
  },
  {
    id: 'ACT-04',
    phase: 'Fase 1: Meses 1 - 12 (Visibilidad y Datos)',
    code: 'F1.04',
    task: 'Mapeo financiero y separación de P&L por planta (Chihuahua vs Juárez)',
    duration: 'Meses 6 - 9',
    progress: 40,
    resource: 'CFO + Gerentes de Planta (P&L)',
    deliverable: 'Centros de beneficio independientes y control de OEE',
    status: 'En Proceso'
  },
  {
    id: 'ACT-05',
    phase: 'Fase 2: Meses 13 - 24 (Automatización y Trazabilidad)',
    code: 'F2.01',
    task: 'Desarrollo e implantación de etiquetas y códigos QR por lote estructural',
    duration: 'Meses 13 - 16',
    progress: 15,
    resource: 'Full-Stack Developer + Supervisores de Planta',
    deliverable: 'App móvil interna de escaneo (Fabricación → Montaje)',
    status: 'Planificado'
  },
  {
    id: 'ACT-06',
    phase: 'Fase 2: Meses 13 - 24 (Automatización y Trazabilidad)',
    code: 'F2.02',
    task: 'Optimización de Supply Chain y contratos marco de acero (ASTM A992)',
    duration: 'Meses 16 - 20',
    progress: 0,
    resource: 'Gerente de Supply Chain + Compras',
    deliverable: 'Mitigación de volatilidad de precios a 6 meses',
    status: 'Planificado'
  },
  {
    id: 'ACT-07',
    phase: 'Fase 2: Meses 13 - 24 (Automatización y Trazabilidad)',
    code: 'F2.03',
    task: 'Integración del Copiloto IA (Claude + Gemini) para validación de planos',
    duration: 'Meses 20 - 24',
    progress: 0,
    resource: 'Arquitecto de Software + CoS',
    deliverable: 'Auditoría automática de BOMs y detección de scrap',
    status: 'Planificado'
  },
  {
    id: 'ACT-08',
    phase: 'Fase 3: Meses 25 - 36 (Gobierno Corporativo y Escalamiento)',
    code: 'F3.01',
    task: 'Formalización del Consejo de Administración Independiente',
    duration: 'Meses 25 - 28',
    progress: 0,
    resource: 'Consejo Directivo + Accionistas + Consultores',
    deliverable: 'Sesiones trimestrales de CapEx y auditoría externa',
    status: 'Planificado'
  },
  {
    id: 'ACT-09',
    phase: 'Fase 3: Meses 25 - 36 (Gobierno Corporativo y Escalamiento)',
    code: 'F3.02',
    task: 'Creación de la Universidad Corporativa Grupo Cano (AWS / AISC)',
    duration: 'Meses 28 - 33',
    progress: 0,
    resource: 'Director de Capital Humano + Instructores Certificados',
    deliverable: 'Academia interna de soldadura y operación CNC',
    status: 'Planificado'
  },
  {
    id: 'ACT-10',
    phase: 'Fase 3: Meses 25 - 36 (Gobierno Corporativo y Escalamiento)',
    code: 'F3.03',
    task: 'Consolidación de planes de sucesión y manuales de gobernanza global',
    duration: 'Meses 34 - 36',
    progress: 0,
    resource: 'CoS + Consultoría Externa',
    deliverable: 'Organización 100% institucionalizada y autónoma',
    status: 'Planificado'
  }
];

const STAGES = ['Fabricación', 'Pintura SSPC', 'En Tránsito', 'Recibido en Obra', 'Montado'];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('evm');
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(INITIAL_PROJECTS[1]);
  const [lots, setLots] = useState(INITIAL_LOTS);
  const [lotFilter, setLotFilter] = useState('Todos');
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedPhaseModal, setSelectedPhaseModal] = useState(null);
  const [toast, setToast] = useState('Cano CoS OS • Sincronizado en tiempo real');

  // Simulador What-If
  const [steelDelta, setSteelDelta] = useState(0);
  const [delayDays, setDelayDays] = useState(4);
  const [reworkCut, setReworkCut] = useState(45);

  // Copiloto IA (Claude / Gemini)
  const [aiEngine, setAiEngine] = useState('claude');
  const [aiOutput, setAiOutput] = useState(
    'Dictamen Ejecutivo CoS: La prioridad de esta semana es contener la erosión de margen en PRJ-912 (-8.1% vs plan) deteniendo el envío de las 90 Ton en patio Chihuahua hasta que el cliente libere las cimentaciones en Sonora, reubicando cuadrillas hacia Cd. Juárez.'
  );

  const triggerToast = (msg) => {
    setToast(msg);
  };

  const metrics = useMemo(() => {
    const totalTons = projects.reduce((acc, p) => acc + p.tons, 0);
    const avgPlanned =
      projects.reduce((acc, p) => acc + p.plannedMargin, 0) / projects.length;
    const avgActual =
      projects.reduce((acc, p) => acc + p.actualMargin, 0) / projects.length;
    const avgOtif = Math.round(
      projects.reduce((acc, p) => acc + p.otif, 0) / projects.length
    );
    const totalCopq = projects.reduce((acc, p) => acc + p.copq, 0);
    return {
      totalTons,
      avgPlanned: avgPlanned.toFixed(1),
      avgActual: avgActual.toFixed(1),
      avgOtif,
      totalCopq
    };
  }, [projects]);

  const simulation = useMemo(() => {
    const baseEbitda = 1480000; // USD trimestral estimado
    const steelImpact = steelDelta * -18500;
    const delayImpact = delayDays * -6400;
    const reworkSavings = (metrics.totalCopq * (reworkCut / 100)) * 2.2;
    const projectedEbitda = baseEbitda + steelImpact + delayImpact + reworkSavings;
    const deltaUsd = projectedEbitda - baseEbitda;
    return {
      projectedEbitda: Math.round(projectedEbitda),
      deltaUsd: Math.round(deltaUsd),
      reworkSavings: Math.round(reworkSavings)
    };
  }, [steelDelta, delayDays, reworkCut, metrics.totalCopq]);

  const advanceLotStage = (lotId) => {
    setLots((prev) =>
      prev.map((lot) => {
        if (lot.id !== lotId) return lot;
        const currentIndex = STAGES.indexOf(lot.stage);
        const nextStage = STAGES[(currentIndex + 1) % STAGES.length];
        triggerToast(`Escaneo QR ${lot.id}: actualizado a "${nextStage}"`);
        return {
          ...lot,
          stage: nextStage,
          scans: lot.scans + 1,
          siteReady: nextStage === 'Montado' ? true : lot.siteReady
        };
      })
    );
  };

  const approveAction = (projectId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: 'ok',
              actualMargin: Number((p.actualMargin + 1.4).toFixed(1)),
              otif: Math.min(99, p.otif + 6)
            }
          : p
      )
    );
    triggerToast(`Instrucción CoS ejecutada en ${projectId} • Indicadores actualizados`);
  };

  const runCopilotAnalysis = (engine) => {
    setAiEngine(engine);
    if (engine === 'claude') {
      setAiOutput(
        'Claude 3.7 Sonnet (Síntesis para Comité Directivo): 1) Autorizar cobro de estadía en PRJ-912 ($14,200 USD). 2) Automatizar validación de BOM entre Tekla Structures v21.1 y compras de acero ASTM A992 para recuperar +2.1 pts de margen bruto en Q4.'
      );
      triggerToast('Claude: Minuta ejecutiva generada');
    } else {
      setAiOutput(
        'Gemini 2.5 Pro (Auditoría Técnica BIM & Planta): Se analizaron 1,420 planos de detalle en Advance Steel / STAAD Pro. Se detectó oportunidad de optimizar 18.4 Ton de desperdicio (Scrap) anidando cortes de placa en Planta Chihuahua.'
      );
      triggerToast('Gemini: Cruce de ingeniería Tekla/BOM completado');
    }
  };

  const filteredLots =
    lotFilter === 'Todos' ? lots : lots.filter((l) => l.stage === lotFilter);

  const bgMain = darkMode ? 'bg-[#000000] text-[#F5F5F7]' : 'bg-[#F5F5F7] text-[#1D1D1F]';
  const cardBg = darkMode
    ? 'bg-[#1C1C1E]/90 border-white/10 text-[#F5F5F7]'
    : 'bg-white/85 border-black/[0.06] text-[#1D1D1F]';
  const subtleText = darkMode ? 'text-[#86868B]' : 'text-[#6E6E73]';

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${bgMain} pb-16`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif'
      }}
    >
      {/* Dynamic Island Notification */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
        <div className="bg-black text-white px-4 py-1.5 rounded-full shadow-lg border border-white/15 flex items-center gap-2.5 text-xs font-medium tracking-tight">
          <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
          <span>{toast}</span>
        </div>
      </div>

      {/* Top Glass Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
          darkMode ? 'bg-black/75 border-white/10' : 'bg-white/75 border-black/[0.06]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 pt-11 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0071E3] flex items-center justify-center text-white shadow-sm transform hover:scale-105 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0071E3]">
                  Grupo Cano • 35 Aniversario
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#34C759]/15 text-[#34C759] font-medium">
                  Chihuahua & Cd. Juárez
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                Cano Estructuras — Chief of Staff OS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowPitchModal(true)}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[#0071E3] text-white hover:bg-[#0077ED] transition transform hover:scale-105 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Guion Entrevista CoS (5 min)
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full border transition transform hover:rotate-45 cursor-pointer ${
                darkMode
                  ? 'bg-[#1C1C1E] border-white/15 text-amber-400'
                  : 'bg-white border-black/10 text-[#1D1D1F]'
              }`}
              title="Cambiar modo de apariencia"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Apple Segmented Control */}
        <div className="max-w-7xl mx-auto px-6 pb-3 overflow-x-auto">
          <div
            className={`inline-flex p-1 rounded-2xl border ${
              darkMode ? 'bg-[#1C1C1E] border-white/10' : 'bg-[#E8E8ED]/80 border-black/[0.04]'
            } gap-1`}
          >
            {[
              { id: 'evm', label: '1. Dirección General & EVM', icon: Activity },
              { id: 'bim', label: '2. Ingeniería BIM & Plantas', icon: Layers },
              { id: 'qr', label: '3. Trazabilidad QR & Obra', icon: QrCode },
              { id: 'gov', label: '4. Gobernanza, IA & What-If', icon: Sliders },
              { id: 'mood', label: '5. Plan MoOD & Roadmap & Gantt', icon: Compass }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    active
                      ? darkMode
                        ? 'bg-[#2C2C2E] text-white shadow-md scale-100'
                        : 'bg-white text-[#1D1D1F] shadow-md scale-100'
                      : subtleText
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* Top KPI Bento Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border backdrop-blur-md transition transform hover:-translate-y-1 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${subtleText}`}>
                Capacidad Activa (2 Plantas)
              </span>
              <Gauge className="w-4 h-4 text-[#0071E3]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-3xl font-semibold tracking-tight">2,150</span>
              <span className={`text-xs ${subtleText}`}>/ 2,500 Ton/mes</span>
            </div>
            <p className="mt-2 text-xs text-[#34C759] font-medium">
              86% utilización • Chih (1,500T) + Jrz (250T/sem)
            </p>
          </div>

          <div className={`p-5 rounded-3xl border backdrop-blur-md transition transform hover:-translate-y-1 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${subtleText}`}>
                Margen Bruto Real vs. Plan
              </span>
              <Activity className="w-4 h-4 text-[#34C759]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-3xl font-semibold tracking-tight">
                {metrics.avgActual}%
              </span>
              <span className={`text-xs ${subtleText}`}>
                Plan: {metrics.avgPlanned}%
              </span>
            </div>
            <p className="mt-2 text-xs text-[#FF9500] font-medium">
              Desviación concentrada en PRJ-912 (Sonora)
            </p>
          </div>

          <div className={`p-5 rounded-3xl border backdrop-blur-md transition transform hover:-translate-y-1 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${subtleText}`}>
                OTIF Embarques a Obra
              </span>
              <Truck className="w-4 h-4 text-[#0071E3]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-3xl font-semibold tracking-tight">
                {metrics.avgOtif}%
              </span>
              <span className="text-xs text-[#34C759] font-medium">Meta: 95%</span>
            </div>
            <p className={`mt-2 text-xs ${subtleText}`}>
              Sincronización Planta → Residente de Montaje
            </p>
          </div>

          <div className={`p-5 rounded-3xl border backdrop-blur-md transition transform hover:-translate-y-1 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${subtleText}`}>
                Costo de Retrabajo (COPQ)
              </span>
              <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-3xl font-semibold tracking-tight">
                ${metrics.totalCopq.toLocaleString()}
              </span>
              <span className={`text-xs ${subtleText}`}>USD acumulados</span>
            </div>
            <p className="mt-2 text-xs text-[#0071E3] font-medium">
              Meta CoS: Reducir 45% vía cruce Tekla-Obra
            </p>
          </div>
        </section>

        {/* VIEW 1: DIRECCIÓN GENERAL & EVM */}
        {activeTab === 'evm' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className={`lg:col-span-2 p-6 rounded-3xl border ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">
                    Portafolio de Macro-Proyectos (Earned Value Management)
                  </h2>
                  <p className={`text-xs ${subtleText}`}>
                    Haz clic en cualquier proyecto para abrir su radiografía ejecutiva
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-medium">
                  SPI / CPI en vivo
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse tabular-nums">
                  <thead>
                    <tr className={`border-b text-[11px] uppercase ${subtleText}`}>
                      <th className="pb-3 font-medium">Proyecto / Cliente</th>
                      <th className="pb-3 font-medium">Toneladas</th>
                      <th className="pb-3 font-medium">Margen (Plan/Real)</th>
                      <th className="pb-3 font-medium">SPI / CPI</th>
                      <th className="pb-3 font-medium">Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs">
                    {projects.map((p) => {
                      const isSelected = selectedProject.id === p.id;
                      return (
                        <tr
                          key={p.id}
                          onClick={() => setSelectedProject(p)}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? 'bg-[#0071E3]/10'
                              : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                          }`}
                        >
                          <td className="py-3.5 pr-3">
                            <div className="font-semibold">{p.name}</div>
                            <div className={`text-[11px] ${subtleText}`}>
                              {p.id} • {p.client}
                            </div>
                          </td>
                          <td className="py-3.5 font-medium">{p.tons} Ton</td>
                          <td className="py-3.5">
                            <span className={subtleText}>{p.plannedMargin}% → </span>
                            <span
                              className={`font-semibold ${
                                p.actualMargin < p.plannedMargin - 2
                                  ? 'text-[#FF3B30]'
                                  : 'text-[#34C759]'
                              }`}
                            >
                              {p.actualMargin}%
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className="font-medium">
                              {p.spi} / {p.cpi}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                p.status === 'ok'
                                  ? 'bg-[#34C759]/15 text-[#34C759]'
                                  : p.status === 'warn'
                                  ? 'bg-[#FF9500]/15 text-[#FF9500]'
                                  : 'bg-[#FF3B30]/15 text-[#FF3B30]'
                              }`}
                            >
                              {p.status === 'ok'
                                ? 'En Rango'
                                : p.status === 'warn'
                                ? 'Atención CoS'
                                : 'Crítico'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Radiografía del Proyecto Seleccionado */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between ${cardBg}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0071E3]">
                    RADIOGRAFÍA EJECUTIVA • {selectedProject.id}
                  </span>
                  <span className={`text-xs ${subtleText}`}>{selectedProject.norm}</span>
                </div>
                <h3 className="text-lg font-semibold mt-1">{selectedProject.name}</h3>
                <p className={`text-xs ${subtleText}`}>{selectedProject.plant}</p>

                <div className="mt-5 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
                    <div className={`text-[11px] uppercase font-semibold ${subtleText}`}>
                      Cuello de Botella Detectado (Pain Point)
                    </div>
                    <p className="text-xs mt-1 leading-relaxed">
                      {selectedProject.blocker}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0071E3]/10 border border-[#0071E3]/20">
                    <div className="text-[11px] uppercase font-semibold text-[#0071E3]">
                      Intervención Propuesta por Chief of Staff
                    </div>
                    <p className="text-xs mt-1 leading-relaxed font-medium">
                      {selectedProject.cosAction}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => approveAction(selectedProject.id)}
                className="mt-6 w-full py-3 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold transition transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                Ejecutar Instrucción CoS y Actualizar Tablero
              </button>
            </div>
          </section>
        )}

        {/* VIEW 2: INGENIERÍA BIM & PLANTAS */}
        {activeTab === 'bim' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div className={`p-6 rounded-3xl border ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-[#0071E3]">
                    PLANTA PRINCIPAL • CHIHUAHUA, CHIH.
                  </span>
                  <h3 className="text-lg font-semibold">
                    Estructura Pesada, Girders & Armaduras
                  </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#34C759]/15 text-[#34C759]">
                  1,310 / 1,500 Ton/mes
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
                  <span className={subtleText}>OEE de Piso (Corte CNC, Armado y Soldadura)</span>
                  <span className="font-semibold">87.4%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
                  <span className={subtleText}>Inspección No Destructiva (UT / Líquidos / Partículas)</span>
                  <span className="font-semibold text-[#34C759]">99.1% Aprobación 1ra Vez</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className={subtleText}>Integración Tekla Structures v21.1 → CNC</span>
                  <span className="font-semibold text-[#0071E3]">Sincronizado (Sin retrabajo)</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-[#0071E3]">
                    PLANTA ESPECIALIZADA • CD. JUÁREZ (3,500 m²)
                  </span>
                  <h3 className="text-lg font-semibold">
                    Joist & Joist Girder (Certificación S.J.I.)
                  </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FF9500]/15 text-[#FF9500]">
                  840 / 1,000 Ton/mes (250T/sem)
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
                  <span className={subtleText}>Línea de Producción SJI (Steel Joist Institute)</span>
                  <span className="font-semibold">210 Ton/semana actuales</span>
                </div>
                <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
                  <span className={subtleText}>Cálculo Estructural (STAAD Pro / RAM / Risa / Microjoist)</span>
                  <span className="font-semibold">100% Validado</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className={subtleText}>Cuello de Botella Detectado</span>
                  <span className="font-semibold text-[#FF9500]">
                    Cabina de Pintura SSPC (Lote J-14)
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 3: TRAZABILIDAD QR & OBRA */}
        {activeTab === 'qr' && (
          <section className={`p-6 rounded-3xl border ${cardBg} animate-fadeIn`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base font-semibold">
                  Trazabilidad Digital QR: "¿Dónde está mi viga?"
                </h2>
                <p className={`text-xs ${subtleText}`}>
                  Simula el escaneo QR desde el celular del supervisor de embarques o montaje en obra
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Todos', ...STAGES].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLotFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                      lotFilter === st
                        ? 'bg-[#0071E3] text-white shadow'
                        : 'bg-black/[0.04] dark:bg-white/[0.06]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLots.map((lot) => (
                <div
                  key={lot.id}
                  className="p-4 rounded-2xl border border-black/5 dark:border-white/10 flex flex-col justify-between gap-3 hover:border-[#0071E3] transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-semibold text-[#0071E3]">
                        {lot.id}
                      </span>
                      <h4 className="text-sm font-semibold mt-0.5">{lot.element}</h4>
                      <p className={`text-xs ${subtleText}`}>{lot.project}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0071E3]/10 text-[#0071E3]">
                      {lot.stage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-black/5 dark:border-white/5">
                    <span>
                      Peso: <strong>{lot.tons} Ton</strong> • {lot.norm}
                    </span>
                    <button
                      onClick={() => advanceLotStage(lot.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#0071E3] text-white font-medium hover:bg-[#0077ED] transition transform hover:scale-105 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Simular Escaneo QR ({lot.scans})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIEW 4: GOBERNANZA, COPILOTO IA & SIMULADOR WHAT-IF */}
        {activeTab === 'gov' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* Simulador Financiero What-If */}
            <div className={`p-6 rounded-3xl border ${cardBg}`}>
              <span className="text-xs font-semibold text-[#0071E3]">
                SIMULADOR FINANCIERO DE ESCENARIOS (WHAT-IF)
              </span>
              <h3 className="text-lg font-semibold mt-1">
                Sensibilidad de EBITDA Trimestral
              </h3>

              <div className="mt-5 space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Variación Precio Acero Importado / Molino (%)</span>
                    <strong className="tabular-nums">{steelDelta}%</strong>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    value={steelDelta}
                    onChange={(e) => setSteelDelta(Number(e.target.value))}
                    className="w-full accent-[#0071E3] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Días de retraso promedio en obra (Clima / Terracerías)</span>
                    <strong className="tabular-nums">{delayDays} días</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={delayDays}
                    onChange={(e) => setDelayDays(Number(e.target.value))}
                    className="w-full accent-[#0071E3] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Reducción de Retrabajos (COPQ) vía Torre de Control CoS</span>
                    <strong className="tabular-nums text-[#34C759]">{reworkCut}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={reworkCut}
                    onChange={(e) => setReworkCut(Number(e.target.value))}
                    className="w-full accent-[#34C759] cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] flex items-center justify-between tabular-nums">
                <div>
                  <div className={`text-xs ${subtleText}`}>EBITDA Trimestral Proyectado</div>
                  <div className="text-2xl font-semibold">
                    ${simulation.projectedEbitda.toLocaleString()} USD
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs ${subtleText}`}>Impacto Neto Escenario</div>
                  <div
                    className={`text-sm font-semibold ${
                      simulation.deltaUsd >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'
                    }`}
                  >
                    {simulation.deltaUsd >= 0 ? '+' : ''}
                    ${simulation.deltaUsd.toLocaleString()} USD
                  </div>
                </div>
              </div>
            </div>

            {/* Copiloto Multi-LLM (Claude + Gemini) */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between ${cardBg}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0071E3]">
                    ARQUITECTURA VERCEL + SUPABASE REALTIME + IA
                  </span>
                  <Cpu className="w-4 h-4 text-[#0071E3]" />
                </div>
                <h3 className="text-lg font-semibold mt-1">
                  Copiloto Ejecutivo Dual (Claude + Gemini)
                </h3>
                <p className={`text-xs mt-1 ${subtleText}`}>
                  Selecciona el motor para sintetizar minutas directivas o auditar listas de materiales (BOM)
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => runCopilotAnalysis('claude')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      aiEngine === 'claude'
                        ? 'bg-[#0071E3] text-white shadow'
                        : 'bg-black/[0.05] dark:bg-white/[0.08]'
                    }`}
                  >
                    Claude 3.7 (Comité & Finanzas)
                  </button>
                  <button
                    onClick={() => runCopilotAnalysis('gemini')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      aiEngine === 'gemini'
                        ? 'bg-[#0071E3] text-white shadow'
                        : 'bg-black/[0.05] dark:bg-white/[0.08]'
                    }`}
                  >
                    Gemini 2.5 (Auditoría Tekla BOM)
                  </button>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] text-xs leading-relaxed">
                  {aiOutput}
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t border-black/5 dark:border-white/5 text-[11px] ${subtleText} flex justify-between`}>
                <span>Stack: React + Vite + Tailwind + Supabase</span>
                <span>Latencia Realtime: 42ms</span>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 5: PLAN MOOD & ROADMAP & GANTT DETALLADO (ANIMADO) */}
        {activeTab === 'mood' && (
          <section className={`p-6 rounded-3xl border ${cardBg} space-y-8 animate-fadeIn`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#0071E3]">MODELO DE OPERACIÓN INSTITUCIONAL (MOOD)</span>
                <h2 className="text-xl font-semibold mt-0.5">Plan Actividad por Actividad & Diagrama Gantt (36 Meses)</h2>
                <p className={`text-xs ${subtleText}`}>Desglose operativo completo con asignación lógica de recursos y cronograma crítico para Grupo Cano.</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#34C759]/15 text-[#34C759] flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" /> Ejecución de WBS Activa
              </span>
            </div>

            {/* TABLA DETALLADA ACTIVIDAD POR ACTIVIDAD */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#0071E3] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Desglose Actividad por Actividad & Recursos Lógicos
              </h3>
              
              <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
                <table className="w-full text-left border-collapse tabular-nums">
                  <thead>
                    <tr className={`border-b text-[11px] uppercase ${subtleText} bg-black/[0.02] dark:bg-white/[0.02]`}>
                      <th className="p-3 font-medium">Código</th>
                      <th className="p-3 font-medium">Fase / Actividad Detallada</th>
                      <th className="p-3 font-medium">Duración WBS</th>
                      <th className="p-3 font-medium">Recurso Asignado (Lógico)</th>
                      <th className="p-3 font-medium">Entregable Tangible</th>
                      <th className="p-3 font-medium">Avance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs">
                    {DETAILED_ACTIVITIES.map((act) => (
                      <tr key={act.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                        <td className="p-3 font-mono font-semibold text-[#0071E3]">{act.code}</td>
                        <td className="p-3">
                          <div className="font-semibold">{act.task}</div>
                          <div className={`text-[10px] ${subtleText}`}>{act.phase}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap font-medium">{act.duration}</td>
                        <td className="p-3 text-[#34C759] font-medium">{act.resource}</td>
                        <td className={`p-3 ${subtleText}`}>{act.deliverable}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                              <div className="h-full bg-[#0071E3] transition-all duration-1000" style={{ width: `${act.progress}%` }} />
                            </div>
                            <span className="text-[11px] font-semibold">{act.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DIAGRAMA DE GANTT VISUAL ANIMADO */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/10">
              <h3 className="text-sm font-semibold text-[#0071E3] uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4" /> Diagrama de Gantt Macro (Horizonte 36 Meses)
              </h3>
              
              <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.02] space-y-4">
                <div className="grid grid-cols-4 text-[11px] font-semibold uppercase text-center pb-2 border-b border-black/5 dark:border-white/5">
                  <span className="text-left">Fase WBS</span>
                  <span>Año 1 (Visibilidad)</span>
                  <span>Año 2 (Automatización)</span>
                  <span>Año 3 (Gobierno)</span>
                </div>

                {/* Barra Fase 1 */}
                <div className="grid grid-cols-4 items-center text-xs gap-2">
                  <span className="font-semibold">Fase 1: Visibilidad & Datos</span>
                  <div className="col-span-3 bg-black/5 dark:bg-white/5 rounded-full h-7 p-1 relative flex items-center">
                    <div className="absolute h-5 rounded-full bg-gradient-to-r from-[#0071E3] to-[#34C759] shadow transition-all duration-1000 flex items-center px-3 text-white text-[10px] font-semibold" style={{ width: '33%', left: '0%' }}>
                      Meses 1 - 12 (Torre de Control + BIM)
                    </div>
                  </div>
                </div>

                {/* Barra Fase 2 */}
                <div className="grid grid-cols-4 items-center text-xs gap-2">
                  <span className="font-semibold">Fase 2: Trazabilidad & IA</span>
                  <div className="col-span-3 bg-black/5 dark:bg-white/5 rounded-full h-7 p-1 relative flex items-center">
                    <div className="absolute h-5 rounded-full bg-gradient-to-r from-[#0071E3] to-[#FF9500] shadow transition-all duration-1000 flex items-center px-3 text-white text-[10px] font-semibold" style={{ width: '33%', left: '33%' }}>
                      Meses 13 - 24 (App QR + Copiloto IA)
                    </div>
                  </div>
                </div>

                {/* Barra Fase 3 */}
                <div className="grid grid-cols-4 items-center text-xs gap-2">
                  <span className="font-semibold">Fase 3: Gobierno & Escala</span>
                  <div className="col-span-3 bg-black/5 dark:bg-white/5 rounded-full h-7 p-1 relative flex items-center">
                    <div className="absolute h-5 rounded-full bg-gradient-to-r from-[#0071E3] to-[#AF52DE] shadow transition-all duration-1000 flex items-center px-3 text-white text-[10px] font-semibold" style={{ width: '33%', left: '66%' }}>
                      Meses 25 - 36 (Consejo + Univ. Corporativa)
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-2 text-[11px] text-[#86868B]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" /> En curso / Hito</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0071E3]" /> En desarrollo WBS</span>
                </div>
              </div>
            </div>

          </section>
        )}
      </main>

      {/* Modal Pitch de Entrevista */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className={`max-w-xl w-full p-6 rounded-3xl border shadow-2xl ${cardBg} transform transition-all scale-100`}>
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <h3 className="text-base font-semibold">
                Guion Ejecutivo para tu Entrevista (Chief of Staff)
              </h3>
              <button
                onClick={() => setShowPitchModal(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs leading-relaxed">
              <p>
                <strong>1. Visión del Rol:</strong> "En una empresa con 35 años de liderazgo y dos plantas (Chihuahua con 1,500 Ton/mes y Cd. Juárez con 250 Ton/semana certificada por el SJI), el Chief of Staff no viene a enseñarles a soldar acero; viene a construir la <strong>Torre de Control</strong> que sincroniza Ingeniería, Planta y Montaje con la rentabilidad financiera."
              </p>
              <p>
                <strong>2. Conexión BIM → Piso → Obra:</strong> "Conectar las salidas de <em>Tekla Structures y Advance Steel</em> con trazabilidad QR por lote para eliminar el retrabajo en sitio y asegurar que nunca enviemos acero a una obra cuyas terracerías no están listas."
              </p>
              <p>
                <strong>3. WBS Actividad por Actividad:</strong> "Tenemos un plan estructurado en 3 fases de 36 meses, con hitos claros, asignación estricta de recursos (desde desarrolladores y analistas BI hasta soldadores certificados AWS) y tableros en tiempo real."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}