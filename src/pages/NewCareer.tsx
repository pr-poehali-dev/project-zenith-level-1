import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

const SIMULATORS = ["Football Manager 2024", "EA FC 25", "eFootball 2024"]

const LEAGUES: Record<string, string[]> = {
  "Football Manager 2024": ["АПЛ", "Ла Лига", "Бундеслига", "Серия А", "Лига 1", "РПЛ", "Другая"],
  "EA FC 25": ["АПЛ", "Ла Лига", "Бундеслига", "Серия А", "Лига 1", "РПЛ", "Другая"],
  "eFootball 2024": ["АПЛ", "Ла Лига", "Бундеслига", "Серия А", "Лига 1", "РПЛ", "Другая"],
}

export default function NewCareer() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    simulator: "",
    club: "",
    league: "",
    season: "2024/25",
    notes: "",
  })

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const canNext = () => {
    if (step === 1) return !!form.simulator
    if (step === 2) return !!form.club && !!form.league
    return true
  }

  const handleSubmit = () => {
    navigate("/")
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1a2e] to-[#0a0f1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(18,117,216,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(225,145,54,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md">
              <span className="font-sans text-xl font-bold text-foreground">C</span>
            </div>
            <span className="font-sans text-xl font-semibold tracking-tight text-foreground">CareerLog</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-mono text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
        </nav>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg">
            {/* Progress */}
            <div className="mb-10 flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs transition-all duration-300 ${
                      s === step
                        ? "border-foreground bg-foreground text-background"
                        : s < step
                        ? "border-foreground/50 bg-foreground/10 text-foreground/70"
                        : "border-foreground/20 text-foreground/30"
                    }`}
                  >
                    {s < step ? <Icon name="Check" size={12} /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-px w-12 transition-all duration-500 ${
                        s < step ? "bg-foreground/50" : "bg-foreground/15"
                      }`}
                    />
                  )}
                </div>
              ))}
              <span className="ml-2 font-mono text-xs text-foreground/40">
                {step === 1 ? "Симулятор" : step === 2 ? "Клуб" : "Детали"}
              </span>
            </div>

            {/* Step 1 — Симулятор */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                  Выбери симулятор
                </h1>
                <p className="mb-8 font-mono text-sm text-foreground/50">/ В какой игре ведётся карьера?</p>

                <div className="space-y-3">
                  {SIMULATORS.map((sim) => (
                    <button
                      key={sim}
                      onClick={() => set("simulator", sim)}
                      className={`group w-full border px-6 py-4 text-left transition-all duration-200 ${
                        form.simulator === sim
                          ? "border-foreground/60 bg-foreground/10"
                          : "border-foreground/15 bg-foreground/5 hover:border-foreground/30 hover:bg-foreground/8"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-lg font-light text-foreground">{sim}</span>
                        {form.simulator === sim && (
                          <Icon name="Check" size={16} className="text-foreground/70" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Клуб и лига */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                  Клуб и лига
                </h1>
                <p className="mb-8 font-mono text-sm text-foreground/50">/ За какой клуб играешь?</p>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/50">Название клуба</label>
                    <input
                      type="text"
                      value={form.club}
                      onChange={(e) => set("club", e.target.value)}
                      placeholder="Например: Манчестер Сити"
                      className="w-full border-b border-foreground/30 bg-transparent py-2 text-lg text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-3 block font-mono text-xs text-foreground/50">Лига</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(LEAGUES[form.simulator] ?? []).map((lg) => (
                        <button
                          key={lg}
                          onClick={() => set("league", lg)}
                          className={`border px-4 py-2.5 text-left transition-all duration-200 ${
                            form.league === lg
                              ? "border-foreground/60 bg-foreground/10 text-foreground"
                              : "border-foreground/15 bg-foreground/5 text-foreground/70 hover:border-foreground/30"
                          }`}
                        >
                          <span className="font-sans text-sm">{lg}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Сезон и заметки */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                  Детали
                </h1>
                <p className="mb-8 font-mono text-sm text-foreground/50">/ Последний штрих</p>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/50">Сезон</label>
                    <input
                      type="text"
                      value={form.season}
                      onChange={(e) => set("season", e.target.value)}
                      placeholder="2024/25"
                      className="w-full border-b border-foreground/30 bg-transparent py-2 text-lg text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/50">Заметки (необязательно)</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      placeholder="Цели на сезон, трансферные планы..."
                      className="w-full border-b border-foreground/30 bg-transparent py-2 text-base text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="border border-foreground/15 bg-foreground/5 p-5 space-y-2">
                    <p className="font-mono text-xs text-foreground/40 mb-3">/ Сводка карьеры</p>
                    {[
                      { label: "Симулятор", value: form.simulator },
                      { label: "Клуб", value: form.club },
                      { label: "Лига", value: form.league },
                      { label: "Сезон", value: form.season },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="font-mono text-xs text-foreground/50">{label}</span>
                        <span className="font-sans text-sm text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex items-center gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="font-mono text-sm text-foreground/50 transition-colors hover:text-foreground"
                >
                  ← Назад
                </button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <MagneticButton
                  variant="primary"
                  size="lg"
                  onClick={() => canNext() && setStep((s) => s + 1)}
                >
                  Далее
                </MagneticButton>
              ) : (
                <MagneticButton variant="primary" size="lg" onClick={handleSubmit}>
                  Создать карьеру
                </MagneticButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
