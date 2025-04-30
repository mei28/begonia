import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ShapSelectorProps {
  ids: number[];
  selectedId: number | 'global';
  setSelectedId: (id: number | 'global') => void;
}

export const ShapSelector: React.FC<ShapSelectorProps> = ({ ids, selectedId, setSelectedId }) => (
  <div className="flex flex-col gap-1">
    <Label>Instance ID</Label>
    <Select
      value={String(selectedId)}
      onValueChange={(val) => setSelectedId(val === 'global' ? 'global' : parseInt(val))}
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
);
