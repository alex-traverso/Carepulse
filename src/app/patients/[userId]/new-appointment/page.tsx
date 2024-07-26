import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";

import * as Sentry from "@sentry/nextjs";

export default async function NewAppointment({
	params: { userId },
}: SearchParamProps) {
	const patient = await getPatient(userId);

	Sentry.metrics.set("user_view_new-appointment", patient.name);
	return (
		<main className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container my-auto">
				<div className="sub-container max-w-[860px] flex-1 justify-between">
					<Image
						src="/assets/icons/logo-full.svg"
						height={100}
						width={100}
						alt="patient"
						className="mb-12 h-10 w-fit"
					/>
					<AppointmentForm
						type="create"
						userId={userId}
						patientId={patient.$id}
					/>

					<p className="copyright mt-10 py-12">
						© {new Date().getFullYear()} Carepulse
					</p>
				</div>
			</section>

			<Image
				src="/assets/images/appointment-img.png"
				alt="appointment"
				height={1000}
				width={1000}
				className="side-img max-w-[390px] bg-bottom"
			/>
		</main>
	);
}
