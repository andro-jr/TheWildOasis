"use client";

import React, { ReactNode } from "react";
import { Guest } from "../_types";
import { updateProfile } from "../_lib/actions";
import Image from "next/image";
import { useFormStatus } from "react-dom";

interface UpdateProfileFormProps {
  children: ReactNode;
  guest: Guest;
}

function UpdateProfileForm({ children, guest }: UpdateProfileFormProps) {
  const { fullName, email, nationalId, countryFlag } = guest;
  return (
    <form
      action={updateProfile}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          name="fullName"
          disabled
          defaultValue={fullName}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          name="email"
          defaultValue={email}
          disabled
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          {countryFlag && (
            <Image
              src={countryFlag}
              alt="Country flag"
              width={40}
              height={20}
              className="rounded-sm h-5 w-auto"
            />
          )}
        </div>

        {/* Country select tag */}
        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalId">National ID number</label>
        <input
          defaultValue={nationalId}
          name="nationalId"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? "Updating..." : "Update profile"}
    </button>
  );
}

export default UpdateProfileForm;
