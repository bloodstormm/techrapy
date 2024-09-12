"use client"

import Image, { StaticImageData } from "next/image";


interface PatientTypeCardProps {
  src: StaticImageData;
  alt: string;
}

export function PatientTypeCard({ src, alt }: PatientTypeCardProps) {
  return (
    <div className="patient-type-card">
      <Image src={src} alt={alt} className="h-full p-6 border-stroke grid-span-1 object-cover" />
      <p className="text-foreground font-cabinetGrotesk text-xl">{alt}</p>
    </div>
  );
}