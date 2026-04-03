"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  title: string
  stage: "Backlog" | "Todo" | "In Progress" | "Review" | "Done"
  priority: "Low" | "Medium" | "High"
  type: "Content" | "Marketing" | "Dev" | "Bug Fix" | "Automation" | "AI"
}

/** Convex `exams` row mapped for admin UI */
type AdminExam = {
  slug: string
  title: string
  questions: number
  color: string
}

type UploadItem = {
  id: string
  examSlug: string
  examTitle: string
  source: "Doc" | "PDF" | "Text" | "Link" | "Image" | "File"
  name: string
  size?: number
  textPreview?: string
  isDuplicate: boolean
}

type PendingUpload = Omit<UploadItem, "id" | "examSlug" | "examTitle" | "isDuplicate">

type UploadQueueItem = {
  id: string
  name: string
  progress: number
}

type GoalMetric = {
  id: string
  title: string
  target: number
  current: number
  source: "Convex" | "Clerk" | "Clerk Billing" | "Manual"
  unit?: string
}

type ClerkMetricsApiResponse = {
  dau: number
  wau: number
  mau: number
  mrr: number
}

function formatDateTime(iso: string | null) {
  if (!iso) {
    return "Not yet synced"
  }
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
  } catch {
    return iso
  }
}

function mapTaskDoc(doc: Doc<"adminTasks">): Task {
  return {
    id: doc._id,
    title: doc.title,
    stage: doc.stage as Task["stage"],
    priority: doc.priority as Task["priority"],
    type: doc.type as Task["type"],
  }
}

function mapUploadDoc(doc: Doc<"adminUploads">): UploadItem {
  return {
    id: doc._id,
    examSlug: doc.examSlug,
    examTitle: doc.examTitle,
    source: doc.source as UploadItem["source"],
    name: doc.name,
    size: doc.size,
    textPreview: doc.textPreview,
    isDuplicate: doc.isDuplicate,
  }
}

const stages: Task["stage"][] = ["Backlog", "Todo", "In Progress", "Review", "Done"]
const stageColors: Record<Task["stage"], string> = {
  Backlog: "bg-slate-400",
  Todo: "bg-sky-500",
  "In Progress": "bg-amber-500",
  Review: "bg-violet-500",
  Done: "bg-emerald-500",
}

const priorityClasses: Record<Task["priority"], string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-rose-200 bg-rose-50 text-rose-700",
}

const taskTypeClasses: Record<Task["type"], string> = {
  Content: "border-blue-200 bg-blue-50 text-blue-700",
  Marketing: "border-pink-200 bg-pink-50 text-pink-700",
  Dev: "border-indigo-200 bg-indigo-50 text-indigo-700",
  "Bug Fix": "border-red-200 bg-red-50 text-red-700",
  Automation: "border-purple-200 bg-purple-50 text-purple-700",
  AI: "border-teal-200 bg-teal-50 text-teal-700",
}

