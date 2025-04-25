import { useMemo, useState } from 'react';
import { FileInput } from './components/FileInput';
import { InterpSlider } from './components/InterpSlider';
import { BarChartView, ChartDatum } from './components/BarChartView';
import { Switch } from '@radix-ui/react-switch';
import clsx from 'clsx';

/* ────────────────────────────────────────────────────────── */
/* ユーティリティ関数                                         */
/* ────────────────────────────────────────────────────────── */

function toChart(data: Record<string, number> | null): ChartDatum[] {
  if (!data) return [];
  return Object.entries(data).map(([label, value]) => ({ label, value }));
}

/** [-5,5] → [0,1] へ写像した線形補完 */
function interpolate(
  a: Record<string, number> | null,
  b: Record<string, number> | null,
  t: number,
): Record<string, number> | null {
  if (!a || !b) return null;
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  const out: Record<string, number> = {};
  keys.forEach((k) => {
    out[k] = (a[k] ?? 0) * (1 - t) + (b[k] ?? 0) * t;
  });
  return out;
}
/** 各データセットごとに最大値で割って [0,1] に正規化 */
function normalizeData(
  data: Record<string, number> | null,
): Record<string, number> | null {
  if (!data) return null;
  const max = Math.max(...Object.values(data));
  if (max === 0) return data;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(data)) out[k] = v / max;
  return out;
}

/* ────────────────────────────────────────────────────────── */
/* メインコンポーネント                                       */
/* ────────────────────────────────────────────────────────── */

export default function App() {
  const [dataA, setDataA] = useState<Record<string, number> | null>(null);
  const [dataB, setDataB] = useState<Record<string, number> | null>(null);
  const [t, setT] = useState(0);              // 補完係数 [-5,5]
  const [normalized, setNormalized] = useState(false); // 正規化トグル

  /* 正規化処理（トグル依存） */
  const dataANorm = useMemo(
    () => (normalized ? normalizeData(dataA) : dataA),
    [dataA, normalized],
  );
  const dataBNorm = useMemo(
    () => (normalized ? normalizeData(dataB) : dataB),
    [dataB, normalized],
  );

  /* 線形補完 */
  const mixed = useMemo(
    () => interpolate(dataANorm, dataBNorm, t),
    [dataANorm, dataBNorm, t],
  );

  /* グラフ用に配列へ変換 */
  const chartA = useMemo(() => toChart(dataANorm), [dataANorm]);
  const chartB = useMemo(() => toChart(dataBNorm), [dataBNorm]);
  const chartMix = useMemo(() => toChart(mixed), [mixed]);

  return (
    <main className="min-h-screen bg-neutral-50 p-4 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Begonia – JSON Bar Interpolator
        </h1>

        {/* ファイル入力 */}
        <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <FileInput label="JSON File – A" onLoad={setDataA} />
          <FileInput label="JSON File – B" onLoad={setDataB} />
        </section>

        {/* A と B の両方が揃ったら可視化 */}
        {dataANorm && dataBNorm && (
          <>
            {/* スライダー ＋ 正規化トグル */}
            <div className="flex w-full max-w-xl items-center justify-between gap-4">
              <InterpSlider value={t} onChange={setT} />

              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <span>Normalize</span>
                <Switch
                  checked={normalized}
                  onCheckedChange={setNormalized}
                  className={clsx(
                    'flex h-5 w-10 items-center rounded-full bg-neutral-300 p-0.5',
                    'data-[state=checked]:bg-blue-500',
                    'dark:bg-neutral-700 dark:data-[state=checked]:bg-blue-500',
                  )}
                >
                  <span
                    className={clsx(
                      'h-4 w-4 transform rounded-full bg-white transition-transform',
                      'data-[state=checked]:translate-x-5',
                    )}
                  />
                </Switch>
              </label>
            </div>

            {/* 補完後チャート */}
            <div className="w-full">
              <h2 className="mb-2 text-lg font-medium text-neutral-800 dark:text-neutral-200 text-center">
                Mixed (t = {t.toFixed(1)})
              </h2>
              <BarChartView data={chartMix} normalized={normalized} />
            </div>

            {/* 元データ 2 つを並べて表示 */}
            <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-center text-md font-medium text-neutral-700 dark:text-neutral-300">
                  Dataset A
                </h3>
                <BarChartView data={chartA} normalized={normalized} />
              </div>
              <div>
                <h3 className="mb-2 text-center text-md font-medium text-neutral-700 dark:text-neutral-300">
                  Dataset B
                </h3>
                <BarChartView data={chartB} normalized={normalized} />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

