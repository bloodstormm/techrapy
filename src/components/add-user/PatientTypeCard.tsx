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
  type,
  onClick,
}: PatientTypeCardProps) {
  return (
    <div
      onClick={onClick}
      className="patient-type-card h-full p-6 border-orange-500 grid-span-1 object-cover"
    >
      <Image src={src} alt={alt} />

      <p className="text-foreground font-cabinetGrotesk text-xl">{alt}</p>
    </div>
  );
}
