"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface PatientTypeCardProps {
  src: StaticImageData;
  alt: string;
  type: string;
  onClick: (e: React.MouseEvent) => void; // Adicione esta linha
}

export default function PatientTypeCard({
  src,
  alt,
  onClick,
}: PatientTypeCardProps) {
  return (
    <div
      onClick={onClick}
      className="patient-type-card h-60 p-6 border-orange-500 grid-span-1 object-cover"
    >
      <Image src={src} alt={alt} className="w-40 h-40 object-contain" />

      <p className="text-foreground font-cabinetGrotesk text-xl">{alt}</p>
    </div>
  );
}
