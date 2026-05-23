import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

const SIMULATORS = ["Football Manager 2024", "EA FC 25", "eFootball 2024"]

const LEAGUES = ["АПЛ", "Ла Лига", "Бундеслига", "Серия А", "Лига 1", "РПЛ", "Эредивизи", "Примейра Лига", "Другая"]

const ALL_CLUBS = [
  "Манчестер Сити", "Манчестер Юнайтед", "Ливерпуль", "Арсенал", "Челси", "Тоттенхэм",
  "Ньюкасл", "Астон Вилла", "Вест Хэм", "Брайтон", "Бrentford", "Фулхэм",
  "Реал Мадрид", "Барселона", "Атлетико Мадрид", "Севилья", "Вильяреал", "Реал Сосьедад",
  "Бетис", "Валенсия", "Осасуна", "Жирона",
  "Бавария Мюнхен", "Боруссия Дортмунд", "РБ Лейпциг", "Байер Леверкузен", "Айнтрахт Франкфурт",
  "Вольфсбург", "Фрайбург", "Гладбах", "Унион Берлин",
  "Ювентус", "Интер", "Милан", "Наполи", "Рома", "Лацио", "Аталанта", "Фиорентина", "Торино",
  "ПСЖ", "Марсель", "Лион", "Монако", "Лилль", "Ренн", "Ницца", "Страсбур",
  "Зенит", "ЦСКА", "Спартак", "Локомотив", "Динамо Москва", "Краснодар",
  "Аякс", "ПСВ", "Фейеноорд", "АЗ Алкмар",
  "Порту", "Бенфика", "Спортинг",
  "Селтик", "Рейнджерс",
  "Шахтёр Донецк", "Динамо Киев",
  "Галатасарай", "Фенербахче", "Бешикташ",
  "Аль-Хиляль", "Аль-Насер", "Аль-Иттихад",
]

const POSITIONS = ["ВРТ", "ЗЩ", "ЦЗ", "ЛЗ", "ПЗ", "ОПЗ", "ЦПЗ", "ЛПЗ", "ЛАМ", "ПАМ", "АМ", "ЛВ", "ПВ", "НАП", "ЦНА"]

interface Player {
  id: number
  name: string
  position: string
  number: string
}

