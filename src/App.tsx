import { useState, useMemo } from 'react';
import { FileInput } from './components/FileInput';
import { InterpSlider } from './components/InterpSlider';
import { BarChartView } from './components/BarChartView';
import { ShapSelector } from './components/ShapSelector';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import type { ShapEntry } from './types/shap';
import { extractShaps, normalizeData, interpolate, toChart } from './utils/shap-utils';

export default function App() {
  const [shapListA, setShapListA] = useState<ShapEntry[] | null>(null);
  const [shapListB, setShapListB] = useState<ShapEntry[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | 'global'>('global');
  const [useAbs, setUseAbs] = useState(true);
  const [normalized, setNormalized] = useState(true);
  const [t, setT] = useState(0);

  const rawA = extractShaps(shapListA, selectedId, useAbs);
  const rawB = extractShaps(shapListB, selectedId, useAbs);

  const dataANorm = useMemo(() => normalized ? normalizeData(rawA) : rawA, [rawA, normalized]);
  const dataBNorm = useMemo(() => normalized ? normalizeData(rawB) : rawB, [rawB, normalized]);
  const mixed = useMemo(() => interpolate(dataANorm, dataBNorm, t), [dataANorm, dataBNorm, t]);

  return (
    <main className="min-h-screen bg-neutral-50 p-4 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Begonia – SHAP Interpolator
        </h1>

        {/* ファイル入力 */}
        <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <FileInput label="SHAP JSON – A" onLoad={(d) => setShapListA(d as ShapEntry[])} />
          <FileInput label="SHAP JSON – B" onLoad={(d) => setShapListB(d as ShapEntry[])} />
        </section>

        {/* コントロール UI */}
        <section className="flex flex-wrap items-center gap-6">
          <ShapSelector
            ids={shapListA?.map(d => d.id) ?? []}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />

          <div className="flex items-center gap-2">
            <Switch id="abs" checked={useAbs} onCheckedChange={setUseAbs} />
            <Label htmlFor="abs">Use absolute value</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="norm" checked={normalized} onCheckedChange={setNormalized} />
            <Label htmlFor="norm">Normalize</Label>
          </div>
        </section>

        {dataANorm && dataBNorm && (
          <>
            <InterpSlider value={t} onChange={setT} />

            {/* 補完後チャート */}
            <div className="w-full">
              <h2 className="mb-2 text-lg font-medium text-neutral-800 dark:text-neutral-200 text-center">
                Mixed (t = {t.toFixed(1)})
              </h2>
              <BarChartView data={toChart(mixed)} normalized={normalized} />
            </div>

            <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-center text-md font-medium text-neutral-700 dark:text-neutral-300">
                  Instance A
                </h3>
                <BarChartView data={toChart(dataANorm)} normalized={normalized} />
              </div>
              <div>
                <h3 className="mb-2 text-center text-md font-medium text-neutral-700 dark:text-neutral-300">
                  Instance B
                </h3>
                <BarChartView data={toChart(dataBNorm)} normalized={normalized} />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
