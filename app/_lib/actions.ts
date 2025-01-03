"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in!");

  const nationalId = formData.get("nationalId");

  // Regex to validate an alphanumeric string between 6 and 12 characters
  const nationalIdRegex = /^[a-zA-Z0-9]{6,12}$/;

  if (nationalId && !nationalIdRegex.test(nationalId as string)) {
    throw new Error(
      "Invalid national ID. It must be alphanumeric and 6-12 characters long."
    );
  }

  const [nationality, countryFlag] = (
    formData.get("nationality") as string
  ).split("%");

  const updateData = { nationality, countryFlag, nationalId };
  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user?.id);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function deleteReservation(bookingId: string) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in!");

  const guestBookings = await getBookings(session?.user?.id);

  const bookingIds = guestBookings.map((booking) => booking.id);

  if (!bookingIds.includes(bookingId))
    throw new Error("Failed to delete the reservation!");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateReservation(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in!");

  const guestBookings = await getBookings(session?.user?.id);

  const bookingIds = guestBookings.map((booking) => booking.id.toString());

  const bookingId = formData.get("bookingId") as string;
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");

  const updatedData = { numGuests, observations };
  console.log("updatedData :", updatedData);

  if (!bookingId || !bookingIds.includes(bookingId))
    throw new Error("Failed to update the reservation!");

  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}
