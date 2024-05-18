"use client";

import Person from "@/components/WhyExercise/Person";
import Questions from "@/components/WhyExercise/Questions";
import Welcome from "@/components/WhyExercise/Welcome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./styles.scss";

export default function WhyExercise() {
  const [name, setName] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const router = useRouter();
  const handleExit = () => router.push("/");

  if (!name) return <Welcome setName={setName} setPhoto={setPhoto} photo={photo} handleExit={handleExit} />;

  return (
    <>
      <div className="wrapper">
        <div className="why-exercise">
          <Person name={name} photo={photo} />
          <Questions />
        </div>
      </div>
    </>
  );
}
