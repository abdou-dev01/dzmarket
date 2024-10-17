import { RxExclamationTriangle } from "react-icons/rx";

type FormErrorProps = {
  message?: string;
};

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex justify-center items-center p-3 rounded-md gap-2 bg-destructive/10 text-destructive">
      <RxExclamationTriangle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
