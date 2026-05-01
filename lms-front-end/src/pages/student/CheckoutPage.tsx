/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { getMyCourses, processPayment } from '../../services/enrollmentService';
import { useToast } from '../../context/useToast';
import type { Enrollment, Course } from '../../types';
import Skeleton from '../../components/ui/Skeleton';

interface CheckoutFormInputs {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormInputs>({
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  });

  const cardName = useWatch({ control, name: 'cardName' });
  const cardNumber = useWatch({ control, name: 'cardNumber' });
  const expiry = useWatch({ control, name: 'expiry' });
  const cvv = useWatch({ control, name: 'cvv' });
  const [focus, setFocus] = useState<'name' | 'number' | 'expiry' | 'cvc' | ''>('');

  // Hotkey to inject mock data (Ctrl+Shift+H)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setValue('cardName', 'Test User', { shouldValidate: true });
        setValue('cardNumber', '4242424242424242', { shouldValidate: true });
        setValue('expiry', '12/28', { shouldValidate: true });
        setValue('cvv', '123', { shouldValidate: true });
        addToast('info', 'Developer tools: Mock payment data injected');
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [addToast, setValue]);

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const enrollments = await getMyCourses();
        const found = enrollments.find((e) => e._id === id);
        if (!found) {
          addToast('error', 'Enrollment not found');
          navigate('/courses');
          return;
        }
        if (found.paymentStatus === 'completed') {
          addToast('info', 'Payment already completed');
          navigate(`/dashboard/student/my-courses`);
          return;
        }
        setEnrollment(found);
      } catch (err) {
        console.error('Failed to fetch enrollment details:', err);
        addToast('error', 'Could not load checkout details');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id, navigate, addToast]);

  const onSubmit = async (data: CheckoutFormInputs) => {
    if (!id || !enrollment) return;

    setProcessing(true);
    try {
      const last4Digits = data.cardNumber.replaceAll(/\D/g, '').slice(-4) || '1234';
      await processPayment(id, { cardholderName: data.cardName, last4Digits });

      addToast('success', 'Payment successful! Welcome to the course.');

      navigate(`/checkout/${id}/success`);
    } catch (err) {
      console.error('Payment failed:', err);
      addToast('error', 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-alabaster min-h-screen py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton variant="rect" className="h-100" />
          <Skeleton variant="rect" className="h-100" />
        </div>
      </div>
    );
  }

  if (!enrollment) return null;

  const course = enrollment.course as Course;
  const coursePrice = course.price || 0;

  return (
    <div className="bg-alabaster min-h-screen pb-24 pt-12 md:pt-20 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <Link
          to={`/courses/${course._id}`}
          className="inline-flex items-center gap-2 text-label text-warm-grey hover:text-charcoal transition-colors duration-300 mb-10"
        >
          <ArrowLeft size={14} strokeWidth={1.5} /> Back to Course
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-3xl md:text-5xl text-charcoal mb-4">Secure Checkout</h1>
          <p className="text-warm-grey text-lg">Complete your enrollment by simulating a payment.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <h2 className="font-heading text-2xl text-charcoal mb-6 border-b border-charcoal/10 pb-4">Order Summary</h2>

            <div className="flex gap-4 mb-8">
              <div className="w-24 h-24 shrink-0 bg-taupe/30 overflow-hidden">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-warm-grey mb-1">{course.category}</p>
                <h3 className="text-base font-medium text-charcoal leading-tight mb-2">{course.title}</h3>
                <p className="text-sm text-warm-grey line-clamp-2">{course.description}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between text-charcoal">
                <span>Original Price</span>
                <span>${coursePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-warm-grey">
                <span>Discounts</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-charcoal font-heading text-2xl border-t border-charcoal/10 pt-6">
              <span>Total</span>
              <span>${coursePrice.toFixed(2)}</span>
            </div>

            <div className="mt-12 bg-white border border-charcoal/10 p-6 flex gap-4 text-sm text-warm-grey shadow-sm">
              <ShieldCheck size={24} strokeWidth={1.5} className="text-gold shrink-0" />
              <p>
                This is a secure 256-bit SSL encrypted payment. We do not store any of your credit card information. <span className="block mt-2 italic text-charcoal/70">(Mock environment: no real charges are made.)</span>
              </p>
            </div>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="bg-white border border-charcoal/15 p-8 shadow-card relative overflow-hidden">
              {/* Decorative gradient blob */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <CreditCard size={24} strokeWidth={1.5} className="text-gold" />
                <h2 className="font-heading text-2xl text-charcoal">Payment Details</h2>
              </div>

              {/* React Credit Cards 2 Visualization */}
              <motion.div
                className="mb-8 relative z-10 flex justify-center lg:justify-start"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
              >
                <div className="scale-90 sm:scale-100 origin-top-left lg:origin-top-left transition-transform duration-300">
                  <Cards
                    number={cardNumber || ''}
                    expiry={expiry || ''}
                    cvc={cvv || ''}
                    name={cardName || ''}
                    focused={focus}
                  />
                </div>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div>
                  <label htmlFor="cardName" className="block text-xs uppercase tracking-widest text-warm-grey mb-2">Name on Card</label>
                  <Controller
                    name="cardName"
                    control={control}
                    rules={{ required: 'Name is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="cardName"
                        onFocus={() => setFocus('name')}
                        className={`w-full h-12 bg-alabaster border px-4 text-sm text-charcoal focus:outline-none transition-colors ${errors.cardName ? 'border-red-500 focus:border-red-500' : 'border-charcoal/10 focus:border-gold'}`}
                        placeholder="Jane Doe"
                      />
                    )}
                  />
                  {errors.cardName && <span className="text-red-500 text-xs mt-1 block">{errors.cardName.message}</span>}
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-xs uppercase tracking-widest text-warm-grey mb-2">Card Number</label>
                  <div className="relative">
                    <Controller
                      name="cardNumber"
                      control={control}
                      rules={{
                        required: 'Card number is required',
                        validate: value => value.length >= 15 || 'Invalid card number'
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          id="cardNumber"
                          onChange={(e) => {
                            const val = e.target.value.replaceAll(/\D/g, '').slice(0, 16);
                            field.onChange(val);
                          }}
                          onFocus={() => setFocus('number')}
                          className={`w-full h-12 bg-alabaster border pl-12 pr-4 text-sm text-charcoal tracking-widest focus:outline-none transition-colors ${errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'border-charcoal/10 focus:border-gold'}`}
                          placeholder="0000 0000 0000 0000"
                        />
                      )}
                    />
                    <CreditCard size={18} strokeWidth={1.5} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.cardNumber ? 'text-red-500' : 'text-warm-grey'}`} />
                  </div>
                  {errors.cardNumber && <span className="text-red-500 text-xs mt-1 block">{errors.cardNumber.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="expiry" className="block text-xs uppercase tracking-widest text-warm-grey mb-2">Expiry Date</label>
                    <Controller
                      name="expiry"
                      control={control}
                      rules={{
                        required: 'Expiry date is required',
                        validate: value => value.length === 5 || 'Format MM/YY'
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          id="expiry"
                          onChange={(e) => {
                            let val = e.target.value.replaceAll(/\D/g, '');
                            if (val.length >= 2) {
                              val = val.substring(0, 2) + '/' + val.substring(2, 4);
                            }
                            field.onChange(val.slice(0, 5));
                          }}
                          onFocus={() => setFocus('expiry')}
                          className={`w-full h-12 bg-alabaster border px-4 text-sm text-charcoal tracking-widest focus:outline-none transition-colors ${errors.expiry ? 'border-red-500 focus:border-red-500' : 'border-charcoal/10 focus:border-gold'}`}
                          placeholder="MM/YY"
                        />
                      )}
                    />
                    {errors.expiry && <span className="text-red-500 text-xs mt-1 block">{errors.expiry.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-xs uppercase tracking-widest text-warm-grey mb-2">CVV</label>
                    <div className="relative">
                      <Controller
                        name="cvv"
                        control={control}
                        rules={{
                          required: 'CVV is required',
                          minLength: { value: 3, message: 'Minimum 3 digits' }
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            id="cvv"
                            onChange={(e) => {
                              const val = e.target.value.replaceAll(/\D/g, '').slice(0, 4);
                              field.onChange(val);
                            }}
                            onFocus={() => setFocus('cvc')}
                            className={`w-full h-12 bg-alabaster border px-4 text-sm text-charcoal tracking-widest focus:outline-none transition-colors ${errors.cvv ? 'border-red-500 focus:border-red-500' : 'border-charcoal/10 focus:border-gold'}`}
                            placeholder="123"
                          />
                        )}
                      />
                      <Lock size={14} strokeWidth={1.5} className={`absolute right-4 top-1/2 -translate-y-1/2 ${errors.cvv ? 'text-red-500' : 'text-warm-grey'}`} />
                    </div>
                    {errors.cvv && <span className="text-red-500 text-xs mt-1 block">{errors.cvv.message}</span>}
                  </div>
                </div>

                <AnimatePresence>
                  <motion.button
                    type="submit"
                    disabled={processing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-14 mt-4 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Lock size={16} strokeWidth={1.5} />
                        Pay ${coursePrice.toFixed(2)}
                      </motion.div>
                    )}
                  </motion.button>
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
