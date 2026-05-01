import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, PlayCircle, ArrowRight } from 'lucide-react';
import { getMyCourses } from '../../services/enrollmentService';
import type { Enrollment, Course } from '../../types';
import Skeleton from '../../components/ui/Skeleton';
import { ROUTES } from '../../constants';

export default function PaymentSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!id) return;
      try {
        const enrollments = await getMyCourses();
        const found = enrollments.find((e) => e._id === id);

        if (found?.paymentStatus !== 'completed') {
          navigate(ROUTES.COURSES);
          return;
        }

        setEnrollment(found);
      } catch (err) {
        console.error('Failed to fetch enrollment details:', err);
        navigate(ROUTES.COURSES);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-alabaster min-h-screen flex items-center justify-center p-6">
        <Skeleton variant="rect" className="w-full max-w-md h-96" />
      </div>
    );
  }

  if (!enrollment) return null;

  const course = enrollment.course as Course;
  const courseId = typeof course === 'object' ? course._id : course;

  return (
    <div className="bg-alabaster min-h-screen flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg bg-white border border-charcoal/10 shadow-card p-10 md:p-14 text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={40} strokeWidth={1.5} />
        </motion.div>

        <h1 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">Payment Successful!</h1>
        <p className="text-warm-grey text-lg mb-8 leading-relaxed">
          You are now enrolled in <strong className="text-charcoal font-medium">{course.title}</strong>. Your transaction ID is <span className="font-mono text-sm">{enrollment.transactionId}</span>.
        </p>

        <div className="space-y-4">
          <Link
            to={ROUTES.DASHBOARD.STUDENT.WATCH(courseId)}
            className="w-full h-14 bg-charcoal text-white text-label flex items-center justify-center gap-2 hover:bg-gold hover:text-charcoal transition-colors duration-500"
          >
            <PlayCircle size={18} strokeWidth={1.5} />
            Start Learning Now
          </Link>

          <Link
            to={ROUTES.DASHBOARD.STUDENT.MY_COURSES}
            className="w-full h-14 bg-transparent border border-charcoal text-charcoal text-label flex items-center justify-center gap-2 hover:bg-charcoal hover:text-white transition-colors duration-500"
          >
            Go to My Dashboard
            <ArrowRight size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
