import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useConversation from "../../hooks/useConversation";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      body: "",
    },
  });
  const submitMutation = useMutation({
    mutationFn: (data: Object) => {
      return makeRequest.post("/messages", data);
    },
  })
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    submitMutation.mutate({body: data.message, conversationId: Number(conversationId), image: ""});
  };


  return (
    <div className="py-2 
        px-3 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        w-full
        flex-shrink-0">
      <HiPhoto size={24} className="text-sky-500 flex-shrink-0" />
      <form className="flex items-center gap-2 w-full" onSubmit={handleSubmit(onSubmit)} action="">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder={"Write a message"}
        />

        <button type="submit" className="
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
            flex-shrink-0
          ">
          <HiPaperAirplane size={16} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
