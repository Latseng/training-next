import { LoaderCircle } from "lucide-react";
import { Button } from "./ui/button"

interface SubmitButtonProps {
  actionName: string;
  isSubmitting: boolean;
}

const SubmitButton = ({ actionName, isSubmitting }:SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? <LoaderCircle className="animate-spin" /> : actionName}
    </Button>
  );
};

export default SubmitButton