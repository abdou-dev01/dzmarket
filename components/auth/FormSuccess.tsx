import { CheckCircle2Icon } from "lucide-react";

type FormSuccessProps = {
  message?: string;
};

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="flex justify-center items-center p-3 rounded-md gap-2 bg-emerald-500/10 text-emerald-500">
      <CheckCircle2Icon className="w-5 h-5" />
      <p className="capitalize">{message}</p>
    </div>
  );
};

export default FormSuccess;
