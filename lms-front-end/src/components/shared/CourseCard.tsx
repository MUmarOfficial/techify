import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import type { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: Readonly<CourseCardProps>) {
  const instructor = typeof course.instructor === 'object' ? course.instructor : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Link
        to={`/courses/${course._id}`}
        className="group block"
      >
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden mb-5 bg-taupe/30">
          {course.thumbnail ? (
            <img
              src={`${course.thumbnail}?w=600&h=450&fit=crop`}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-taupe/50">
              <span className="font-heading text-3xl text-warm-grey/40">T</span>
            </div>
          )}
          {/* Price overlay */}
          <div className="absolute bottom-0 right-0 bg-charcoal text-white px-4 py-2">
            <span className="text-sm font-medium">${course.price?.toFixed(2)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <Badge variant="muted">{course.category}</Badge>

          <h3 className="font-heading text-xl md:text-2xl text-charcoal leading-tight group-hover:text-gold transition-colors duration-500">
            {course.title}
          </h3>

          <p className="text-sm text-warm-grey line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {instructor && (
            <p className="text-xs text-warm-grey/70 uppercase tracking-widest">
              by {instructor.name}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
