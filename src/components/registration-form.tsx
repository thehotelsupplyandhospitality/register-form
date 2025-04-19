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
  designation: z.string().min(1, { message: 'Please enter your designation.' }),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // const onSubmit = async (data: FormData) => {
  //   setSubmitting(true);
  //   try {
  //     await axios.post('https://your-laravel-domain.com/api/expo-registration', data);
  //     setSuccess(true);
  //     reset();
  //   } catch (error) {
  //     console.error('Submission error:', error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
  
    try {
      const token = await window.grecaptcha.execute('6LczrR0rAAAAAOgAYqgFiME6l-Sl5bs1ErIKJQla', { action: 'submit' });
  
  
      await axios.post('https://www.jeddah-vision.com/expo-registration', {
        ...data,
        captchaToken: token,
      });
  
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('reCAPTCHA or form submit failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="w-full">
      {/* Full-width Banner */}
      <Image
        src="/banner.png"
        alt="Expo Banner"
        width={1193}
        height={296}
        className="w-full h-auto object-cover"
      />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-[5%] py-10">
        <div className="w-full max-w-7xl flex flex-col-reverse md:flex-row gap-10">
          {/* LEFT: Info Section */}
          <div className="flex-1 flex flex-col  space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 leading-snug mt-4"> 
              Empowering Hospitality Excellence Through Innovation
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Discover cutting-edge hotel supplies, smart guest solutions, and sustainable
              technologies reshaping the hospitality industry in Saudi Arabia and beyond. Meet the
              pioneers and explore the future at our exclusive expo in Jeddah.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-center justify-start">
              <Image src="/logo.png" alt="Sponsor 1" width={160} height={130} className="object-contain mx-auto" />
              <Image src="/logo.png" alt="Sponsor 2" width={160} height={130} className="object-contain mx-auto" />
              <Image src="/logo.png" alt="Sponsor 3" width={160} height={130} className="object-contain mx-auto" />
            </div>
            
          </div>

          {/* RIGHT: Form */}
          <div className="flex-1">
            <Card className="w-full shadow-xl border border-gray-200">
              <CardContent className="py-8">
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

                  {/* Radio Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 font-medium block mb-1 pb-2">
                      الحضور كـ / Attending as
                    </Label>

                    <RadioGroup
                      defaultValue="Visitor"
                      className="flex items-center gap-6"
                      {...register('attendanceType')}
                    >
                      {['Exhibitor', 'Visitor'].map((value) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={value}
                            id={`attend-${value}`}
                            className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                            {...register('attendanceType')}
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

                  {/* Submit Button */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
