import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

const MY_CLUB = "Манчестер Сити"

const MY_PLAYERS = [
  { id: 1, name: "Эдерсон", position: "ВРТ", number: "31" },
  { id: 2, name: "Уокер", position: "ПЗ", number: "2" },
  { id: 3, name: "Рубен Диаш", position: "ЦЗ", number: "3" },
  { id: 4, name: "Аканджи", position: "ЦЗ", number: "25" },
  { id: 5, name: "Гвардиол", position: "ЛЗ", number: "24" },
  { id: 6, name: "Родри", position: "ОПЗ", number: "16" },
  { id: 7, name: "Де Брёйне", position: "ЦПЗ", number: "17" },
  { id: 8, name: "Бернарду Силва", position: "ЦПЗ", number: "20" },
  { id: 9, name: "Дуку", position: "ПВ", number: "11" },
  { id: 10, name: "Фил Фоден", position: "ЛВ", number: "47" },
  { id: 11, name: "Холанн", position: "НАП", number: "9" },
  { id: 12, name: "Матеуш Нуньеш", position: "ЦПЗ", number: "27" },
  { id: 13, name: "Ковачич", position: "ЦПЗ", number: "8" },
  { id: 14, name: "Флорентино Луиш", position: "ОПЗ", number: "35" },
  { id: 15, name: "Доку", position: "ЛВ", number: "11" },
  { id: 16, name: "Савиньо", position: "ПВ", number: "26" },
]

const COMPETITIONS = ["Лига чемпионов", "АПЛ", "Кубок Англии", "Кубок лиги", "Суперкубок"]

interface Goal {
  id: number
  minute: string
  playerId: number | null
  assistId: number | null
  type: "goal" | "own" | "penalty"
}

interface Card {
  id: number
  minute: string
  playerId: number | null
  type: "yellow" | "red"
}

interface Sub {
  id: number
  minute: string
  outId: number | null
  inId: number | null
}

