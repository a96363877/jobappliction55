import { FormValues } from "@/components/job-application-form"
import { createServerSupabaseClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export async function submitApplication(formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    // Generate unique IDs for file names to prevent collisions
    const idFrontId = uuidv4()
    const idBackId = uuidv4()
    const cvId = uuidv4()

    // Extract files from formData
    const idFrontFile = formData.get("idFront") as File
    const idBackFile = formData.get("idBack") as File
    const cvFile = formData.get("cv") as File

    if (!idFrontFile || !idBackFile || !cvFile) {
      throw new Error("Missing required files")
    }

    // Upload files to Supabase Storage
    const [idFrontUpload, idBackUpload, cvUpload] = await Promise.all([
      supabase.storage.from("application_documents").upload(`id_front/${idFrontId}`, idFrontFile, {
        contentType: idFrontFile.type,
        upsert: true,
      }),
      supabase.storage.from("application_documents").upload(`id_back/${idBackId}`, idBackFile, {
        contentType: idBackFile.type,
        upsert: true,
      }),
      supabase.storage.from("application_documents").upload(`cv/${cvId}`, cvFile, {
        contentType: cvFile.type,
        upsert: true,
      }),
    ])

    if (idFrontUpload.error || idBackUpload.error || cvUpload.error) {
      throw new Error("Error uploading files")
    }

    // Get public URLs for the uploaded files
    const { data: idFrontUrl } = supabase.storage.from("application_documents").getPublicUrl(`id_front/${idFrontId}`)

    const { data: idBackUrl } = supabase.storage.from("application_documents").getPublicUrl(`id_back/${idBackId}`)

    const { data: cvUrl } = supabase.storage.from("application_documents").getPublicUrl(`cv/${cvId}`)

    // Extract form data
    const applicationData = {
      full_name: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      date_of_birth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth") as string).toISOString() : null,
      gender: formData.get("gender") as string,
      nationality: formData.get("nationality") as string,
      address: formData.get("address") as string,
      position: formData.get("position") as string,
      department: formData.get("department") as string,
      experience: formData.get("experience") as string,
      education: formData.get("education") as string,
      specialization: formData.get("specialization") as string,
      linkedin_profile: (formData.get("linkedinProfile") as string) || null,
      expected_salary: formData.get("expectedSalary") as string,
      start_date: formData.get("startDate") ? new Date(formData.get("startDate") as string).toISOString() : null,
      cover_letter: (formData.get("coverLetter") as string) || null,
      id_front_url: idFrontUrl.publicUrl,
      id_back_url: idBackUrl.publicUrl,
      cv_url: cvUrl.publicUrl,
      status: "pending",
    }

    // Insert data into the job_applications table
    const { error } = await supabase.from("job_applications").insert(applicationData)

    if (error) {
      console.error("Database error:", error)
      throw new Error("Error saving application data")
    }

    return { success: true, message: "تم إرسال طلبك بنجاح" }
  } catch (error) {
    console.error("Application submission error:", error)
    return { success: false, message: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى" }
  }
}
