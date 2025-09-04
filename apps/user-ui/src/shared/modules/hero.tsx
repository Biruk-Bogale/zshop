"use client";

import React from "react";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="bg-[#115061] h-[85vh] flex flex-col justify-center w-full">
      <div className="md:w-[80%] w-[90%] m-auto md:flex h-full items-center">
        <div className="md:w-1/2">
          <p className="font-Roboto font-normal text-white pb-2 text-xl">
            Starting fron 40$
          </p>

          <h1 className="text-white text-6xl font-extrabold font-Roboto">
            The best watch <br />
            Colloection 2025
          </h1>

          <p className="font-Oregano text-3xl pt-4 text-white">
            Execlusive offer <span className="text-yellow-400">10%</span> this
            week
          </p>

          <br />

          <button
            onClick={() => router.push("/products")}
            className="w-[140px] font-semibold h-[140px] "
          >
            <span className="flex gap-2 bg-white hover:bg-orange-500 hover:text-white rounded-md items-center justify-center py-2">
              Shop Now <MoveRight />
            </span>
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src="https://ik.imagekit.io/fz0xzwtey/products/slider-img-1.png"
            alt=""
            width={450}
            height={450}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
