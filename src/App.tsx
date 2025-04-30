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
  const [selectedIdA, setSelectedIdA] = useState<number | 'global'>('global');
  const [selectedIdB, setSelectedIdB] = useState<number | 'global'>('global');
  const [t, setT] = useState(0);
  const [normalized, setNormalized] = useState(true);

  const rawA = extractShaps(shapListA, selectedIdA);
  const rawB = extractShaps(shapListB, selectedIdB);

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

        {/* セレクトボックス */}
        <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <ShapSelector label="Instance A" ids={shapListA?.map(d => d.id) ?? []} selectedId={selectedIdA} setSelectedId={setSelectedIdA} />
          <ShapSelector label="Instance B" ids={shapListB?.map(d => d.id) ?? []} selectedId={selectedIdB} setSelectedId={setSelectedIdB} />
        </section>

        {dataANorm && dataBNorm && (
          <>
            <div className="flex w-full max-w-xl items-center justify-between gap-4">
              <InterpSlider value={t} onChange={setT} />
              <Label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <span>Normalize</span>
                <Switch checked={normalized} onCheckedChange={setNormalized} className={clsx('flex h-5 w-10 items-center rounded-full bg-neutral-300 p-0.5', 'data-[state=checked]:bg-blue-500', 'dark:bg-neutral-700 dark:data-[state=checked]:bg-blue-500')}>
                  <span className={clsx('h-4 w-4 transform rounded-full bg-white transition-transform', 'data-[state=checked]:translate-x-5')} />
                </Switch>
              </Label>
            </div>

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
