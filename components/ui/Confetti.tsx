import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  isActive: boolean;
}

export function Confetti({ isActive }: ConfettiProps) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [particleCount, setParticleCount] = useState(200);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isActive) {
      // بدء بعدد كبير من الجزيئات
      setParticleCount(200);
      // تقليل عدد الجزيئات تدريجياً
      const timer = setTimeout(() => {
        setParticleCount(0);
      }, 5000); // إيقاف بعد 5 ثواني
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <ReactConfetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      numberOfPieces={particleCount}
      recycle={false}
      colors={['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#4169E1']} // ألوان زاهية
      gravity={0.3} // جاذبية أقل لتأثير أطول
      tweenDuration={5000} // مدة الحركة
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
}
