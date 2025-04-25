import * as SliderPrimitive from '@radix-ui/react-slider';
import clsx from 'clsx';

interface InterpSliderProps {
  value: number; // current t [-5,5]
  onChange: (t: number) => void;
}

export const InterpSlider: React.FC<InterpSliderProps> = ({ value, onChange }) => (
  <div className="w-full max-w-xl py-4">
    <SliderPrimitive.Root
      min={-2}
      max={3}
      step={0.1}
      value={[value]}
      onValueChange={(v) => onChange(v[0])}
      className="relative flex h-5 touch-none select-none items-center"
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-neutral-300 dark:bg-neutral-700">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-blue-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={clsx(
          'block h-4 w-4 rounded-full border-2 border-blue-500 bg-white',
          'focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75',
        )}
      />
    </SliderPrimitive.Root>
    <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-300">t = {value.toFixed(1)}</p>
  </div>
);