export default function NewCareer() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ simulator: "", club: "", league: "", season: "2024/25", notes: "" })
  const [clubQuery, setClubQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayer, setNewPlayer] = useState({ name: "", position: "НАП", number: "" })
  const clubRef = useRef<HTMLDivElement>(null)

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const suggestions = clubQuery.length >= 1
    ? ALL_CLUBS.filter((c) => c.toLowerCase().includes(clubQuery.toLowerCase())).slice(0, 6)
    : []

  const selectClub = (club: string) => {
    set("club", club)
    setClubQuery(club)
    setShowSuggestions(false)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (clubRef.current && !clubRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const addPlayer = () => {
    if (!newPlayer.name.trim()) return
    setPlayers((p) => [...p, { ...newPlayer, id: Date.now() }])
    setNewPlayer({ name: "", position: "НАП", number: "" })
  }

  const removePlayer = (id: number) => setPlayers((p) => p.filter((pl) => pl.id !== id))

  const canNext = () => {
    if (step === 1) return !!form.simulator
    if (step === 2) return !!form.club && !!form.league
    return true
  }

  const STEPS = ["Симулятор", "Клуб", "Состав"]

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1a2e] to-[#0a0f1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(18,117,216,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(225,145,54,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 flex h-screen flex-col overflow-hidden">
        <nav className="flex items-center justify-between px-6 py-6 md:px-12">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md">
              <span className="font-sans text-xl font-bold text-foreground">C</span>
            </div>
            <span className="font-sans text-xl font-semibold tracking-tight text-foreground">CareerLog</span>
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-2 font-mono text-sm text-foreground/60 transition-colors hover:text-foreground">
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
        </nav>

        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-8 pb-16">
          <div className="w-full max-w-lg">
            {/* Progress */}
            <div className="mb-10 flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs transition-all duration-300 ${
                    s === step ? "border-foreground bg-foreground text-background"
                    : s < step ? "border-foreground/50 bg-foreground/10 text-foreground/70"
                    : "border-foreground/20 text-foreground/30"
                  }`}>
                    {s < step ? <Icon name="Check" size={12} /> : s}
                  </div>
                  {s < 3 && <div className={`h-px w-12 transition-all duration-500 ${s < step ? "bg-foreground/50" : "bg-foreground/15"}`} />}
                </div>
              ))}
              <span className="ml-2 font-mono text-xs text-foreground/40">{STEPS[step - 1]}</span>
            </div>

            {/* Step 1 — Симулятор */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">Выбери симулятор</h1>
                <p className="mb-8 font-mono text-sm text-foreground/50">/ В какой игре ведётся карьера?</p>
                <div className="space-y-3">
                  {SIMULATORS.map((sim) => (
                    <button key={sim} onClick={() => set("simulator", sim)}
                      className={`group w-full border px-6 py-4 text-left transition-all duration-200 ${
                        form.simulator === sim ? "border-foreground/60 bg-foreground/10" : "border-foreground/15 bg-foreground/5 hover:border-foreground/30"
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-lg font-light text-foreground">{sim}</span>
                        {form.simulator === sim && <Icon name="Check" size={16} className="text-foreground/70" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Клуб и лига */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">Клуб и лига</h1>
                <p className="mb-8 font-mono text-sm text-foreground/50">/ За какой клуб играешь?</p>
                <div className="space-y-6">
                  {/* Club autocomplete */}
                  <div ref={clubRef} className="relative">
                    <label className="mb-2 block font-mono text-xs text-foreground/50">Название клуба</label>
                    <input
                      type="text"
                      value={clubQuery}
                      autoFocus
                      onChange={(e) => { setClubQuery(e.target.value); set("club", e.target.value); setShowSuggestions(true) }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Начни вводить или выбери из списка"
                      className="w-full border-b border-foreground/30 bg-transparent py-2 text-lg text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 border border-foreground/20 bg-background/95 backdrop-blur-md">
                        {suggestions.map((club) => (
                          <button key={club} onMouseDown={() => selectClub(club)}
                            className="w-full px-4 py-2.5 text-left font-sans text-sm text-foreground/80 transition-colors hover:bg-foreground/10 hover:text-foreground">
                            {club}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* League */}
                  <div>
                    <label className="mb-3 block font-mono text-xs text-foreground/50">Лига</label>
                    <div className="grid grid-cols-3 gap-2">
                      {LEAGUES.map((lg) => (
                        <button key={lg} onClick={() => set("league", lg)}
                          className={`border px-3 py-2.5 text-left transition-all duration-200 ${
                            form.league === lg ? "border-foreground/60 bg-foreground/10 text-foreground" : "border-foreground/15 bg-foreground/5 text-foreground/70 hover:border-foreground/30"
                          }`}>
                          <span className="font-sans text-sm">{lg}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Season */}
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/50">Сезон</label>
                    <input
                      type="text"
                      value={form.season}
                      onChange={(e) => set("season", e.target.value)}
                      placeholder="2024/25"
                      className="w-full border-b border-foreground/30 bg-transparent py-2 text-lg text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Состав */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">Состав</h1>
                <p className="mb-6 font-mono text-sm text-foreground/50">/ Добавь игроков своего клуба</p>

                {/* Add player row */}
                <form
                  onSubmit={(e) => { e.preventDefault(); addPlayer() }}
                  className="mb-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Имя игрока"
                    className="flex-1 border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                  />
                  <select
                    value={newPlayer.position}
                    onChange={(e) => setNewPlayer((p) => ({ ...p, position: e.target.value }))}
                    className="border-b border-foreground/30 bg-transparent py-2 font-mono text-xs text-foreground/70 focus:border-foreground/60 focus:outline-none"
                  >
                    {POSITIONS.map((pos) => <option key={pos} value={pos} className="bg-background">{pos}</option>)}
                  </select>
                  <input
                    type="text"
                    value={newPlayer.number}
                    onChange={(e) => setNewPlayer((p) => ({ ...p, number: e.target.value }))}
                    placeholder="#"
                    className="w-10 border-b border-foreground/30 bg-transparent py-2 text-center font-mono text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                  />
                  <button type="submit" className="flex h-8 w-8 items-center justify-center border border-foreground/30 text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground self-end">
                    <Icon name="Plus" size={14} />
                  </button>
                </form>

                {/* Players list */}
                {players.length > 0 ? (
                  <div className="mb-4 max-h-52 space-y-1 overflow-y-auto">
                    {players.map((pl) => (
                      <div key={pl.id} className="flex items-center justify-between border border-foreground/10 bg-foreground/5 px-4 py-2.5">
                        <div className="flex items-center gap-4">
                          {pl.number && <span className="w-5 font-mono text-xs text-foreground/40">#{pl.number}</span>}
                          <span className="font-sans text-sm text-foreground">{pl.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-foreground/50">{pl.position}</span>
                          <button onClick={() => removePlayer(pl.id)} className="text-foreground/30 transition-colors hover:text-foreground/70">
                            <Icon name="X" size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-4 border border-dashed border-foreground/15 py-6 text-center">
                    <p className="font-mono text-xs text-foreground/30">Игроки ещё не добавлены</p>
                  </div>
                )}

                <p className="mb-4 font-mono text-xs text-foreground/30">Можно пропустить и добавить позже</p>

                {/* Summary */}
                <div className="border border-foreground/15 bg-foreground/5 p-4 space-y-1.5">
                  <p className="font-mono text-xs text-foreground/40 mb-2">/ Сводка</p>
                  {[
                    { label: "Симулятор", value: form.simulator },
                    { label: "Клуб", value: form.club },
                    { label: "Лига", value: form.league },
                    { label: "Сезон", value: form.season },
                    { label: "Игроков", value: players.length > 0 ? `${players.length}` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="font-mono text-xs text-foreground/50">{label}</span>
                      <span className="font-sans text-sm text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center gap-4">
              {step > 1 && (
                <button onClick={() => setStep((s) => s - 1)} className="font-mono text-sm text-foreground/50 transition-colors hover:text-foreground">
                  ← Назад
                </button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <MagneticButton variant="primary" size="lg" onClick={() => canNext() && setStep((s) => s + 1)}>
                  Далее
                </MagneticButton>
              ) : (
                <MagneticButton variant="primary" size="lg" onClick={() => navigate("/")}>
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