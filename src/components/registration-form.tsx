'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(1),
  contact: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  designation: z.string().optional(),
  city: z.string().min(1),
  country: z.string().min(1),
  attendanceType: z.enum(['Exhibitor', 'Visitor']),
});

type FormData = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await axios.post('https://your-laravel-domain.com/api/expo-registration', data);
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <Card className="w-full py-0 pb-6 shadow-xl border border-gray-200 overflow-hidden">
          {/* Banner on top */}
          <div className="w-full h-auto aspect-[1193/296]">
            <Image
              src="/banner.png" // place image in public/banner.jpg
              alt="Expo Banner"
              width={1193}
              height={296}
              className="w-full h-full object-cover"
            />
          </div>

          <CardHeader className="text-center mt-3 mb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Register for the Hotel Supply & Hospitality Expo
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the form below to confirm your attendance
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {[
                { label: 'الاسم / Your Name', name: 'name' },
                { label: 'رقم الجوال / Contact Number', name: 'contact' },
                { label: 'البريد / Email', name: 'email' },
                { label: 'اسم الشركة / Company Name', name: 'company' },
                { label: 'المنصب / Designation', name: 'designation' },
                { label: 'مدينة / City', name: 'city' },
                { label: 'دولة / Country', name: 'country' },
              ].map(({ label, name }) => (
                <div key={name} className="flex flex-col gap-1">
                  <Label htmlFor={name} className="text-sm text-gray-700 font-medium pb-2">
                    {label}
                  </Label>
                  <Input
                    id={name}
                    className="rounded-md border border-gray-300 focus-visible:ring-2 focus-visible:ring-primary px-4 py-2 text-base"
                    {...register(name as keyof FormData)}
                  />
                  {errors[name as keyof FormData] && (
                    <p className="text-sm text-red-500">
                      {errors[name as keyof FormData]?.message}
                    </p>
                  )}
                </div>
              ))}


<div className="space-y-2">
  <Label className="text-sm text-gray-700 font-medium block mb-1 pb-2">
    الحضور كـ / Attending as
  </Label>

  <RadioGroup
    defaultValue="Visitor"
    className="flex items-center gap-6"
    {...register("attendanceType")}
  >
    {["Exhibitor", "Visitor"].map((value) => (
      <div key={value} className="flex items-center gap-2">
        <RadioGroupItem
          value={value}
          id={`attend-${value}`}
          className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          {...register("attendanceType")}
        />
        <Label
          htmlFor={`attend-${value}`}
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {value}
        </Label>
      </div>
    ))}
  </RadioGroup>

  {errors.attendanceType && (
    <p className="text-sm text-red-500 mt-1">{errors.attendanceType.message}</p>
  )}
</div>



              <Button
  type="submit"
  disabled={submitting}
  className="w-full h-12 mt-12 rounded-md bg-primary text-white text-base font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
>
  {submitting && <Loader2 className="animate-spin h-5 w-5" />}
  {submitting ? 'Submitting...' : 'Submit'}
</Button>


              {success && (
                <p className="text-green-600 text-center text-sm mt-2">
                  Form submitted successfully!
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