export default function NewMatch() {
  const navigate = useNavigate()
  const [opponent, setOpponent] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [competition, setCompetition] = useState("АПЛ")
  const [isHome, setIsHome] = useState(true)
  const [scoreHome, setScoreHome] = useState(0)
  const [scoreAway, setScoreAway] = useState(0)
  const [goals, setGoals] = useState<Goal[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [subs, setSubs] = useState<Sub[]>([])
  const [notes, setNotes] = useState("")
  const [tab, setTab] = useState<"info" | "goals" | "cards" | "subs">("info")

  const myScore = isHome ? scoreHome : scoreAway
  const oppScore = isHome ? scoreAway : scoreHome
  const result = myScore > oppScore ? "W" : myScore < oppScore ? "L" : "D"
  const resultColor = result === "W" ? "text-green-400" : result === "L" ? "text-red-400" : "text-yellow-400"

  const addGoal = () => setGoals((g) => [...g, { id: Date.now(), minute: "", playerId: null, assistId: null, type: "goal" }])
  const removeGoal = (id: number) => setGoals((g) => g.filter((x) => x.id !== id))
  const updateGoal = (id: number, field: string, value: string | number | null) =>
    setGoals((g) => g.map((x) => (x.id === id ? { ...x, [field]: value } : x)))

  const addCard = () => setCards((c) => [...c, { id: Date.now(), minute: "", playerId: null, type: "yellow" }])
  const removeCard = (id: number) => setCards((c) => c.filter((x) => x.id !== id))
  const updateCard = (id: number, field: string, value: string | number | null) =>
    setCards((c) => c.map((x) => (x.id === id ? { ...x, [field]: value } : x)))

  const addSub = () => setSubs((s) => [...s, { id: Date.now(), minute: "", outId: null, inId: null }])
  const removeSub = (id: number) => setSubs((s) => s.filter((x) => x.id !== id))
  const updateSub = (id: number, field: string, value: string | number | null) =>
    setSubs((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)))

  const playerName = (id: number | null) => MY_PLAYERS.find((p) => p.id === id)?.name ?? "—"

  const TABS = [
    { key: "info", label: "Инфо", icon: "FileText" },
    { key: "goals", label: `Голы (${goals.length})`, icon: "CircleDot" },
    { key: "cards", label: `Карточки (${cards.length})`, icon: "Square" },
    { key: "subs", label: `Замены (${subs.length})`, icon: "ArrowLeftRight" },
  ] as const

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1a2e] to-[#0a0f1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(18,117,216,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(225,145,54,0.07)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md">
              <span className="font-sans text-xl font-bold text-foreground">C</span>
            </div>
            <span className="font-sans text-xl font-semibold tracking-tight text-foreground">CareerLog</span>
          </button>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-sm text-foreground/60 transition-colors hover:text-foreground">
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
        </nav>

        <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-16 md:px-12">
          <div className="mx-auto w-full max-w-2xl">

            {/* Score header */}
            <div className="mb-8 flex items-center justify-between gap-4">
              {/* My club */}
              <div className="flex flex-col items-center gap-2">
                <p className="font-sans text-sm font-medium text-foreground text-center">{MY_CLUB}</p>
                <p className="font-mono text-xs text-foreground/40">{isHome ? "Дома" : "В гостях"}</p>
                <div className="flex gap-1">
                  <button onClick={() => setScoreHome((s) => s + 1)} className="flex h-7 w-7 items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground transition-colors">
                    <Icon name="Plus" size={11} />
                  </button>
                  <button onClick={() => setScoreHome((s) => Math.max(0, s - 1))} className="flex h-7 w-7 items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground transition-colors">
                    <Icon name="Minus" size={11} />
                  </button>
                </div>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="font-sans text-5xl font-light tracking-tight text-foreground">
                  {scoreHome}<span className="text-foreground/30 mx-2">:</span>{scoreAway}
                </div>
                <div className={`mt-1 font-mono text-xs font-bold ${resultColor}`}>{result}</div>
              </div>

              {/* Opponent */}
              <div className="flex flex-col items-center gap-2">
                <p className="font-sans text-sm font-medium text-foreground text-center">{opponent || "Соперник"}</p>
                <p className="font-mono text-xs text-foreground/40">{isHome ? "В гостях" : "Дома"}</p>
                <div className="flex gap-1">
                  <button onClick={() => setScoreAway((s) => s + 1)} className="flex h-7 w-7 items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground transition-colors">
                    <Icon name="Plus" size={11} />
                  </button>
                  <button onClick={() => setScoreAway((s) => Math.max(0, s - 1))} className="flex h-7 w-7 items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground transition-colors">
                    <Icon name="Minus" size={11} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-0 border-b border-foreground/15">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2.5 font-mono text-xs transition-all duration-200 border-b-2 -mb-px ${
                    tab === t.key
                      ? "border-foreground text-foreground"
                      : "border-transparent text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Info */}
            {tab === "info" && (
              <div className="animate-in fade-in duration-300 space-y-5">
                <div>
                  <label className="mb-2 block font-mono text-xs text-foreground/50">Соперник</label>
                  <input
                    type="text"
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    placeholder="Название команды-соперника"
                    autoFocus
                    className="w-full border-b border-foreground/30 bg-transparent py-2 text-lg text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/50">Дата</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground focus:border-foreground/60 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/50">Поле</label>
                    <div className="flex gap-2 pt-1">
                      {["Дома", "В гостях"].map((h) => (
                        <button key={h} onClick={() => setIsHome(h === "Дома")}
                          className={`flex-1 border py-2 text-xs font-mono transition-all ${
                            (h === "Дома") === isHome ? "border-foreground/60 bg-foreground/10 text-foreground" : "border-foreground/15 text-foreground/50 hover:border-foreground/30"
                          }`}>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-xs text-foreground/50">Турнир</label>
                  <div className="flex flex-wrap gap-2">
                    {COMPETITIONS.map((c) => (
                      <button key={c} onClick={() => setCompetition(c)}
                        className={`border px-3 py-1.5 font-mono text-xs transition-all ${
                          competition === c ? "border-foreground/60 bg-foreground/10 text-foreground" : "border-foreground/15 text-foreground/50 hover:border-foreground/30"
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-xs text-foreground/50">Заметки</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ключевые моменты, тактика..."
                    className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Tab: Goals */}
            {tab === "goals" && (
              <div className="animate-in fade-in duration-300">
                <div className="min-h-[60px] space-y-3 mb-4">
                  {goals.length === 0 && (
                    <p className="py-6 text-center font-mono text-xs text-foreground/30">Голы не добавлены</p>
                  )}
                  {goals.map((g) => (
                    <div key={g.id} className="flex items-center gap-2 border border-foreground/10 bg-foreground/5 px-4 py-3">
                      <input
                        type="text"
                        value={g.minute}
                        onChange={(e) => updateGoal(g.id, "minute", e.target.value)}
                        placeholder="мин"
                        className="w-10 border-b border-foreground/20 bg-transparent text-center font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-foreground/50 focus:outline-none"
                      />
                      <span className="font-mono text-xs text-foreground/30">'</span>

                      <select
                        value={g.type}
                        onChange={(e) => updateGoal(g.id, "type", e.target.value)}
                        className="border-b border-foreground/20 bg-transparent font-mono text-xs text-foreground/70 focus:border-foreground/50 focus:outline-none"
                      >
                        <option value="goal" className="bg-background">Гол</option>
                        <option value="penalty" className="bg-background">Пенальти</option>
                        <option value="own" className="bg-background">Автогол</option>
                      </select>

                      <select
                        value={g.playerId ?? ""}
                        onChange={(e) => updateGoal(g.id, "playerId", e.target.value ? Number(e.target.value) : null)}
                        className="flex-1 border-b border-foreground/20 bg-transparent font-sans text-sm text-foreground focus:border-foreground/50 focus:outline-none"
                      >
                        <option value="" className="bg-background">Автор гола</option>
                        {MY_PLAYERS.map((p) => (
                          <option key={p.id} value={p.id} className="bg-background">{p.name} ({p.position})</option>
                        ))}
                      </select>

                      <select
                        value={g.assistId ?? ""}
                        onChange={(e) => updateGoal(g.id, "assistId", e.target.value ? Number(e.target.value) : null)}
                        className="flex-1 border-b border-foreground/20 bg-transparent font-sans text-sm text-foreground/60 focus:border-foreground/50 focus:outline-none"
                      >
                        <option value="" className="bg-background">Ассист</option>
                        {MY_PLAYERS.map((p) => (
                          <option key={p.id} value={p.id} className="bg-background">{p.name}</option>
                        ))}
                      </select>

                      <button onClick={() => removeGoal(g.id)} className="text-foreground/30 hover:text-foreground/70 transition-colors">
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addGoal} className="flex w-full items-center justify-center gap-2 border border-dashed border-foreground/20 py-3 font-mono text-xs text-foreground/50 transition-all hover:border-foreground/40 hover:text-foreground/80">
                  <Icon name="Plus" size={12} /> Добавить гол
                </button>
              </div>
            )}

            {/* Tab: Cards */}
            {tab === "cards" && (
              <div className="animate-in fade-in duration-300">
                <div className="min-h-[60px] space-y-3 mb-4">
                  {cards.length === 0 && (
                    <p className="py-6 text-center font-mono text-xs text-foreground/30">Карточки не добавлены</p>
                  )}
                  {cards.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 border border-foreground/10 bg-foreground/5 px-4 py-3">
                      <input
                        type="text"
                        value={c.minute}
                        onChange={(e) => updateCard(c.id, "minute", e.target.value)}
                        placeholder="мин"
                        className="w-10 border-b border-foreground/20 bg-transparent text-center font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-foreground/50 focus:outline-none"
                      />
                      <span className="font-mono text-xs text-foreground/30">'</span>

                      <div className="flex gap-1">
                        {(["yellow", "red"] as const).map((type) => (
                          <button key={type} onClick={() => updateCard(c.id, "type", type)}
                            className={`h-5 w-3.5 rounded-sm border transition-all ${
                              c.type === type
                                ? type === "yellow" ? "border-yellow-400 bg-yellow-400" : "border-red-500 bg-red-500"
                                : "border-foreground/20 bg-foreground/10"
                            }`}
                          />
                        ))}
                      </div>

                      <select
                        value={c.playerId ?? ""}
                        onChange={(e) => updateCard(c.id, "playerId", e.target.value ? Number(e.target.value) : null)}
                        className="flex-1 border-b border-foreground/20 bg-transparent font-sans text-sm text-foreground focus:border-foreground/50 focus:outline-none"
                      >
                        <option value="" className="bg-background">Игрок</option>
                        {MY_PLAYERS.map((p) => (
                          <option key={p.id} value={p.id} className="bg-background">{p.name} ({p.position})</option>
                        ))}
                      </select>

                      <button onClick={() => removeCard(c.id)} className="text-foreground/30 hover:text-foreground/70 transition-colors">
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addCard} className="flex w-full items-center justify-center gap-2 border border-dashed border-foreground/20 py-3 font-mono text-xs text-foreground/50 transition-all hover:border-foreground/40 hover:text-foreground/80">
                  <Icon name="Plus" size={12} /> Добавить карточку
                </button>
              </div>
            )}

            {/* Tab: Subs */}
            {tab === "subs" && (
              <div className="animate-in fade-in duration-300">
                <div className="min-h-[60px] space-y-3 mb-4">
                  {subs.length === 0 && (
                    <p className="py-6 text-center font-mono text-xs text-foreground/30">Замены не добавлены</p>
                  )}
                  {subs.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 border border-foreground/10 bg-foreground/5 px-4 py-3">
                      <input
                        type="text"
                        value={s.minute}
                        onChange={(e) => updateSub(s.id, "minute", e.target.value)}
                        placeholder="мин"
                        className="w-10 border-b border-foreground/20 bg-transparent text-center font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-foreground/50 focus:outline-none"
                      />
                      <span className="font-mono text-xs text-foreground/30">'</span>

                      <div className="flex flex-1 items-center gap-2">
                        <select
                          value={s.outId ?? ""}
                          onChange={(e) => updateSub(s.id, "outId", e.target.value ? Number(e.target.value) : null)}
                          className="flex-1 border-b border-foreground/20 bg-transparent font-sans text-sm text-red-400/80 focus:border-foreground/50 focus:outline-none"
                        >
                          <option value="" className="bg-background text-foreground">Уходит</option>
                          {MY_PLAYERS.map((p) => (
                            <option key={p.id} value={p.id} className="bg-background text-foreground">{p.name}</option>
                          ))}
                        </select>

                        <Icon name="ArrowLeftRight" size={12} className="text-foreground/30 shrink-0" />

                        <select
                          value={s.inId ?? ""}
                          onChange={(e) => updateSub(s.id, "inId", e.target.value ? Number(e.target.value) : null)}
                          className="flex-1 border-b border-foreground/20 bg-transparent font-sans text-sm text-green-400/80 focus:border-foreground/50 focus:outline-none"
                        >
                          <option value="" className="bg-background text-foreground">Выходит</option>
                          {MY_PLAYERS.map((p) => (
                            <option key={p.id} value={p.id} className="bg-background text-foreground">{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <button onClick={() => removeSub(s.id)} className="text-foreground/30 hover:text-foreground/70 transition-colors">
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addSub} className="flex w-full items-center justify-center gap-2 border border-dashed border-foreground/20 py-3 font-mono text-xs text-foreground/50 transition-all hover:border-foreground/40 hover:text-foreground/80">
                  <Icon name="Plus" size={12} /> Добавить замену
                </button>
              </div>
            )}

            {/* Summary bar */}
            <div className="mt-8 flex items-center gap-3 border-t border-foreground/10 pt-6">
              <div className="flex-1 space-y-0.5">
                <p className="font-sans text-sm text-foreground">
                  {MY_CLUB} {scoreHome}:{scoreAway} {opponent || "Соперник"}
                </p>
                <p className="font-mono text-xs text-foreground/40">
                  {competition} · {date} · {goals.filter(g => g.type !== "own").map(g => playerName(g.playerId)).filter(Boolean).join(", ") || "Голов нет"}
                </p>
              </div>
              <MagneticButton variant="primary" size="lg" onClick={() => navigate("/")}>
                Сохранить
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}