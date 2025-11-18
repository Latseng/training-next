import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

interface TempVolume {
  id: string;
  repetition: number;
  weight: number;
}

interface TempActivityRecordListProps {
  activityRecordTemp: TempVolume[]
  handleSetVolume: (id: string, set: number) => void;
  handleActivityRecordTempDelete: (id: string) => void;
}

const TempActivityRecordList = ({
  activityRecordTemp,
  handleSetVolume,
  handleActivityRecordTempDelete,
}: TempActivityRecordListProps) => {
  
  return (
    <>
    <h4 className="font-semibold my-4">資料尚未儲存</h4>
      {activityRecordTemp.map((item, index) => (
        <div key={item.id} className="mb-8 flex justify-around items-center">
          <p>Set {index + 1}</p>
          <div className="text-center space-y-2">
            <p>Weight</p>
            <p>{item.weight}（Kg）</p>
          </div>
          <div className="text-center space-y-2">
            <p>Reps</p>
            <p>{item.repetition}</p>
          </div>
          <ButtonGroup>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSetVolume(item.id, index + 1)}
            >
              <SquarePen />
            </Button>
            <Button
              className="hover:bg-red-600 hover:text-white"
              variant="ghost"
              size="sm"
              onClick={() => handleActivityRecordTempDelete(item.id)}
            >
              <Trash2 />
            </Button>
          </ButtonGroup>
        </div>
      ))}
    </>
  );
};

export default TempActivityRecordList