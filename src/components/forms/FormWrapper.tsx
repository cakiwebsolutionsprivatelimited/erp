import * as React from "react"
import { useForm, UseFormReturn, FieldValues, UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodSchema } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface FormWrapperProps<T extends FieldValues> {
  schema: ZodSchema<T>
  defaultValues: UseFormProps<T>["defaultValues"]
  onSubmit: (values: T) => void | Promise<void>
  children: (methods: UseFormReturn<T>) => React.ReactNode
  submitLabel?: string
  isLoading?: boolean
  className?: string
}

export function FormWrapper<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  submitLabel = "Save Changes",
  isLoading = false,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <Form {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit)} 
        className={className}
      >
        <div className="space-y-8">
          {children(methods)}
          
          <div className="flex items-center justify-end gap-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => methods.reset()}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
