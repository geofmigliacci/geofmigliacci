"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  DiagramFrame,
  Meter,
  ModeToggle,
  type Point,
  Readout,
  SvgEdge,
  SvgNode,
  SvgPacket,
  SvgStack,
} from "@/components/diagram/diagram";
import { cpuFor } from "@/components/diagram/geometry";

type Mode = "without" | "with";

interface Request {
  id: number;
  client: number;
}

const MODE_OPTIONS = [
  { value: "without", label: "Sans token" },
  { value: "with", label: "Avec token" },
] as const satisfies readonly { value: Mode; label: string }[];

const VIEW = { w: 320, h: 210 };
const CLIENT = { x: 8, width: 58, height: 34 };
const CLIENT_TOPS = [8, 78, 148];
const CLIENT_BURSTS = [3, 2, 1];
const SERVER = { x: 128, y: 72, width: 64, height: 46 };
const SQL = { x: 248, y: 75, width: 64, height: 40 };
const STACK = { x: 248, top: 123, width: 64 };

const RAIL_Y = 95;
const TRUNK_X = 100;
const SERVER_LEFT: Point = { x: SERVER.x, y: RAIL_Y };
const SERVER_CENTER: Point = { x: SERVER.x + SERVER.width / 2, y: RAIL_Y };
const SERVER_RIGHT: Point = { x: SERVER.x + SERVER.width, y: RAIL_Y };
const SQL_LEFT: Point = { x: SQL.x, y: RAIL_Y };
const SQL_CENTER: Point = { x: SQL.x + SQL.width / 2, y: RAIL_Y };

const clientRight = (index: number): Point => ({
  x: CLIENT.x + CLIENT.width,
  y: CLIENT_TOPS[index] + CLIENT.height / 2,
});

const clientEdge = (index: number): Point[] => [
  clientRight(index),
  { x: TRUNK_X, y: clientRight(index).y },
  { x: TRUNK_X, y: RAIL_Y },
  SERVER_LEFT,
];

const packetPath = (index: number): Point[] => [
  clientRight(index),
  { x: TRUNK_X, y: clientRight(index).y },
  { x: TRUNK_X, y: RAIL_Y },
  SERVER_CENTER,
  SQL_CENTER,
];

const STACK_CAP = CLIENT_BURSTS.reduce((sum, burst) => sum + burst, 0);
const SEND_GAP_MS = 320;
const TRAVEL_MS = 680;
const CLIENT_STAGGER_MS = 820;
const LINGER_MS = 1000;
const HOLD_MS = 1500;
const RESET_GAP_MS = 600;

