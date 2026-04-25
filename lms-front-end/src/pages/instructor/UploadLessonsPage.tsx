import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, FileVideo, Trash2, Plus, ArrowLeft, Video } from 'lucide-react';

import { getCourseById } from '../../services/courseService';
import {
  getLessonsByCourse,
  createLesson,
  deleteLesson,
} from '../../services/lessonService';
import { useToast } from '../../context/useToast';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import { getMediaUrl } from '../../utils/url';
import ImageCropper from '../../components/ui/ImageCropper';
import { MEDIA_LIMITS, ROUTES } from '../../constants';

import type { Course, Lesson } from '../../types';
import { getSkeletonArray } from '@/utils/array';

interface LessonForm {
  title: string;
  content: string;
  videoUrl: string;
}

const { THUMBNAIL_MAX_SIZE: MAX_THUMB_SIZE, VIDEO_MAX_SIZE: MAX_VIDEO_SIZE } = MEDIA_LIMITS;


export default function UploadLessonsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form Management
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: adding, isValid },
  } = useForm<LessonForm>({
    mode: 'onChange',
  });
  
  // Media State
  const [newThumbnail, setNewThumbnail] = useState<string | null>(null);
  const [rawThumb, setRawThumb] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);




  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      // Only set loading to true if it's not already true (e.g. on courseId change)
      setLoading(true);

      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(courseId),
          getLessonsByCourse(courseId),
        ]);
        setCourse(courseData);
        setLessons(lessonsData);
      } catch {
        // Silent error for course data, could add toast if needed
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_THUMB_SIZE) {
      addToast('error', 'Thumbnail must be less than 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawThumb(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For base64 upload, we should limit size. 5MB is a safe-ish limit for MongoDB base64.
    if (file.size > MAX_VIDEO_SIZE) {
      addToast('error', `Video upload limited to ${MAX_VIDEO_SIZE / (1024 * 1024)}MB (use URL for larger videos)`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setVideoPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onAdd = async (data: LessonForm) => {
    if (!courseId) return;
    try {
      const created = await createLesson({
        ...data,
        videoUrl: videoPreview || data.videoUrl || undefined,
        thumbnail: newThumbnail || undefined,
        courseId: courseId,
        order: lessons.length + 1,
      });
      setLessons((prev) => [...prev, created]);
      reset();
      setNewThumbnail(null);
      setVideoPreview(null);
      setShowAdd(false);
      addToast('success', 'Lesson added');
    } catch {
      addToast('error', 'Failed to add lesson');
    }
  };



  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteLesson(deleteId);
      setLessons((prev) => prev.filter((l) => l._id !== deleteId));
      setDeleteId(null);
      addToast('success', 'Lesson deleted');
    } catch {
      addToast('error', 'Failed to delete lesson');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate(ROUTES.DASHBOARD.INSTRUCTOR.COURSES)}
        className="flex items-center gap-2 text-label text-warm-grey hover:text-charcoal transition-colors duration-300 mb-8 cursor-pointer"
      >

        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to Courses
      </button>

      <div className="mb-10 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Curriculum</p>
        <h1 className="font-heading text-3xl md:text-4xl text-charcoal">
          {loading ? 'Loading...' : course?.title ?? 'Lessons'}
        </h1>
      </div>

      {/* Lessons List */}
      {loading ? (
        <div className="space-y-4">
          {getSkeletonArray(5).map((id) => (
            <Skeleton key={id} variant="rect" className="h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex items-center gap-4 p-5 border border-charcoal/10 hover:border-charcoal/20 transition-colors duration-300"
            >
              <span className="font-heading text-2xl text-charcoal/20 w-8 shrink-0">
                {String(lesson.order).padStart(2, '0')}
              </span>
              <div className="w-16 h-10 bg-charcoal/5 flex items-center justify-center overflow-hidden border border-charcoal/10 shrink-0">
                {lesson.thumbnail ? (
                  <img
                    src={getMediaUrl(lesson.thumbnail)}
                    alt={lesson.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <Video size={14} className="text-warm-grey/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal">{lesson.title}</p>
                <p className="text-xs text-warm-grey line-clamp-1 mt-0.5">{lesson.content}</p>
              </div>

              <button
                onClick={() => setDeleteId(lesson._id)}
                className="w-8 h-8 flex items-center justify-center border border-charcoal/15 text-warm-grey hover:border-error hover:text-error transition-colors duration-300 cursor-pointer shrink-0"
              >
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
            </motion.div>
          ))}

          {lessons.length === 0 && (
            <p className="py-8 text-center font-heading text-xl text-warm-grey italic">No lessons yet</p>
          )}
        </div>
      )}

      {/* Add Lesson */}
      {showAdd ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-charcoal/15 p-8 space-y-6"
        >
          <h3 className="font-heading text-xl text-charcoal">New Lesson</h3>
          
          <form onSubmit={handleSubmit(onAdd)} className="space-y-6">
            {/* Thumbnail & Video Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail */}
              <div className="space-y-2">
                <span className="text-label text-warm-grey">Lesson Thumbnail</span>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video w-full bg-charcoal/5 border border-dashed border-charcoal/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors relative overflow-hidden group p-0 appearance-none"
                  aria-label="Upload lesson thumbnail"
                >
                  {newThumbnail ? (
                    <img src={newThumbnail} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="text-warm-grey mb-2" size={20} />
                      <span className="text-[10px] uppercase tracking-widest text-warm-grey">Upload Image</span>
                    </>
                  )}
                  <span className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" size={20} />
                  </span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbChange} />
              </div>

              {/* Video */}
              <div className="space-y-2">
                <span className="text-label text-warm-grey">Lesson Video</span>
                <button 
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="aspect-video w-full bg-charcoal/5 border border-dashed border-charcoal/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors relative overflow-hidden group p-0 appearance-none"
                  aria-label="Upload lesson video"
                >
                  {videoPreview ? (
                    <video src={videoPreview} className="w-full h-full object-cover">
                      <track kind="captions" />
                    </video>
                  ) : (
                    <>
                      <FileVideo className="text-warm-grey mb-2" size={20} />
                      <span className="text-[10px] uppercase tracking-widest text-warm-grey">Upload Video</span>
                    </>
                  )}
                  <span className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <FileVideo className="text-white" size={20} />
                  </span>
                </button>
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
              </div>
            </div>

            <Input
              label="Lesson Title"
              placeholder="e.g. Introduction to React Hooks"
              id="new-title"
              {...register('title', { required: true })}
            />
            <Input
              label="Or use Video URL (YouTube/Vimeo)"
              placeholder="https://..."
              id="new-video"
              {...register('videoUrl')}
            />
            <Textarea
              label="Lesson Content"
              placeholder="Describe what students will learn in this lesson..."
              id="new-content"
              {...register('content', { required: true })}
            />
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={adding || !isValid}
                className="h-10 px-6 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-60 cursor-pointer"
              >
                {adding ? 'Saving...' : 'Save Lesson'}
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>

      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add Lesson
        </button>
      )}

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lesson">
        <p className="text-sm text-warm-grey mb-6">Are you sure you want to delete this lesson?</p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="h-10 px-6 bg-error text-white text-label cursor-pointer disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={() => setDeleteId(null)}
            className="h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal transition-colors duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Cropper Modal */}
      {rawThumb && (
        <ImageCropper
          isOpen={isCropperOpen}
          image={rawThumb}
          aspectRatio={16 / 9}
          shape="rect"
          onClose={() => {
            setIsCropperOpen(false);
            setRawThumb(null);
          }}
          onCrop={(cropped) => {
            setNewThumbnail(cropped);
            setIsCropperOpen(false);
            setRawThumb(null);
          }}
        />
      )}


    </div>
  );
}
