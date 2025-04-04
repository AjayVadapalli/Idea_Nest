"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import { toast} from "sonner";

const StartupForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");
    const router = useRouter();


    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
          const formValues = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            link: formData.get("link") as string,
            pitch,
          };
    
          await formSchema.parseAsync(formValues);

        const result = await createPitch(prevState, formData, pitch);

        if (result.status === "SUCCESS") {
          toast.success("Your startup pitch has been created successfully");
          router.push(`/startup/${result._id}`);
        }

        return result;
    
        } catch (error) {
          if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
    
            setErrors(fieldErrors as unknown as Record<string, string>);
    
            toast("Error", {
                description: "Please check your inputs and try again",
                style: {
                  backgroundColor: "#f56565",
                  color: "#fff",
                },
            });
    
            return { ...prevState, error: "Validation failed", status: "ERROR" };
          }

        toast("Error", {
            description: "An unexpected error has occurred",
            style: {
              backgroundColor: "#f56565",
              color: "#fff",
            },
        });
    
          return {
            ...prevState,
            error: "An unexpected error has occurred",
            status: "ERROR",
          };
        }
      };
    
      const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
      });

    return (
        <form action={formAction} className="startup-form">
        <div>
          <label htmlFor="title" className="startup-form_label">
            Title
          </label>
          <Input
            id="title"
            name="title"
            className="startup-form_input border-[3px] border-black px-5 py-7 text-[18px] text-black font-semibold rounded-full mt-3 placeholder:text-black-300"
            required
            placeholder="Startup Title"
          />
  
        {errors.title && <p className="text-red-500 mt-2 ml-5">{errors.title}</p>}
        </div>
  
        <div>
          <label htmlFor="description" className="startup-form_label">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            className="startup-form_textarea border-[3px] border-black p-5 text-[18px] text-black font-semibold rounded-[20px] mt-3 placeholder:text-black-300"
            required
            placeholder="Startup Description"
          />
  
          {errors.description && (
            <p className="text-red-500 mt-2 ml-5">{errors.description}</p>
          )}
        </div>
  
        <div>
          <label htmlFor="category" className="startup-form_label">
            Category
          </label>
          <Input
            id="category"
            name="category"
            className="startup-form_input border-[3px] border-black px-5 py-7 text-[18px] text-black font-semibold rounded-full mt-3 placeholder:text-black-300"
            required
            placeholder="Startup Category (Tech, Health, Education...)"
          />
  
          {errors.category && (
            <p className="text-red-500 mt-2 ml-5">{errors.category}</p>
          )}
        </div>
  
        <div>
          <label htmlFor="link" className="startup-form_label">
            Image URL
          </label>
          <Input
            id="link"
            name="link"
            className="startup-form_input border-[3px] border-black px-5 py-7 text-[18px] text-black font-semibold rounded-full mt-3 placeholder:text-black-300"
            required
            placeholder="Startup Image URL"
          />
  
            {errors.link && <p className="text-red-500 mt-2 ml-5">{errors.link}</p>}
        </div>
  
        <div data-color-mode="light">
          <label htmlFor="pitch" className="startup-form_label">
            Pitch
          </label>
  
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 20, overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Briefly describe your idea and what problem it solves",
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
  
          {errors.pitch && <p className="text-red-500 mt-2 ml-5">{errors.pitch}</p>}
        </div>
  
        <Button
          type="submit"
          className="startup-form_btn bg-primary border-[4px] border-black rounded-full p-5 min-h-[70px] w-full font-bold text-[18px] text-white"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Your Pitch"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>
    );
}

export default StartupForm