# Graph Report - graphify-out  (2026-08-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1836 nodes · 4712 edges · 136 communities (95 shown, 41 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c37eba22`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135

## God Nodes (most connected - your core abstractions)
1. `executeIntent()` - 84 edges
2. `createApi()` - 57 edges
3. `loadSnapshot()` - 51 edges
4. `dispatchRoot()` - 35 edges
5. `react` - 34 edges
6. `businessIdeaFile()` - 32 edges
7. `queueValidatedDispatch()` - 29 edges
8. `cn()` - 29 edges
9. `activeProjectSlug()` - 28 edges
10. `handleJarvisAct()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `createApi()` --references--> `hono`  [EXTRACTED]
  server/api.ts → package.json
- `registerFileRoutes()` --references--> `hono`  [EXTRACTED]
  server/file-routes.ts → package.json
- `registerSourcesRoutes()` --references--> `hono`  [EXTRACTED]
  server/sources-routes.ts → package.json
- `enqueue()` --references--> `yaml`  [EXTRACTED]
  server/jarvis/tools-exec.test.ts → package.json
- `listRoutineDefs()` --references--> `yaml`  [EXTRACTED]
  server/routines.ts → package.json

## Import Cycles
- 3-file cycle: `server/jarvis/dispatch-for.ts -> server/snapshot.ts -> server/jarvis/phase0-roundtable.ts -> server/jarvis/dispatch-for.ts`
- 3-file cycle: `server/jarvis/phase0-roundtable.ts -> server/spawn.ts -> server/memory/run-lifecycle.ts -> server/jarvis/phase0-roundtable.ts`
- 4-file cycle: `server/jarvis/dispatch-for.ts -> server/snapshot.ts -> server/jarvis/phase0-roundtable.ts -> server/spawn.ts -> server/jarvis/dispatch-for.ts`
- 4-file cycle: `server/jarvis/dispatch-for.ts -> server/snapshot.ts -> server/routines.ts -> server/spawn.ts -> server/jarvis/dispatch-for.ts`

## Communities (136 total, 41 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (58): Snapshot, AgentRuntimeStatus, AgentStateFile, buildAgentRuntimeMap(), deriveAgentRuntimeStatus(), latestRunByPosition(), CSuiteCard, AssignPanel() (+50 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (57): buildNoteDoc(), ChromaClientFactory, ChromaDoc, chromaHeartbeat(), chunkText(), COLLECTION_NAME, deleteProjectDocs(), fileToDocs() (+49 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (44): askBrain(), BrainAskInput, BrainAskResult, BrainAskRuntime, buildBrainPrompt(), defaultBrainModel(), defaultRuntime(), sanitizeSpoken() (+36 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (26): commercialLocalOk(), draftSkipOk(), evaluateRunAcceptance(), hasIcHandoff(), hasMatchingInbox(), inboxItemsWithRunId(), loadHandoffs(), parseFrontmatter() (+18 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (49): ackAlert(), answerSeatQuestions(), assignWork(), cancelRun(), createProject(), CSuiteCard, fetchBriefScript(), fetchCompanyDigest() (+41 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (21): BlockerResolvePlan, defaultGoal(), findBlockedTarget(), planBlockerResolve(), resolveOwnerManager(), seatLabel(), buildSeatAnswerGoal(), formatAnswersMarkdown() (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (21): CHAT_TOOLS, runChatLlm(), livekitEnv(), mintTalkToken(), probeLivekitHealth(), resolveRepoRoot(), listRoutineDefs(), routinesDir() (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (33): BatchQueueItem, advancePhase0Roundtable(), advancePhase0RoundtableInner(), buildMergeGoal(), collectPeerBriefs(), csuiteReviewAbs(), DEFAULT_PEER_TIMEOUT_MS, defaultQueuePeers() (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (40): buildQueueForPacket(), coercePhaseArg(), MAX_BATCH, previewQueueFor(), queueDispatchBatch(), QueueForArgs, resolvePositionArg(), seatLabel() (+32 more)

### Community 9 - "Community 9"
Cohesion: 0.16
Nodes (13): setExecuteIntentForTests(), FIXTURES, auditJarvis(), events, formatActivityDetail(), getAuditEvents(), JarvisActivityType, JarvisAuditEvent (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (21): ActivityEvent, ActivityEventType, activityPath(), appendActivity(), parseBatchQueueItems(), startPhase0Roundtable(), openAsksForSeat(), clearSeatAnswerDraft() (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (22): org, tracker, StandupBriefing, org, tracker, buildTasks(), ORDER, OrgTask (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (68): pdf-parse, pdf-parse, FIXTURES, memoryDir(), memoryRel(), sourcesDir(), FIXTURES, readOperatorNote() (+60 more)

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (20): OrgTask, Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+12 more)

### Community 14 - "Community 14"
Cohesion: 0.23
Nodes (12): normalizeWorkRequestConfirmArgs(), normalizeQueueForArgs(), looksLikePhase0Request(), phase0WorkGoal(), getWorkIntake(), setWorkIntake(), GOAL_IC_HEURISTICS, inferSeatFromGoalText() (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (14): AnnounceEvent, selectAnnounceEvents(), shouldPollEvents(), ConfirmGate, createConfirmGate(), shouldRecoverEmptySttConfirm(), JARVIS_SYSTEM_PROMPT, patchSpeechHandleCancel() (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (24): fetchFile(), fetchProductionScorecard(), fetchReviewInbox(), fileRawUrl(), ReviewInboxItem, ArtifactReader(), ArtifactFilter, OutputsDashboard() (+16 more)

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (17): hono, hono, copyFirstExisting(), createVenture(), CreateVentureInput, CreateVentureResult, seedContextFile(), seedSourcesIndex() (+9 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (18): applyModeFromActResult(), createModeState(), modeAck(), ModeState, summarizeSetMode(), createOccClient(), JarvisActBody, JarvisActSpeechResult (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): gen_step(), TEBS-1 collapsed assembly — all segments nested concentric at transport height., Collapsed transport mode: T3 nested in T2 nested in T1 at shared origin.

### Community 20 - "Community 20"
Cohesion: 0.24
Nodes (15): react, Badge(), Button(), buttonVariants, Card(), CardContent(), CardHeader(), CardTitle() (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (20): main(), registerRun(), unregisterRun(), beginRunRecord(), ClaimFail, ClaimReady, DetachedCursorPayload, finishAdapterRun() (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.09
Nodes (23): jsdom, oxlint, devDependencies, jsdom, oxlint, tailwindcss, @tailwindcss/vite, @testing-library/react (+15 more)

### Community 23 - "Community 23"
Cohesion: 0.19
Nodes (19): sanitizeForSpeech(), summarizeJarvisSpeech(), BrainRouteDispatch, clipStatusSpeech(), executeBrainRouteIntent(), lastUserUtterance(), looksLikeConfirmNo(), looksLikeConfirmYes() (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.15
Nodes (17): heuristicIntent(), stripConfirmPrefix(), golden, GoldenCase, goldenPath, JARVIS_INTENTS, JarvisAct, jarvisActSchema (+9 more)

### Community 25 - "Community 25"
Cohesion: 0.17
Nodes (19): cap_transform_day(), cap_transform_night(), core_instances(), Shared assembly instances for day/night silhouette variants. Gemini day:…, Day mode — cap fully screwed down, sealed for desorption., Night mode — cap backed off and rotated 90° to open louvers., Translation-only transform in cadpy's 4x4 layout (tx/ty/tz at 3/7/11)., 90° about Z, then translate (night-mode louvers). (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.09
Nodes (22): scripts, agent:dev, agent:test, build, check:mcp-posture, dev, jarvis:eval:ollama, jarvis:smoke (+14 more)

### Community 27 - "Community 27"
Cohesion: 0.31
Nodes (10): appendRunEvent(), eventCursor(), listRunEvents(), listRunEventsSince(), readAllRunEventsChronological(), RunEvent, runEventsPath(), seatLabel() (+2 more)

### Community 28 - "Community 28"
Cohesion: 0.23
Nodes (18): createJarvisLLM(), createOllamaLLM(), createOmniVoiceTTS(), createWhisperSTT(), createXaiLLM(), defaultJarvisLlmModel(), defaultKokoroModel(), defaultKokoroVoice() (+10 more)

### Community 29 - "Community 29"
Cohesion: 0.27
Nodes (11): ArtifactItem, indexArtifacts(), indexProductionArtifacts(), normalizeArtifact(), buildAssignPayload(), CREATIVE, DEFAULT_BUSINESS_IDEA_REL, handoffFilePath() (+3 more)

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (20): ACTIVE_RUN, ACTIVE_SESSION, buildEventsSincePayload(), hasActiveRunsOrSessions(), formatRunLifecycleLine(), loadRecentRunLines(), recordRunLifecycle(), runsDir() (+12 more)

### Community 31 - "Community 31"
Cohesion: 0.21
Nodes (15): fetchLivekitHealth(), fetchLivekitToken(), audioCaptureOptionsForMic(), ensureMicPermission(), isHeadsetMic(), listAudioInputs(), MicCaptureOptions, MicDevice (+7 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (19): node, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.11
Nodes (19): vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, module, moduleDetection (+11 more)

### Community 34 - "Community 34"
Cohesion: 0.06
Nodes (61): asStringList(), briefCacheKey(), buildRewritePrompt(), cache, clearSeatBriefRewriteCacheForTests(), defaultRuntime(), defaultSeatBriefModel(), defaultSeatBriefTimeoutMs() (+53 more)

### Community 35 - "Community 35"
Cohesion: 0.36
Nodes (11): applyUsageToRun(), claimManagerForSpawn(), effectiveBudget(), prepareRewake(), isOverBudget(), loadSpend(), recordSpend(), SeatSpend (+3 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (16): clearRoomPending(), createConfirmToken(), getLastSummary(), lastReportedSeats, lastSummaries, patchSeatAnswerDraft(), Pending, roomModes (+8 more)

### Community 37 - "Community 37"
Cohesion: 0.14
Nodes (14): abortError(), cursorRuntimeAdapter, RuntimeAdapter, RuntimeRunInput, RuntimeRunResult, SdkAgentHandle, { mocks, CursorAgentError }, withAbortSignal() (+6 more)

### Community 38 - "Community 38"
Cohesion: 0.23
Nodes (15): findInboxDeliverableByRunId(), findLatestInboxDeliverableForSeat(), listReviewInbox(), parseFrontmatter(), ReviewInboxItem, setReviewInboxStatus(), writeReviewInboxReceipt(), assertJarvisReadable() (+7 more)

### Community 39 - "Community 39"
Cohesion: 0.20
Nodes (18): confirmSummary(), executeIntent(), ExecuteIntentFn, handleJarvisAct(), handleJarvisConfirm(), JarvisActResult, looksLikeConfirmToken(), okSummary() (+10 more)

### Community 40 - "Community 40"
Cohesion: 0.20
Nodes (13): DISCOVER_EXTS, discoverSeatProductionFiles(), enrichHandoffsWithSeatOutputs(), isDiscoverableProductionFile(), registerFileRoutes(), extensionOf(), IMAGE_EXT, isProductionAssetPath() (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.13
Nodes (15): chokidar, chromadb, class-variance-authority, livekit-client, @livekit/components-react, livekit-server-sdk, dependencies, chokidar (+7 more)

### Community 42 - "Community 42"
Cohesion: 0.20
Nodes (19): readActivityTail(), listAgentStates(), createApi(), listDispatchFiles(), buildJarvisContext(), MissionBriefInput, spokenMissionBrief(), listSeatsAwaitingAnswers() (+11 more)

### Community 44 - "Community 44"
Cohesion: 0.15
Nodes (13): yaml, clearRunRegistry(), controllers, buildRewakePrompt(), buildSpawnPrompt(), rewakeSession(), runAdapterAndPersist(), spawnClaimedManager() (+5 more)

### Community 45 - "Community 45"
Cohesion: 0.25
Nodes (9): buildMission(), extractLatestDecision(), extractOpenQuestions(), missionBriefScript(), MissionState, dir, org, tracker (+1 more)

### Community 46 - "Community 46"
Cohesion: 0.15
Nodes (13): src/jarvis/hud/AssignPanel.tsx, src/jarvis/hud/FloorDashboard.tsx, src/jarvis/hud/KpiStrip.tsx, src/jarvis/hud/ModeBar.tsx, src/jarvis/JarvisShell.tsx, src/lib/cost-rates.ts, src/lib/cron.ts, src/lib/dispatch-queue.ts (+5 more)

### Community 47 - "Community 47"
Cohesion: 0.26
Nodes (9): DropdownMenu, DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger, MissionCommandControls() (+1 more)

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (13): add_bayonet_lug(), add_bayonet_slot(), Bayonet lug + slot helpers for TEBS-1 telescoping segments., Female bayonet pocket near top of outer segment., Male bayonet lug near bottom of inner segment., add_external_thread_grooves(), Male thread schematic grooves on outer cylindrical surface., gen_step() (+5 more)

### Community 49 - "Community 49"
Cohesion: 0.17
Nodes (12): dependencies, dotenv, @livekit/agents, @livekit/agents-plugin-openai, @livekit/agents-plugin-silero, zod, zod, @livekit/agents (+4 more)

### Community 50 - "Community 50"
Cohesion: 0.27
Nodes (10): attachPreferredIcLeaseHint(), buildPhaseIcLeases(), BuildPhaseIcLeasesResult, PhaseIcLease, expandOutputPath(), loadSeatOutputPaths(), mergeUniquePaths(), parseSeatOutputsSection() (+2 more)

### Community 51 - "Community 51"
Cohesion: 0.36
Nodes (9): ackHandoffAlert(), alertsPath(), loadAlerts(), saveAlerts(), syncHandoffAlerts(), ackAlert(), diffHandoffAlerts(), HandoffAlert (+1 more)

### Community 52 - "Community 52"
Cohesion: 0.73
Nodes (4): cronMatches(), fieldMatches(), isCronDue(), nextCronFire()

### Community 53 - "Community 53"
Cohesion: 0.50
Nodes (5): secondariesForPhase(), writeCsuiteDraft(), WriteCsuiteDraftResult, renderCsuiteDraft(), splitScorecard()

### Community 54 - "Community 54"
Cohesion: 0.35
Nodes (8): claimDispatch(), claimOldestDispatch(), ClaimResult, enqueueDispatch(), ensureDispatchDirs(), listQueuedDispatches(), packet, ManagerPacket

### Community 55 - "Community 55"
Cohesion: 0.20
Nodes (10): devDependencies, tsx, typescript, vitest, tsx, vitest, plugins, typescript (+2 more)

### Community 56 - "Community 56"
Cohesion: 0.33
Nodes (7): callOccControlTool(), handleOccControlRpc(), listOccControlTools(), OCC_CONTROL_TOOLS, OccControlToolName, FIXTURES, TOOL_BY_NAME

### Community 57 - "Community 57"
Cohesion: 0.22
Nodes (8): server/**/*.test.ts, server/**/*.ts, src/lib/**/*.ts, vite.config.ts, src/lib/fixtures, exclude, include, src/**/*.test.ts

### Community 58 - "Community 58"
Cohesion: 0.57
Nodes (7): agentStateDir(), AgentStateFile, agentStatePath(), isSeatPaused(), readAgentState(), setSeatBudget(), setSeatPaused()

### Community 59 - "Community 59"
Cohesion: 0.27
Nodes (9): memoryDigest(), memoryNote(), memoryRecall(), memoryReindex(), missionLineFromSnapshot(), summarizeRecall(), FIXTURES, buildSessionDigestMarkdown() (+1 more)

### Community 60 - "Community 60"
Cohesion: 0.33
Nodes (5): ChatOrigin, ChatSubmissionGuard, failedChatDraft(), nextChatDraft(), retryChatMessage()

### Community 61 - "Community 61"
Cohesion: 0.25
Nodes (7): name, private, scripts, dev, start, test, type

### Community 62 - "Community 62"
Cohesion: 0.18
Nodes (6): gen_step(), make_condenser_fin_array(), Part, Condenser radial fin array — aluminum (AlSi10Mg metal AM) + PETG fit-test. 24…, Failing-first schematic fidelity checks for passive harvester CAD generators., SchematicFidelityTests

### Community 64 - "Community 64"
Cohesion: 0.38
Nodes (6): get, post, health(), _load(), OpenAI-compatible local Whisper transcription sidecar (port 8090)., transcribe()

### Community 65 - "Community 65"
Cohesion: 0.26
Nodes (7): FIXTURES, findSessionByAgentId(), readSession(), sessionPath(), SessionRecord, sessionsDir(), writeSession()

### Community 66 - "Community 66"
Cohesion: 0.57
Nodes (5): setOpsVisible(), setTheaterVisible(), toggleOpsTables(), toggleTheater(), WorkspaceViewState

### Community 67 - "Community 67"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

### Community 68 - "Community 68"
Cohesion: 0.47
Nodes (5): __dir, golden, isLocalhost(), main(), skip()

### Community 69 - "Community 69"
Cohesion: 0.21
Nodes (9): gen_step(), make_reflector_deployed(), make_reflector_stowed(), Part, Deployable aluminized Mylar parabolic reflector — Gemini callout 6. Umbrella…, Collar at local bottom; dish flares upward to wide rim (umbrella). Assembly…, Night / transport: reflector folded flat at top of body under cap., gen_step() (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.30
Nodes (10): classifyHandoffFilename(), indexHandoffs(), parseEscalationTags(), parseHandoff(), parsePathList(), seatSlugFromHandoffFilename(), sectionBullets(), dir (+2 more)

### Community 72 - "Community 72"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (9): addKey(), buildAliasIndex(), EXTRA_ALIASES, normalizeSeatKey(), resolveSeatSlug(), seatAliasKeys(), SeatIdentity, dir (+1 more)

### Community 74 - "Community 74"
Cohesion: 0.70
Nodes (3): ActivityFocusInput, latestJarvisFocus(), parseJarvisFocusEvent()

### Community 75 - "Community 75"
Cohesion: 0.50
Nodes (3): occ-control, OCC_API_BASE, npx

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (3): base, handleLine(), rpc()

### Community 79 - "Community 79"
Cohesion: 0.29
Nodes (8): deleteSource(), fetchSources(), saveContextNote(), SourceRecord, uploadSources(), sourcePreviewPath(), SourcesPanel(), STATUS_LABEL

### Community 80 - "Community 80"
Cohesion: 0.50
Nodes (3): indexCss, situationRoom, themeCss

### Community 82 - "Community 82"
Cohesion: 0.67
Nodes (3): DOM, lib, ES2023

### Community 120 - "Community 120"
Cohesion: 0.25
Nodes (7): CoverageCase, dispatchDir(), enqueue(), FIXTURES, INTENT_COVERAGE, okAdapter, packet

### Community 121 - "Community 121"
Cohesion: 0.31
Nodes (7): gen_step(), make_baffle_cap(), Part, M80 screw-on baffle cap — day/night toggle with visible rotation handle. Gemini…, add_internal_thread_grooves(), Schematic M80 x 2.0 thread profile helpers (DFM — not ISO-certified)., Female thread schematic grooves on inner cylindrical bore.

### Community 122 - "Community 122"
Cohesion: 0.43
Nodes (5): gen_step(), make_mylar_bellows_liner(), Part, Vacuum-rated aluminized Mylar bellows liner — TEBS-1 thermal barrier film.…, Deprecated: conical water-funnel liner. Gemini Mylar roles are: 1. Deployable…

### Community 123 - "Community 123"
Cohesion: 0.40
Nodes (4): gen_step(), make_molle_mount_plate(), Part, MOLLE mount plate — Gemini callout 7 interface to plate carrier.

### Community 124 - "Community 124"
Cohesion: 0.40
Nodes (5): gen_step(), make_vacuum_thermal_barrier(), Part, Double-wall vacuum thermal barrier sleeve — Gemini DFM 2.50 mm gap., Concentric double-wall sleeve with evacuated annulus.

### Community 125 - "Community 125"
Cohesion: 0.50
Nodes (4): gen_step(), make_central_collection_tube(), Part, Central water collection tube — passive grid-down MOF water harvester.

### Community 126 - "Community 126"
Cohesion: 0.50
Nodes (4): gen_step(), make_condenser_shade_disc(), Part, Condenser shade disc — sits above fins so solar reflector rim keeps them cool.

### Community 127 - "Community 127"
Cohesion: 0.50
Nodes (4): gen_step(), make_expansion_spring_guidance(), Part, Expansion Spring and Guidance System (ESGS-1) — Plate 4 collapsible deploy…

### Community 128 - "Community 128"
Cohesion: 0.50
Nodes (4): gen_step(), make_hydration_bladder(), Part, MOLLE-compatible hydration bladder pouch — Gemini callout 7 soft goods proxy.

### Community 129 - "Community 129"
Cohesion: 0.50
Nodes (4): gen_step(), make_main_body_shell(), Part, Main harvester body shell with M80 x 2.0 integration thread zone.

### Community 130 - "Community 130"
Cohesion: 0.50
Nodes (4): gen_step(), make_mof_puck_housing(), Part, MOF puck housing — cartridge frame for collapsible sorbent stack (Gemini Plate…

### Community 131 - "Community 131"
Cohesion: 0.50
Nodes (4): gen_step(), make_mof_sorbent_disc(), Part, MOF-303 sorbent disc — passive grid-down MOF water harvester (Gemini DFM).

### Community 132 - "Community 132"
Cohesion: 0.50
Nodes (4): gen_step(), make_nickel_foam_disc(), Part, Nickel foam conductive disc — passive grid-down MOF water harvester.

### Community 133 - "Community 133"
Cohesion: 0.50
Nodes (4): gen_step(), TEBS-1 assembly — collapsed (nested) and expanded segment positions., Expanded stack: T1 base, T2 mid, T3 top — segments offset vertically., _tx()

### Community 134 - "Community 134"
Cohesion: 0.67
Nodes (3): gen_step(), Three MOF puck housings stacked for collapsible core cartridge., _tx()

### Community 135 - "Community 135"
Cohesion: 0.67
Nodes (3): gen_step(), Passive harvester assembly — fixed main_body_shell variant (v1 reference)., _tx()

## Knowledge Gaps
- **353 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `npx` (+348 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 41` to `Community 12`, `Community 17`, `Community 44`, `Community 49`, `Community 72`, `Community 88`, `Community 89`, `Community 90`, `Community 91`, `Community 92`, `Community 93`, `Community 95`, `Community 96`, `Community 97`, `Community 98`, `Community 99`, `Community 100`, `Community 101`, `Community 102`, `Community 103`, `Community 104`, `Community 105`, `Community 106`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `hono` connect `Community 17` to `Community 40`, `Community 41`, `Community 42`, `Community 12`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `yaml` connect `Community 44` to `Community 35`, `Community 6`, `Community 41`, `Community 54`, `Community 120`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _353 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.050837496326770495 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06398390342052314 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06954887218045112 - nodes in this community are weakly interconnected._