export function RequestStorm() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("without");
  const [flying, setFlying] = useState<Request[]>([]);
  const [stacked, setStacked] = useState<Request[]>([]);
  const [cut, setCut] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    let nextId = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });
    const spawn = (client: number) => {
      if (cancelled) return;
      const id = nextId++;
      setFlying((current) => [...current, { id, client }]);
    };
    const disconnect = (client: number) => {
      setCut((current) => current.map((v, i) => (i === client ? true : v)));
      if (mode === "with") {
        setFlying((current) => current.filter((r) => r.client !== client));
        setStacked((current) => current.filter((r) => r.client !== client));
      }
    };

    const run = async () => {
      while (!cancelled) {
        setStacked([]);
        setFlying([]);
        setCut([false, false, false]);
        await wait(RESET_GAP_MS);
        if (cancelled) return;

        const events: { at: number; act: () => void }[] = [];
        for (let client = 0; client < CLIENT_BURSTS.length; client++) {
          const start = client * CLIENT_STAGGER_MS;
          for (let shot = 0; shot < CLIENT_BURSTS[client]; shot++) {
            events.push({
              at: start + shot * SEND_GAP_MS,
              act: () => spawn(client),
            });
          }
          const leave =
            start + (CLIENT_BURSTS[client] - 1) * SEND_GAP_MS + LINGER_MS;
          events.push({ at: leave, act: () => disconnect(client) });
        }
        events.sort((a, b) => a.at - b.at);

        let elapsed = 0;
        for (const event of events) {
          if (event.at > elapsed) {
            await wait(event.at - elapsed);
            if (cancelled) return;
            elapsed = event.at;
          }
          event.act();
        }

        await wait(HOLD_MS);
        if (cancelled) return;
      }
    };

    run();

    return () => {
      cancelled = true;
      for (const timer of timers) clearTimeout(timer);
    };
  }, [reducedMotion, mode]);

  const staticCut = [true, true, true];
  const staticStacked: Request[] =
    mode === "without"
      ? Array.from({ length: STACK_CAP }, (_, i) => ({ id: i, client: 0 }))
      : [];

  const shownCut = reducedMotion ? staticCut : cut;
  const shownStacked = reducedMotion ? staticStacked : stacked;
  const shownFlying = reducedMotion ? [] : flying;

  const cpu = cpuFor(shownStacked.length);
  const sqlTone =
    cpu >= 90 ? "alert" : shownStacked.length > 0 ? "active" : "default";
  const connectedCount = shownCut.filter((gone) => !gone).length;
  const stackItems = shownStacked.map((request) => ({ key: request.id }));

  const handleArrive = (request: Request) => {
    setFlying((current) => current.filter((r) => r.id !== request.id));
    setStacked((current) => [...current, request]);
  };

  return (
    <DiagramFrame
      controls={
        <ModeToggle<Mode>
          value={mode}
          onChange={setMode}
          options={MODE_OPTIONS}
          ariaLabel="Comparer sans et avec CancellationToken"
        />
      }
      caption="Chaque client rafraîchit, puis ferme l'onglet. Sans jeton d'annulation, ses requêtes continuent de tourner côté base et s'empilent. Avec le jeton, elles s'arrêtent quand il part, et la charge reste bornée."
    >
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="h-auto w-full"
        role="img"
        aria-label="Trois clients envoient des requêtes à un serveur ASP.NET Core, qui les relaie à SQL Server. Quand un client se déconnecte, ses requêtes s'empilent côté base sans jeton d'annulation, et s'annulent avec."
      >
        {CLIENT_TOPS.map((top, index) => (
          <SvgEdge
            key={`edge-${top}`}
            points={clientEdge(index)}
            cut={shownCut[index]}
          />
        ))}
        <SvgEdge points={[SERVER_RIGHT, SQL_LEFT]} />

        {shownFlying.map((request) => (
          <SvgPacket
            key={request.id}
            points={packetPath(request.client)}
            travelMs={TRAVEL_MS}
            tone="active"
            onArrive={() => handleArrive(request)}
          />
        ))}

        {CLIENT_TOPS.map((top, index) => (
          <SvgNode
            key={`client-${top}`}
            x={CLIENT.x}
            y={top}
            width={CLIENT.width}
            height={CLIENT.height}
            label="Client"
            sublabel={shownCut[index] ? "parti" : "connecté"}
            tone={shownCut[index] ? "muted" : "active"}
            badge={shownCut[index] ? "×" : undefined}
          />
        ))}
        <SvgNode
          x={SERVER.x}
          y={SERVER.y}
          width={SERVER.width}
          height={SERVER.height}
          label="Serveur"
          sublabel="ASP.NET Core"
        />
        <SvgNode
          x={SQL.x}
          y={SQL.y}
          width={SQL.width}
          height={SQL.height}
          label="SQL Server"
          sublabel="requêtes"
          tone={sqlTone}
        />

        <SvgStack
          items={stackItems}
          x={STACK.x}
          top={STACK.top}
          width={STACK.width}
        />
      </svg>

      <div className="mt-6 flex items-end justify-between border-foreground/10 border-t pt-5">
        <div className="flex gap-8">
          <Readout label="Requêtes actives" value={shownStacked.length} />
          <Readout label="Clients connectés" value={connectedCount} />
        </div>
        <div className="w-36">
          <Meter label="CPU base" value={cpu} tone="active" />
        </div>
      </div>
    </DiagramFrame>
  );
}
