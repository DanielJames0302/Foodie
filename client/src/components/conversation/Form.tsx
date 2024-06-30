import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useConversation from "../../hooks/useConversation";
import "./Form.scss";
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
    console.log(data.message)
    setValue("message", "", { shouldValidate: true });
    submitMutation.mutate({body: data.message, conversationId: Number(conversationId), image: ""});
  };

  const handleUpload = (result: any) => {
    makeRequest.post("/messages", {
      image: result.info.secure_url,
      conversationId: conversationId,
    });
  };
  return (
    <div className="form">
      <HiPhoto size={30} className="hi-photo" />
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder={"Write a message"}
        />

        <button type="submit" className="submit-btn">
          <HiPaperAirplane size={18} className="submit-icon" />
        </button>
      </form>
    </div>
  );
};

export default Form;
