import React, { useState } from "react"
import { PageContainer, SectionHeader } from "@/components/common/PageLayout"
import { FormWrapper } from "@/components/forms/FormWrapper"
import { FormInput, FormSelect, FormTextarea, FormCheckbox, FormSection } from "@/components/forms/FormComponents"
import { userSchema, UserFormData } from "@/utils/validation-utils"
import { toast } from "sonner"

const ProfileFormPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: UserFormData) => {
    setIsSubmitting(true)
    console.log("Form Values:", values)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    toast.success("Profile updated successfully!")
  }

  const defaultValues: UserFormData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "admin",
    bio: "I am a software engineer.",
    notifications: true,
  }

  return (
    <PageContainer>
      <SectionHeader 
        title="User Profile" 
        description="Manage your account settings and profile information."
      />

      <div className="max-w-4xl bg-background border rounded-2xl p-8 shadow-sm">
        <FormWrapper
          schema={userSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Update Profile"
        >
          {() => (
            <>
              <FormSection title="Personal Information" description="Basic details about you.">
                <FormInput name="firstName" label="First Name" placeholder="Enter first name" />
                <FormInput name="lastName" label="Last Name" placeholder="Enter last name" />
                <FormInput name="email" label="Email Address" type="email" placeholder="john@company.com" />
                <FormSelect 
                  name="role" 
                  label="System Role" 
                  options={[
                    { label: "Administrator", value: "admin" },
                    { label: "Manager", value: "manager" },
                    { label: "Standard User", value: "user" },
                  ]} 
                />
              </FormSection>

              <FormSection title="About You" description="Write a short bio.">
                <FormTextarea 
                  name="bio" 
                  label="Biography" 
                  placeholder="Tell us a little bit about yourself" 
                  className="md:col-span-2"
                />
              </FormSection>

              <FormSection title="Preferences" description="Manage your application settings.">
                <FormCheckbox 
                  name="notifications" 
                  label="Email Notifications" 
                  description="Receive weekly summaries and important updates via email."
                  className="md:col-span-2"
                />
              </FormSection>
            </>
          )}
        </FormWrapper>
      </div>
    </PageContainer>
  )
}

export default ProfileFormPage
