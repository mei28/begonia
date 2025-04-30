import { useState, useMemo } from 'react';
import { FileInput } from './FileInput';
import { ShapControls } from './ShapControls';
import { BarChartView } from './BarChartView';
import type { ShapEntry } from '@/types/shap';

export const ShapViewer: React.FC = () => {
  const [data, setData] = useState<ShapEntry[]>([]);
  const [selectedId, setSelectedId] = useState<number | 'global'>('global');
  const [useAbs, setUseAbs] = useState<boolean>(false);

  const currentData = useMemo(() => {
    if (data.length === 0) return [];

    const getShaps = (shaps: Record<string, number>) =>
      Object.entries(shaps).map(([label, value]) => ({
        label,
        value: useAbs ? Math.abs(value) : value,
      }));

    if (selectedId === 'global') {
      const meanShaps: Record<string, number> = {};
      data.forEach((entry) => {
        for (const key in entry.shaps) {
          meanShaps[key] = (meanShaps[key] ?? 0) + entry.shaps[key];
        }
      });
      for (const key in meanShaps) {
        meanShaps[key] /= data.length;
      }
      return getShaps(meanShaps);
    }

    const entry = data.find((d) => d.id === selectedId);
    return entry ? getShaps(entry.shaps) : [];
  }, [data, selectedId, useAbs]);

  return (
    <div className="flex flex-col gap-4">
      <FileInput
        label="Load SHAP JSON"
        onLoad={(d) => setData(d as ShapEntry[])}
      />
      {data.length > 0 && (
        <>
          <ShapControls
            ids={data.map((d) => d.id)}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            useAbs={useAbs}
            setUseAbs={setUseAbs}
          />
          <BarChartView data={currentData} />
        </>
      )}
    </div>
  );
};

