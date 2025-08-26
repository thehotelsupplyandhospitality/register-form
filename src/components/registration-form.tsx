'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';


export const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name.' }),
  contact: z
    .string()
    .min(3, { message: 'Please enter your contact number.' }),
  email: z.string().email({ message: 'Please enter a email address.' }),
  company: z.string().min(1, { message: 'Please enter your company.' }),
  designation: z.string().nullable().optional(),
  city: z.string().min(1, { message: 'Please enter your city.' }),
  country: z.string().min(1, { message: 'Please enter your country.' }),
  attendanceType: z.enum(['Exhibitor', 'Visitor'], {
    required_error: 'Please select how you are attending.',
  }),
});


type FormData = z.infer<typeof formSchema>;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grecaptcha: any;
  }
}

export default function RegistrationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });


  const requiredFields = ['name', 'contact', 'email', 'company', 'city', 'country'];


  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
  
    try {
      const token = await window.grecaptcha.execute('6LczrR0rAAAAAOgAYqgFiME6l-Sl5bs1ErIKJQla', { action: 'submit' });
  
  
      await axios.post('https://www.jeddah-vision.com/expo-registration', {
        ...data,
        captchaToken: token,
      });
  
      setSuccess(true);
      setShowForm(false);
      reset();
      //setTimeout(() => setShowForm(true), 3000);

    } catch (error) {
      console.error('reCAPTCHA or form submit failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="w-full">
   
      <Image
        src="/banner.png"
        alt="Expo Banner"
        width={1193}
        height={296}
        className="w-full h-auto object-cover"
      />


      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-[5%] py-10">
        <div className="w-full max-w-7xl flex flex-col-reverse md:flex-row gap-10">

          <div className="flex-1 flex flex-col  space-y-4">
           <h2 className="text-3xl font-bold text-gray-800 leading-snug mt-4"> 
  Explore ASEAN Expo 2025
</h2>
<p className="text-gray-600 text-sm leading-relaxed max-w-md">
  Step into a vibrant hub where global industries, visionary leaders, and cultural showcases come together. At the ASEAN Expo 2025, discover new markets, forge powerful connections, and experience the future of collaboration across Asia and beyond.
</p>

            <div className="w-full aspect-video mt-4">
  <iframe
    className="w-full h-full rounded-md shadow-md"
    src="https://www.youtube.com/embed/uYUofwPcKzY?controls=0&modestbranding=1&rel=0&showinfo=0"
    title="Hotel Supply & Hospitality 2024 Expo - Jeddah, Saudi Arabia"
  
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
<div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl  border border-gray-200 text-center space-y-2">
<div className="flex flex-row items-center justify-center gap-x-12 bg-white p-3">
  <Image
    src="/JVLogo.svg"
    alt="Jeddah Vision Logo"
    width={180}
    height={180}
    className="object-contain"
  />
  <Image
    src="/NajoomTechLogo-cropped.svg"
    alt="Najoom Tech"
    width={220}
    height={220}
    className="object-contain"
  />
</div>



  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700 pt-2">
    <div>
      <p className="font-semibold text-gray-800 mb-1">Website</p>
      <a
        href="https://www.jeddah-vision.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        www.jeddah-vision.com
      </a>
    </div>
    <div>
      <p className="font-semibold text-gray-800 mb-1">Phone</p>
      <p>0548037872</p>
    </div>
    <div>
      <p className="font-semibold text-gray-800 mb-1">Email</p>
      <p>info@jeddah-vision.com</p>
    </div>
  </div>
</div>

          </div>

          {/* RIGHT: Form */}
          <div className="flex-1">
          {showForm ? (
            <Card className="w-full shadow-xl border border-gray-200">
              <CardContent className="py-8">
            
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {[
                    { label: 'Your Name', name: 'name' },
                    { label: 'Contact Number', name: 'contact' },
                    { label: 'Email', name: 'email' },
                    { label: 'Company Name', name: 'company' },
                    { label: 'Designation', name: 'designation' },
                    { label: 'City', name: 'city' },
                    { label: 'Country', name: 'country' },
                  ].map(({ label, name }) => (
                    <div key={name} className="flex flex-col gap-1">
                      <Label htmlFor={name} className="text-sm text-gray-700 font-medium pb-2">{label}
                      {requiredFields.includes(name) && (
                        <span style={{ color: 'red' }}>*</span>
                      )}
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
                      Attending as <span style={{ color: 'red' }}>*</span>
                    </Label>

                    <Controller
  name="attendanceType"
  control={control}
  defaultValue="Visitor"
  render={({ field }) => (
    <RadioGroup
      value={field.value}
      onValueChange={field.onChange}
      className="flex items-center gap-6"
    >
      {['Exhibitor', 'Visitor'].map((value) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem
            value={value}
            id={`attend-${value}`}
            className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
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
  )}
/>

                    {errors.attendanceType && (
                      <p className="text-sm text-red-500 mt-1">{errors.attendanceType.message}</p>
                    )}
                  </div>

                  
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 mt-8 rounded-md bg-primary text-white text-base font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center cursor-pointer gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-xl border border-gray-200">
              <CardContent className="py-14 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="text-green-500 w-12 h-12 mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">Registration Submitted</h3>
                <p className="text-sm text-gray-600 max-w-sm mt-2">
                  Thank you! Your registration has been received. You will receive your badge email once your request is approved.
                </p>
              </CardContent>
            </Card>
          </div>
          
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
