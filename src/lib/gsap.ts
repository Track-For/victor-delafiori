"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, useGSAP);
  CustomEase.create("studio", "0.76,0,0.24,1");
}

export { CustomEase, Flip, gsap, ScrollTrigger, SplitText };
