// NOTE: This file was automatically updated to use fetchSiteContent instead of importing siteContent directly.
// Please review and update the component to use the async fetchSiteContent function.
'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { fetchSiteContent } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Memoized animation configurations
const animations = {
  title: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  },
  button: {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.97 }
  }
};

// Optimized DetailItem component
const DetailItem = memo(({ label, value }) => (
  <p className="text-sm sm:text-base lg:text-lg">
    <strong className="text-gray-900 dark:text-white">{label}</strong>{' '}
    <span className="text-gray-700 dark:text-gray-300">{value}</span>
  </p>
));

DetailItem.displayName = 'DetailItem';

// Workshop Skeleton component
const WorkshopSkeleton = () => (
  <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
    <Skeleton className="w-full aspect-video" />
    <div className="p-6 sm:p-8 lg:p-10 space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </div>

      <div className="space-y-3 border-l-4 border-blue-500 pl-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ))}
      </div>

      <div className="text-center">
        <Skeleton className="h-12 w-40 mx-auto rounded-full" />
      </div>
    </div>
  </div>
);

const Workshop = () => {
  const router = useRouter();
  const [workshopData, setWorkshopData] = useState({
    title: "",
    shortDescription: "",
    details: [],
    bannerImage: "",
    isRegistrationOpen: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch workshop data
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await fetchSiteContent();
        if (content && content.workshop) {
          setWorkshopData(content.workshop);
        }
      } catch (error) {
        console.error('Error loading workshop data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Destructure workshop data
  const { title, shortDescription, details, bannerImage, isRegistrationOpen } = workshopData;

  // Memoize event handler to prevent unnecessary re-renders
  const handleRegistration = useCallback(() => {
    if (isRegistrationOpen) {
      router.push("/workshopregistration");
    } else {
      router.push("/registrationclosed");
    }
  }, [isRegistrationOpen, router]);

  return (
    <section
      id="workshop"
      className="container mx-auto mb-8 px-4 sm:px-6 lg:px-8 mt-8 flex flex-col items-center justify-center"
    >
      <motion.h1
        className="text-6xl sm:text-8xl lg:text-9xl font-extrabold text-gray-900 dark:text-white mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5 }}
        variants={animations.title}
      >
        Workshop
      </motion.h1>

      {isLoading ? (
        <WorkshopSkeleton />
      ) : (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
          <div className="relative w-full aspect-video">
            <Image
              src={bannerImage}
              alt="Workshop Banner"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              loading="eager"
              quality={85}
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                {shortDescription}
              </p>
              {!isRegistrationOpen && (
                <p className="text-red-600 font-bold text-sm md:text-md">Registration Closed</p>
              )}
            </div>

            <div className="space-y-3 border-l-4 border-blue-500 pl-4">
              {details && details.map((detail, index) => (
                <DetailItem
                  key={index}
                  label={detail.label}
                  value={detail.value}
                />
              ))}
            </div>

            <motion.div
              className="text-center"
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={animations.button}
            >
              <Button
                onClick={handleRegistration}
                className="px-6 py-3 sm:px-9 sm:py-6 text-sm sm:text-base rounded-full font-bold shadow-lg tracking-wide"
              >
                {isRegistrationOpen ? "Register Now" : "Registration Closed"}
              </Button>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(Workshop);