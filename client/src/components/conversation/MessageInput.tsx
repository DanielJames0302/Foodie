import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import "./MessageInput.scss"

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors
}

const MessageInput:React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors
}) => {
  return (
    <div className="message-input">
      <input 
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, {required})}
        placeholder={placeholder}
        
      />
    </div>
  )
}

export default MessageInput
