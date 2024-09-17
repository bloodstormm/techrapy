"use client"

import Image, { StaticImageData } from "next/image";
import Link from "next/link";


interface PatientTypeCardProps {
  src: StaticImageData;
  alt: string;
  type: string;
}

export default function PatientTypeCard({ src, alt, type }: PatientTypeCardProps) {
  return (
    <Link href={`/add-user/${type}`} className="patient-type-card">
      <Image src={src} alt={alt} className="h-full p-6 border-stroke grid-span-1 object-cover" />
      <p className="text-foreground font-cabinetGrotesk text-xl">{alt}</p>
    </Link>
  );
}