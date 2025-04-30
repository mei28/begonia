import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ShapControlsProps {
  ids: number[];
  selectedId: number | 'global';
  setSelectedId: (id: number | 'global') => void;
  useAbs: boolean;
  setUseAbs: (val: boolean) => void;
}

export const ShapControls: React.FC<ShapControlsProps> = ({
  ids,
  selectedId,
  setSelectedId,
  useAbs,
  setUseAbs,
}) => (
  <div className="flex flex-wrap items-center gap-6">
    <div className="flex flex-col gap-1">
      <Label htmlFor="instance-select">Instance</Label>
      <Select
        value={String(selectedId)}
        onValueChange={(val) =>
          setSelectedId(val === 'global' ? 'global' : parseInt(val))
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select instance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">Global (mean)</SelectItem>
          {ids.map((id) => (
            <SelectItem key={id} value={String(id)}>
              ID {id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="flex items-center gap-2">
      <Checkbox
        id="abs"
        checked={useAbs}
        onCheckedChange={(v) => setUseAbs(Boolean(v))}
      />
      <Label htmlFor="abs">Use absolute value</Label>
    </div>
  </div>
);