const taskTypes: Task["type"][] = ["Content", "Marketing", "Dev", "Bug Fix", "Automation", "AI"]

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [newExamTitle, setNewExamTitle] = useState("")
  const [createExamBusy, setCreateExamBusy] = useState(false)
  const [createExamError, setCreateExamError] = useState<string | null>(null)
  const [bootstrapBusy, setBootstrapBusy] = useState(false)
  const [bootstrapMessage, setBootstrapMessage] = useState<string | null>(null)
  const convexExamsRaw = useQuery(api.exams.list)
  const convexTasksRaw = useQuery(api.adminTasks.list)
  const convexUploadsRaw = useQuery(api.adminUploads.list)
  const createExam = useMutation(api.exams.create)
  const createTaskMutation = useMutation(api.adminTasks.create)
  const addUploadsBatch = useMutation(api.adminUploads.addBatch)
  const bootstrapAdmin = useMutation(api.adminBootstrap.bootstrap)

  const exams = useMemo((): AdminExam[] => {
    if (!convexExamsRaw) {
      return []
    }
    return convexExamsRaw.map((row) => ({
      slug: row.slug,
      title: row.name,
      questions: row.questions,
      color: row.color,
    }))
  }, [convexExamsRaw])

  const examsLoading = convexExamsRaw === undefined
  const tasksLoading = convexTasksRaw === undefined
  const uploadsLoading = convexUploadsRaw === undefined

  const tasks = useMemo((): Task[] => {
    if (!convexTasksRaw) {
      return []
    }
    return convexTasksRaw.map(mapTaskDoc)
  }, [convexTasksRaw])

  const uploads = useMemo((): UploadItem[] => {
    if (!convexUploadsRaw) {
      return []
    }
    return convexUploadsRaw.map(mapUploadDoc)
  }, [convexUploadsRaw])

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isExamPickerOpen, setIsExamPickerOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskStage, setTaskStage] = useState<Task["stage"]>("Backlog")
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("Medium")
  const [taskType, setTaskType] = useState<Task["type"]>("Content")
  const [inlineTaskText, setInlineTaskText] = useState<Record<Task["stage"], string>>({
    Backlog: "",
    Todo: "",
    "In Progress": "",
    Review: "",
    Done: "",
  })
  const [inlineTaskType, setInlineTaskType] = useState<Record<Task["stage"], Task["type"]>>({
    Backlog: "Content",
    Todo: "Content",
    "In Progress": "Content",
    Review: "Content",
    Done: "Content",
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])
  const [selectedExamForUploads, setSelectedExamForUploads] = useState("")
  const [uploadAssignMode, setUploadAssignMode] = useState<"single" | "multiple">("single")
  const [perItemExamSelections, setPerItemExamSelections] = useState<string[]>([])
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])
  const [uploadSearch, setUploadSearch] = useState("")
  const [goals, setGoals] = useState<GoalMetric[]>([
    { id: "g1", title: "Active Medical Exams", target: 200, current: 0, source: "Convex", unit: "exams" },
    { id: "g2", title: "Daily Active Users", target: 3000, current: 0, source: "Clerk", unit: "users" },
    { id: "g3", title: "Weekly Active Users", target: 12000, current: 0, source: "Clerk", unit: "users" },
    { id: "g4", title: "Monthly Active Users", target: 50000, current: 0, source: "Clerk", unit: "users" },
    { id: "g5", title: "MRR", target: 25000, current: 0, source: "Clerk Billing", unit: "usd" },
    { id: "g6", title: "Questions Per Exam", target: 5000, current: 0, source: "Convex", unit: "questions" },
  ])
  const [selectedGoalDetail, setSelectedGoalDetail] = useState<GoalMetric | null>(null)
  const [isGoalDetailOpen, setIsGoalDetailOpen] = useState(false)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [lastClerkSyncAt, setLastClerkSyncAt] = useState<string | null>(null)
  const [lastExamGoalsSyncAt, setLastExamGoalsSyncAt] = useState<string | null>(null)

  const tasksByStage = useMemo(
    () =>
      stages.map((stage) => ({
        stage,
        items: tasks.filter((task) => task.stage === stage),
      })),
    [tasks]
  )

  const backlogSlashQuery = useMemo(() => {
    const match = inlineTaskText.Backlog.match(/(?:^|\s)\/([^/\s]*)$/)
    return match ? match[1].toLowerCase() : null
  }, [inlineTaskText.Backlog])

  const filteredTaskTypeSuggestions = useMemo(() => {
    if (backlogSlashQuery === null) {
      return []
    }
    return taskTypes.filter((type) => type.toLowerCase().includes(backlogSlashQuery))
  }, [backlogSlashQuery])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.code === "Space") {
        event.preventDefault()
        setIsAddTaskOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const classifyFileSource = (file: File): UploadItem["source"] => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (file.type.startsWith("image/")) {
      return "Image"
    }
    if (file.type === "application/pdf" || extension === "pdf") {
      return "PDF"
    }
    if (["doc", "docx", "txt", "rtf", "odt"].includes(extension)) {
      return "Doc"
    }
    return "File"
  }

  const isUrl = (value: string) => /^https?:\/\/\S+$/i.test(value)

  const toPendingUploads = (files: File[], rawText: string) => {
    const items: PendingUpload[] = files.map((file) => ({
      source: classifyFileSource(file),
      name: file.name,
      size: file.size,
    }))

    const text = rawText.trim()
    if (text) {
      items.push({
        source: isUrl(text) ? "Link" : "Text",
        name: text.slice(0, 60) + (text.length > 60 ? "..." : ""),
        textPreview: text,
      })
    }

    return items
  }

  const createTask = async ({
    title,
    stage,
    type,
    priority,
  }: {
    title: string
    stage: Task["stage"]
    type: Task["type"]
    priority: Task["priority"]
  }) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return
    }

    await createTaskMutation({
      title: trimmedTitle,
      stage,
      priority,
      type,
    })
  }

  const handleCreateTask = async () => {
    const title = taskTitle.trim()
    if (!title) {
      return
    }

    await createTask({ title, stage: taskStage, priority: taskPriority, type: taskType })
    setTaskTitle("")
    setTaskStage("Backlog")
    setTaskPriority("Medium")
    setTaskType("Content")
    setIsAddTaskOpen(false)
  }

  const handleCreateInlineTask = async (stage: Task["stage"]) => {
    await createTask({
      title: inlineTaskText[stage],
      stage,
      type: inlineTaskType[stage],
      priority: "Medium",
    })
    setInlineTaskText((prev) => ({ ...prev, [stage]: "" }))
  }

  const applyBacklogTaskType = (type: Task["type"]) => {
    setInlineTaskType((prev) => ({ ...prev, Backlog: type }))
    setInlineTaskText((prev) => ({
      ...prev,
      Backlog: prev.Backlog.replace(/(?:^|\s)\/([^/\s]*)$/, "").trimEnd(),
    }))
  }

  const openExamPicker = (items: PendingUpload[]) => {
    if (items.length === 0) {
      return
    }
    setActiveTab("upload")
    setPendingUploads(items)
    const defaultExam = exams[0]?.slug ?? ""
    setSelectedExamForUploads(defaultExam)
    setUploadAssignMode("single")
    setPerItemExamSelections(items.map(() => defaultExam))
    setIsExamPickerOpen(true)
  }

  useEffect(() => {
    if (uploadQueue.length === 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      setUploadQueue((prev) =>
        prev
          .map((item) => ({
            ...item,
            progress: Math.min(100, item.progress + Math.floor(Math.random() * 20) + 10),
          }))
          .filter((item) => item.progress < 100)
      )
    }, 350)

    return () => window.clearInterval(intervalId)
  }, [uploadQueue.length])

  useEffect(() => {
    const shouldIgnorePaste = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false
      }
      const tagName = target.tagName.toLowerCase()
      return tagName === "input" || tagName === "textarea" || target.isContentEditable
    }

    const onDragOver = (event: DragEvent) => {
      event.preventDefault()
    }

    const onDrop = (event: DragEvent) => {
      event.preventDefault()
      const files = Array.from(event.dataTransfer?.files ?? [])
      const text = event.dataTransfer?.getData("text/plain") ?? ""
      const items = toPendingUploads(files, text)
      openExamPicker(items)
    }

    const onPaste = (event: ClipboardEvent) => {
      if (shouldIgnorePaste(event.target)) {
        return
      }
      const files = Array.from(event.clipboardData?.files ?? [])
      const text = event.clipboardData?.getData("text/plain") ?? ""
      const items = toPendingUploads(files, text)
      if (items.length > 0) {
        event.preventDefault()
        openExamPicker(items)
      }
    }

    window.addEventListener("dragover", onDragOver)
    window.addEventListener("drop", onDrop)
    window.addEventListener("paste", onPaste)
    return () => {
      window.removeEventListener("dragover", onDragOver)
      window.removeEventListener("drop", onDrop)
      window.removeEventListener("paste", onPaste)
    }
  }, [exams])

  const refreshClerkMetrics = async () => {
    try {
      setMetricsLoading(true)
      const response = await fetch("/api/admin/goals-metrics", { cache: "no-store" })
      if (!response.ok) return
      const data = (await response.json()) as ClerkMetricsApiResponse

      setGoals((prev) =>
        prev.map((goal) => {
          if (goal.title === "Daily Active Users") return { ...goal, current: data.dau }
          if (goal.title === "Weekly Active Users") return { ...goal, current: data.wau }
          if (goal.title === "Monthly Active Users") return { ...goal, current: data.mau }
          if (goal.title === "MRR") return { ...goal, current: data.mrr }
          return goal
        })
      )
      setLastClerkSyncAt(new Date().toISOString())
    } finally {
      setMetricsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "goals") {
      void refreshClerkMetrics()
    }
  }, [activeTab])

  const confirmUploadExam = async () => {
    if (pendingUploads.length === 0) {
      return
    }

    const newItems: UploadItem[] = pendingUploads
      .map((item, index) => {
        const targetExamSlug = uploadAssignMode === "single" ? selectedExamForUploads : perItemExamSelections[index]
        const selectedExam = exams.find((exam) => exam.slug === targetExamSlug)
        if (!selectedExam) {
          return null
        }

        const duplicateExists = uploads.some(
          (existing) =>
            existing.examSlug === selectedExam.slug &&
            existing.name === item.name &&
            existing.size === item.size &&
            existing.source === item.source
        )

        return {
          id: `U-${Date.now()}-${index}`,
          examSlug: selectedExam.slug,
          examTitle: selectedExam.title,
          isDuplicate: duplicateExists,
          ...item,
        }
      })
      .filter((item): item is UploadItem => item !== null)

    if (newItems.length === 0) {
      return
    }

    const queueIds = newItems.map((item) => ({ id: item.id, name: item.name, progress: 0 }))
    setUploadQueue((prev) => [...queueIds, ...prev])

    try {
      await addUploadsBatch({
        items: newItems.map(({ id: _id, ...rest }) => ({
          examSlug: rest.examSlug,
          examTitle: rest.examTitle,
          source: rest.source,
          name: rest.name,
          size: rest.size,
          textPreview: rest.textPreview,
          isDuplicate: rest.isDuplicate,
        })),
      })
    } catch (e) {
      console.error(e)
      setUploadQueue((prev) => prev.filter((q) => !queueIds.some((x) => x.id === q.id)))
      return
    }

    setPendingUploads([])
    setPerItemExamSelections([])
    setIsExamPickerOpen(false)
  }

  const filteredUploads = useMemo(() => {
    const query = uploadSearch.trim().toLowerCase()
    if (!query) {
      return uploads
    }
    return uploads.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.examTitle.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
    )
  }, [uploads, uploadSearch])

  useEffect(() => {
    const catalogCount = exams.length
    const avgQuestions = exams.length > 0 ? Math.round(exams.reduce((a, e) => a + e.questions, 0) / exams.length) : 0
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.title === "Active Medical Exams") {
          return { ...goal, current: catalogCount }
        }
        if (goal.title === "Questions Per Exam") {
          return { ...goal, current: avgQuestions }
        }
        return goal
      })
    )
    setLastExamGoalsSyncAt(new Date().toISOString())
  }, [exams])

  useEffect(() => {
    if (exams.length === 0) {
      return
    }
    if (!selectedExamForUploads || !exams.some((e) => e.slug === selectedExamForUploads)) {
      setSelectedExamForUploads(exams[0].slug)
    }
  }, [exams, selectedExamForUploads])

  const handleCreateExam = async () => {
    const title = newExamTitle.trim()
    if (!title || createExamBusy) {
      return
    }
    setCreateExamError(null)
    setCreateExamBusy(true)
    try {
      await createExam({ name: title })
      setNewExamTitle("")
    } catch (err) {
      setCreateExamError(err instanceof Error ? err.message : "Could not create exam")
    } finally {
      setCreateExamBusy(false)
    }
  }

  const handleBootstrap = async () => {
    setBootstrapBusy(true)
    setBootstrapMessage(null)
    try {
      const r = await bootstrapAdmin()
      setBootstrapMessage(r.message)
    } catch (err) {
      setBootstrapMessage(err instanceof Error ? err.message : "Bootstrap failed")
    } finally {
      setBootstrapBusy(false)
    }
  }

  return (
    <TooltipProvider delay={200}>
    <main className="min-h-svh bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/80">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto w-full max-w-[1600px] px-3 py-3 md:px-5">
        <header className="mb-4 flex justify-center">
          <TabsList className="h-10 min-w-[340px] bg-background/90 p-1 shadow">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
        </header>

        <TabsContent value="tasks" className="space-y-4 pb-28">
          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max items-start gap-3">
              {tasksByStage.map((column) => (
                <section
                  key={column.stage}
                  className="w-[292px] rounded-xl border border-black/15 bg-[#dfe4e7] p-2.5 shadow-[0_2px_0_rgba(0,0,0,0.18)]"
                >
                  <div className="mb-2 flex items-center justify-between rounded-md px-2.5 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${stageColors[column.stage]}`} />
                      <h3 className="text-sm font-semibold text-[#253858]">{column.stage}</h3>
                    </div>
                    <span className="text-xs text-[#5e6c84]">{column.items.length}</span>
                  </div>

                  <div className="space-y-2">
                    {tasksLoading ? (
                      <div className="space-y-2 rounded-md border border-dashed border-[#c2cbd4] bg-white p-3">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : column.items.length === 0 ? (
                      <div className="rounded-md border border-dashed border-[#c2cbd4] bg-white p-3 text-xs text-[#5e6c84]">
                        No tasks yet
                      </div>
                    ) : (
                      column.items.map((task) => (
                        <article
                          key={task.id}
                          onClick={() => {
                            setSelectedTask(task)
                            setIsTaskDetailsOpen(true)
                          }}
                          className="cursor-pointer rounded-lg border border-[#d0d7de] bg-white p-2.5 shadow-[0_1px_0_rgba(9,30,66,.25)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(9,30,66,.18)]"
                        >
                          <p className="text-[13px] leading-snug font-medium text-[#172b4d]">{task.title}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-[#6b778c]">{task.id}</span>
                            <div className="flex items-center gap-1.5">
                              <Badge variant="outline" className={`h-5 border text-[11px] ${taskTypeClasses[task.type]}`}>
                                {task.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`h-5 border text-[11px] ${priorityClasses[task.priority]}`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div className="fixed right-3 bottom-3 left-3 z-30 mx-auto w-full max-w-[760px] space-y-1.5 rounded-md border border-dashed border-[#c2cbd4] bg-[#f4f6f8] p-2 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#5e6c84]">
                Type: {inlineTaskType.Backlog} • Total tasks: {tasks.length} • Backlog: {tasksByStage[0]?.items.length ?? 0}
              </p>
            </div>
            <Input
              value={inlineTaskText.Backlog}
              onChange={(event) =>
                setInlineTaskText((prev) => ({
                  ...prev,
                  Backlog: event.target.value,
                }))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  if (backlogSlashQuery !== null && filteredTaskTypeSuggestions.length > 0) {
                    applyBacklogTaskType(filteredTaskTypeSuggestions[0])
                    return
                  }
                  void handleCreateInlineTask("Backlog")
                }
              }}
              placeholder="Add new task to Backlog... (Enter to add, / type)"
              className="h-8 bg-white text-xs"
            />
            {backlogSlashQuery !== null ? (
              <div className="rounded-md border bg-white p-1">
                {filteredTaskTypeSuggestions.length === 0 ? (
                  <p className="px-2 py-1 text-xs text-muted-foreground">No matching type</p>
                ) : (
                  filteredTaskTypeSuggestions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-muted"
                      onClick={() => applyBacklogTaskType(type)}
                    >
                      {type}
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 rounded-md border border-white/20 bg-white p-4 pb-28">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Exam Content</h2>
              <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                After <code className="rounded bg-muted px-1">npx convex deploy</code> (from DrNoteFinal), run a one-shot
                seed if the DB is empty — same as{" "}
                <code className="rounded bg-muted px-1">npx convex run adminBootstrap:bootstrap</code>.
              </p>
              {bootstrapMessage ? <p className="mt-2 text-xs text-muted-foreground">{bootstrapMessage}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={bootstrapBusy} onClick={() => void handleBootstrap()}>
                {bootstrapBusy ? "Seeding…" : "Seed exams + tasks"}
              </Button>
              <Link href="/exams/new" className={buttonVariants()}>
                Add New Exam
              </Link>
            </div>
          </div>

          <Card className="py-0">
            <CardContent className="p-0">
              <Table className="min-w-[640px]">
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Exam</TableHead>
                    <TableHead className="w-[120px]">Questions</TableHead>
                    <TableHead className="w-[100px] pr-4 text-right">Accent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`sk-${i}`} className="hover:bg-transparent">
                        <TableCell className="pl-4">
                          <Skeleton className="h-4 w-[min(280px,55vw)]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell className="pr-4 text-right">
                          <Skeleton className="ml-auto h-4 w-10" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : exams.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                        No exams in Convex yet. Seed or run{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">npx convex run exams:seed</code> or add one
                        below.
                      </TableCell>
                    </TableRow>
                  ) : (
                    exams.map((exam) => (
                      <TableRow
                        key={exam.slug}
                        className={cn(
                          "cursor-default border-l-4 border-l-[var(--exam-accent)]",
                          "hover:bg-muted/30"
                        )}
                        style={{ ["--exam-accent" as string]: exam.color }}
                      >
                        <TableCell className="pl-4 font-medium">
                          <Link className="underline-offset-2 hover:underline" href={`/exams/${exam.slug}`}>
                            {exam.title}
                          </Link>
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">{exam.questions}</TableCell>
                        <TableCell className="pr-4 text-right">
                          <Tooltip>
                            <TooltipTrigger
                              type="button"
                              className="inline-flex size-4 shrink-0 rounded-sm border border-border/80 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              style={{ backgroundColor: exam.color }}
                              aria-label={`Brand color from Convex for ${exam.title}`}
                            >
                              <span className="sr-only">Color</span>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs text-left">
                              Left border and swatch use this exam&apos;s <strong>brand color</strong> from Convex (
                              <code className="text-[11px]">color</code>), not a publish status.
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-1.5 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2">
            <p className="text-[11px] text-slate-600">Need a new exam? Create it here.</p>
            <Link href="/exams/new" className={buttonVariants({ size: "sm", className: "w-full text-xs" })}>
              + Add New Exam
            </Link>
          </div>
          <div className="fixed right-3 bottom-3 left-3 z-30 mx-auto w-full max-w-[760px] space-y-1.5 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2 shadow-md">
            <p className="text-[11px] text-slate-600">
              Quick add (writes to Convex) · Total in catalog: {examsLoading ? "…" : exams.length}
            </p>
            {createExamError ? (
              <p className="text-[11px] text-destructive">{createExamError}</p>
            ) : null}
            <div className="flex gap-2">
              <Input
                value={newExamTitle}
                onChange={(event) => setNewExamTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    void handleCreateExam()
                  }
                }}
                placeholder="New exam name…"
                className="h-8 bg-white text-xs"
                disabled={createExamBusy || examsLoading}
              />
              <Button size="sm" onClick={() => void handleCreateExam()} disabled={createExamBusy || examsLoading}>
                {createExamBusy ? "Adding…" : "Add"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4 rounded-md border border-white/20 bg-white p-4">
          <div>
            <h2 className="text-lg font-semibold">Upload</h2>
            <p className="text-sm text-muted-foreground">
              Drop anywhere on the page, or paste with Ctrl+V/Cmd+V. Supports doc, pdf, text, link, and images.
            </p>
          </div>

          {uploadQueue.length > 0 ? (
            <div className="space-y-2 rounded-lg border bg-slate-50 p-3">
              <p className="text-sm font-medium">Processing uploads</p>
              {uploadQueue.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{item.name}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} />
                </div>
              ))}
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Uploaded List</h3>
              <Input
                value={uploadSearch}
                onChange={(event) => setUploadSearch(event.target.value)}
                placeholder="Search file, exam, type..."
                className="max-w-xs"
              />
            </div>

            {uploadsLoading ? (
              <div className="space-y-2 rounded-md border p-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : filteredUploads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No uploads yet.</p>
            ) : (
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Size</th>
                      <th className="px-3 py-2 font-medium">Exam</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUploads.map((item) => (
                      <tr key={item.id} className="border-t align-top">
                        <td className="px-3 py-2">
                          <p className="font-medium">{item.name}</p>
                          {item.textPreview ? <p className="mt-1 text-xs text-muted-foreground">{item.textPreview}</p> : null}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{item.source}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {typeof item.size === "number" ? `${Math.ceil(item.size / 1024)} KB` : "-"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{item.examTitle}</td>
                        <td className="px-3 py-2">
                          {item.isDuplicate ? (
                            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                              Duplicate
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                              New
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="grid gap-4 rounded-md border border-white/20 bg-white p-4 md:grid-cols-3">
          <Card className="py-5">
            <CardHeader className="px-5">
              <CardDescription>Total Exams</CardDescription>
              <CardTitle className="text-3xl">{exams.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="py-5">
            <CardHeader className="px-5">
              <CardDescription>Open Tasks</CardDescription>
              <CardTitle className="text-3xl">{tasks.filter((task) => task.stage !== "Done").length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="py-5">
            <CardHeader className="px-5">
              <CardDescription>Avg questions / exam</CardDescription>
              <CardTitle className="text-3xl">
                {exams.length > 0
                  ? Math.round(exams.reduce((a, e) => a + e.questions, 0) / exams.length)
                  : "—"}
              </CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 rounded-md border border-white/20 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Goals</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Each goal has a clear target. Progress fills from live data (exam catalog + Clerk metrics). Open a goal
                for source, last sync, and breakdown.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Exams updated: {formatDateTime(lastExamGoalsSyncAt)} · Clerk metrics: {formatDateTime(lastClerkSyncAt)}
              </p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0" onClick={refreshClerkMetrics} disabled={metricsLoading}>
              {metricsLoading ? "Refreshing..." : "Refresh Clerk metrics"}
            </Button>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => {
              const percent = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0
              const remaining = Math.max(0, goal.target - goal.current)
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => {
                    setSelectedGoalDetail(goal)
                    setIsGoalDetailOpen(true)
                  }}
                  className="w-full rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 text-left shadow-sm ring-1 ring-slate-200/50 transition hover:border-teal-400/70 hover:shadow-md hover:ring-teal-500/20 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:ring-slate-800"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{goal.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{goal.current.toLocaleString()}</span>
                        {" / "}
                        <span>{goal.target.toLocaleString()}</span>
                        <span className="text-muted-foreground"> target</span>
                        {remaining > 0 ? (
                          <span className="text-muted-foreground">
                            {" "}
                            · <span className="font-medium text-amber-800 dark:text-amber-200">{remaining.toLocaleString()} remaining</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400"> · Target met</span>
                        )}
                        <span className="block pt-1 text-[11px] text-muted-foreground">Tap for details · {goal.source}</span>
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 tabular-nums text-sm">
                      {percent}%
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="relative h-5 w-full overflow-hidden rounded-full bg-slate-200/90 shadow-inner dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 shadow-[0_0_16px_rgba(20,184,166,0.55)] transition-[width] duration-500 ease-out"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Shortcut: Command + Space.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="e.g. Build question editor"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void handleCreateTask()
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="task-stage">Stage</Label>
                <select
                  id="task-stage"
                  value={taskStage}
                  onChange={(event) => setTaskStage(event.target.value as Task["stage"])}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <select
                  id="task-priority"
                  value={taskPriority}
                  onChange={(event) => setTaskPriority(event.target.value as Task["priority"])}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-type">Task Type</Label>
                <select
                  id="task-type"
                  value={taskType}
                  onChange={(event) => setTaskType(event.target.value as Task["type"])}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  <option value="Content">Content</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Dev">Dev</option>
                  <option value="Bug Fix">Bug Fix</option>
                  <option value="Automation">Automation</option>
                  <option value="AI">AI</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleCreateTask()}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isExamPickerOpen} onOpenChange={setIsExamPickerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Exam</DialogTitle>
            <DialogDescription>Choose exam name for {pendingUploads.length} new item(s).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {pendingUploads.length > 1 ? (
              <div className="space-y-2">
                <Label>Assignment mode</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={uploadAssignMode === "single" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUploadAssignMode("single")}
                  >
                    One exam for all
                  </Button>
                  <Button
                    type="button"
                    variant={uploadAssignMode === "multiple" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUploadAssignMode("multiple")}
                  >
                    Multiple exams
                  </Button>
                </div>
              </div>
            ) : null}

            {uploadAssignMode === "single" ? (
              <div className="space-y-2">
                <Label htmlFor="upload-exam">Exam</Label>
                <select
                  id="upload-exam"
                  value={selectedExamForUploads}
                  onChange={(event) => setSelectedExamForUploads(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {exams.map((exam) => (
                    <option key={exam.slug} value={exam.slug}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {pendingUploads.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="space-y-1 rounded-md border p-2">
                    <p className="text-xs font-medium">{item.name}</p>
                    <select
                      value={perItemExamSelections[index] ?? exams[0]?.slug ?? ""}
                      onChange={(event) =>
                        setPerItemExamSelections((prev) => {
                          const next = [...prev]
                          next[index] = event.target.value
                          return next
                        })
                      }
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {exams.map((exam) => (
                        <option key={exam.slug} value={exam.slug}>
                          {exam.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExamPickerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void confirmUploadExam()}>Add to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>Selected card details.</DialogDescription>
          </DialogHeader>
          {selectedTask ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Task</p>
                <p className="font-medium">{selectedTask.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">ID</p>
                  <p className="text-sm">{selectedTask.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stage</p>
                  <p className="text-sm">{selectedTask.stage}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant="outline" className={`h-5 border text-[11px] ${taskTypeClasses[selectedTask.type]}`}>
                    {selectedTask.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge
                    variant="outline"
                    className={`h-5 border text-[11px] ${priorityClasses[selectedTask.priority]}`}
                  >
                    {selectedTask.priority}
                  </Badge>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTaskDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGoalDetailOpen}
        onOpenChange={(open) => {
          setIsGoalDetailOpen(open)
          if (!open) {
            setSelectedGoalDetail(null)
          }
        }}
      >
        <DialogContent className="max-h-[min(90vh,720px)] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedGoalDetail?.title ?? "Goal"}</DialogTitle>
            <DialogDescription>
              {selectedGoalDetail ? (
                <span className="text-muted-foreground">
                  Data source: <strong className="text-foreground">{selectedGoalDetail.source}</strong>
                  {selectedGoalDetail.unit ? (
                    <>
                      {" "}
                      · Unit: <strong className="text-foreground">{selectedGoalDetail.unit}</strong>
                    </>
                  ) : null}
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          {selectedGoalDetail ? (
            <div className="space-y-4">
              {(() => {
                const g = selectedGoalDetail
                const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0
                const remaining = Math.max(0, g.target - g.current)
                const lastSync =
                  g.source === "Clerk" || g.source === "Clerk Billing" ? lastClerkSyncAt : lastExamGoalsSyncAt
                return (
                  <>
                    <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                      <p className="text-xs font-medium text-muted-foreground">Last sync</p>
                      <p className="mt-0.5">{formatDateTime(lastSync)}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {g.source === "Clerk" || g.source === "Clerk Billing"
                          ? "Values come from GET /api/admin/goals-metrics (Clerk-backed)."
                          : "Values come from the Convex `exams` table (same list as Content)."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-md border bg-background p-2">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="font-semibold tabular-nums">{g.current.toLocaleString()}</p>
                      </div>
                      <div className="rounded-md border bg-background p-2">
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-semibold tabular-nums">{g.target.toLocaleString()}</p>
                      </div>
                      <div className="rounded-md border bg-background p-2">
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="font-semibold tabular-nums text-amber-800 dark:text-amber-200">
                          {remaining.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="relative h-5 w-full overflow-hidden rounded-full bg-slate-200/90 shadow-inner dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 shadow-[0_0_16px_rgba(20,184,166,0.55)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-center text-xs text-muted-foreground">{pct}% complete</p>

                    {g.title === "Active Medical Exams" ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Exams in Convex catalog</p>
                        <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border bg-muted/20 p-2 text-sm">
                          {exams.map((exam) => (
                            <li
                              key={exam.slug}
                              className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 last:border-0"
                            >
                              <span className="truncate">{exam.title}</span>
                              <Tooltip>
                                <TooltipTrigger
                                  type="button"
                                  className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-border/60 p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  aria-label="Exam brand color from Convex"
                                >
                                  <span
                                    className="block size-3 rounded-sm"
                                    style={{ backgroundColor: exam.color }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>Color from Convex · counts as one catalog exam</TooltipContent>
                              </Tooltip>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground">
                          Current count equals rows in the <code className="text-[11px]">exams</code> table. To reach the
                          target, add {remaining.toLocaleString()} more exams (or adjust the target).
                        </p>
                      </div>
                    ) : null}

                    {g.title === "Questions Per Exam" ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Questions per exam (average vs goal)</p>
                        <p className="text-xs text-muted-foreground">
                          Current average is computed from all exams below. Target is a stretch goal for content depth.
                        </p>
                        <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border bg-muted/20 p-2 text-sm">
                          {exams.map((exam) => (
                            <li key={exam.slug} className="flex justify-between gap-2 border-b border-border/50 py-1 last:border-0">
                              <span className="truncate">{exam.title}</span>
                              <span className="shrink-0 tabular-nums text-muted-foreground">{exam.questions} Qs</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {(g.title === "Daily Active Users" ||
                      g.title === "Weekly Active Users" ||
                      g.title === "Monthly Active Users" ||
                      g.title === "MRR") && (
                      <div className="rounded-md border border-dashed bg-muted/15 p-3 text-sm text-muted-foreground">
                        <p>
                          This metric is loaded from your Clerk admin API when you open Goals or tap &quot;Refresh Clerk
                          metrics&quot;. If values are zero, confirm the API returns data for your environment.
                        </p>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          ) : null}
          <DialogFooter>
            <Button onClick={() => setIsGoalDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
    </TooltipProvider>
  )
}
