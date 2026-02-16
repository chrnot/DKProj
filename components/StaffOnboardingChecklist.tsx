import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

interface ChecklistSection {
  title: string;
  subtitle?: string;
  items: ChecklistItem[];
}

const onboardingSections: ChecklistSection[] = [
  {
    title: "1. Grundläggande administration",
    subtitle: "Vecka -2",
    items: [
      { id: "contract", label: "Anställningsavtal", description: "Signerat och registrerat i Personec/HR-system." },
      { id: "edlevo_base", label: "Edlevo", description: "Medarbetaren kopplad till rätt skolenhet (VDS, Stocksund etc.). Detta är triggern för övriga system." },
      { id: "it_account", label: "IT-konto", description: "Aktivering av danderyd.se-konto och e-postadress." },
      { id: "google_account", label: "Google-konto", description: "Skol-IT" }
    ]
  },
  {
    title: "2. Systembehörigheter",
    subtitle: "Vecka -1",
    items: [
      { id: "prorenata_req", label: "Prorenata (Journalsystem)", description: "Beställning skickad till systemförvaltare (t.ex. Razia). Ange korrekt yrkesroll." },
      { id: "edlevo_role", label: "Edlevo/Schoolsoft", description: "Tilldelning av pedagogisk/administrativ roll för de specifika skolenheterna." },
      { id: "google_drive", label: "Google Drive", description: "Inbjudan till relevanta 'Delade enheter' (t.ex. Elevhälsa [Skolnamn])." },
      { id: "distribution_lists", label: "Distributionslistor", description: "Tillägg i relevanta mailgrupper (Lärarlag, EHT, Centrala EHT)." }
    ]
  },
  {
    title: "3. På plats start",
    subtitle: "Dag 1",
    items: [
      { id: "keys", label: "Passerkort/Nycklar", description: "Kvittering av fysisk access." },
      { id: "confidentiality", label: "Sekretessförbindelse", description: "Genomgång av lokala rutiner för tystnadsplikt och känsliga personuppgifter." },
      { id: "equipment", label: "Utrustning", description: "Utlämning av dator och i vissa fall telefon." }
    ]
  }
];

const offboardingSections: ChecklistSection[] = [
  {
    title: "1. Avslut av access",
    subtitle: "Senast sista arbetsdag",
    items: [
      { id: "off_prorenata", label: "Prorenata", description: "Inaktivering av användarkonto för att förhindra efteråtkomst." },
      { id: "off_google", label: "Google Drive", description: "Borttagning från delade enheter. Kontrollera ägarskap av dokument." },
      { id: "off_edlevo", label: "Edlevo/Schoolsoft", description: "Avslut av placering på den specifika skolenheten." },
      { id: "off_lists", label: "Distributionslistor", description: "Borttagning från mailgrupper." }
    ]
  },
  {
    title: "2. Återtagande av resurser",
    items: [
      { id: "off_hardware", label: "Hårdvara", description: "Inlämning av dator, laddare och telefon." },
      { id: "off_keys", label: "Nycklar och passerkort", description: "Avaktivering och inlämning av fysiska nycklar." }
    ]
  }
];

const StaffOnboardingChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'onboarding' | 'offboarding'>('onboarding');

  useEffect(() => {
    const saved = localStorage.getItem('staff_checklist_state');
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, []);

  const toggleItem = (id: string) => {
    const newItems = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newItems);
    localStorage.setItem('staff_checklist_state', JSON.stringify(newItems));
  };

  const resetChecklist = () => {
    if (window.confirm("Vill du rensa alla bockar i checklistan?")) {
      setCheckedItems({});
      localStorage.removeItem('staff_checklist_state');
    }
  };

  const calculateProgress = (sections: ChecklistSection[]) => {
    const allIds = sections.flatMap(s => s.items.map(i => i.id));
    const completedCount = allIds.filter(id => checkedItems[id]).length;
    return Math.round((completedCount / allIds.length) * 100) || 0;
  };

  const currentSections = activeTab === 'onboarding' ? onboardingSections : offboardingSections;
  const progress = calculateProgress(currentSections);

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fadeIn px-4 space-y-8">
      {/* Header & Controls */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-blue-600 text-white rounded-xl">📋</span>
            Systemchecklista Personal
          </h1>
          <p className="text-slate-500 font-medium mt-1">Hantera behörigheter och resurser vid in- och utcheckning.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Skriv ut
          </button>
          <button 
            onClick={resetChecklist}
            className="px-4 py-2 bg-white border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            Nollställ
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl no-print">
        <button 
          onClick={() => setActiveTab('onboarding')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'onboarding' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          DEL 1: Onboarding
        </button>
        <button 
          onClick={() => setActiveTab('offboarding')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'offboarding' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          DEL 2: Offboarding
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Print Header */}
        <div className="hidden print:block p-12 text-center border-b-2 border-slate-900">
          <h1 className="text-2xl font-bold uppercase tracking-widest">Checklista system för {activeTab === 'onboarding' ? 'ny personal' : 'avslut av tjänst'}</h1>
          <div className="mt-4 flex justify-between text-xs font-bold uppercase">
            <span>Danderyds Kommun</span>
            <span>Skola / Enhet: _______________________</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-8 bg-blue-50/50 border-b border-blue-100 flex flex-col md:flex-row gap-8 print:bg-transparent print:border-slate-200">
          <div className="flex-1 space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Ansvarig</h3>
            <ul className="text-sm font-bold text-slate-700 space-y-1 italic">
              <li>• Elevhälsochef</li>
              <li>• Skoladministratör / Intendent</li>
            </ul>
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl border border-blue-100 print:border-slate-200">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Grundregel</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Inga rättigheter delas ut förrän anställningen är korrekt registrerad i <span className="font-bold text-slate-900 underline">Edlevo/Personec</span>.
            </p>
          </div>
          <div className="flex-1 text-right no-print">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Status</h3>
            <div className="inline-flex items-center gap-3">
              <span className="text-2xl font-black text-slate-900">{progress}%</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Sections */}
        <div className="p-8 md:p-12 space-y-12">
          {currentSections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-6">
              <div className="flex items-end justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                {section.subtitle && (
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-3 py-1 rounded-full mb-1">
                    {section.subtitle}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {section.items.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`group flex items-start gap-5 p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                      checkedItems[item.id] 
                      ? 'bg-blue-50/30 border-blue-200' 
                      : 'bg-white border-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`mt-1 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                      checkedItems[item.id] 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-slate-200 bg-slate-50 group-hover:border-blue-300'
                    }`}>
                      {checkedItems[item.id] && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <div>
                      <h4 className={`font-bold transition-colors ${checkedItems[item.id] ? 'text-blue-900' : 'text-slate-900'}`}>{item.label}</h4>
                      {item.description && (
                        <p className={`text-sm mt-1 leading-relaxed ${checkedItems[item.id] ? 'text-blue-700/70' : 'text-slate-500'}`}>{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Print Footer Area */}
        <div className="hidden print:grid grid-cols-2 gap-12 p-12 border-t-2 border-slate-100">
           <div className="space-y-8">
              <div className="border-b border-slate-900 pb-1">
                <p className="text-[9px] font-bold uppercase text-slate-400">Signatur Ansvarig</p>
              </div>
              <div className="border-b border-slate-900 pb-1">
                <p className="text-[9px] font-bold uppercase text-slate-400">Namnförtydligande</p>
              </div>
           </div>
           <div className="space-y-8">
              <div className="border-b border-slate-900 pb-1">
                <p className="text-[9px] font-bold uppercase text-slate-400">Datum</p>
              </div>
              <div className="pt-4">
                <p className="text-[10px] font-medium text-slate-600 italic leading-relaxed">
                  Detta dokument ska arkiveras enligt gällande gallringsrutiner vid respektive enhet.
                </p>
              </div>
           </div>
        </div>
      </div>

      <footer className="text-center no-print">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Checklista v1.0 &bull; Danderyds Kommun</p>
      </footer>
    </div>
  );
};

export default StaffOnboardingChecklist;