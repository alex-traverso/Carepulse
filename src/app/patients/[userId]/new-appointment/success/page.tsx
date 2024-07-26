import { getAppointment } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Doctors } from "../../../../../../constants/index";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/actions/patient.actions";

const SuccessPage = async ({
	params: { userId },
	searchParams,
}: SearchParamProps) => {
	const appointmentId = (searchParams?.appointmentId as string) || "";

	const appointment = await getAppointment(appointmentId);

	const user = await getUser(userId);

	Sentry.metrics.set("user_view_appointment-success", user.name);

	const doctor = Doctors.find(
		(doc) => doc.name === appointment.primaryPhysician
	);
	return (
		<div className="flex h-screen max-h-screen px-[5%]">
			<div className="success-img">
				<Link href="/">
					<Image
						alt="logo"
						src="/assets/icons/logo-full.svg"
						height={1000}
						width={1000}
						className="h-10 w-fit"
					/>
				</Link>
				<section className="flex flex-col items-center">
					<Image
						src="/assets/gifs/success.gif"
						alt="success"
						width={280}
						height={300}
					/>
					<h2 className="header mb-6 max-w-[600px] text-center">
						Your <span className="text-green-500">appointment request</span> has
						been successfully submitted!
					</h2>
					<p>We will be in touch shortly to confirm.</p>
				</section>

				<section className="request-details">
					<p>Requested appointment details:</p>
					<div className="flex items-center gap-3">
						<Image
							src={doctor?.image!}
							alt="Doctor"
							width={100}
							height={100}
							className="size-8"
						/>
						<p className="whitespace-nowrap">{doctor?.name}</p>
					</div>
					<div className="flex gap-2">
						<Image
							alt="calendar"
							src="/assets/icons/calendar.svg"
							height={24}
							width={24}
						/>
						<p>{formatDateTime(appointment.schedule).dateTime}</p>
					</div>
				</section>
				<Button variant="outline" className="shad-primary-btn" asChild>
					<Link href={`/patients/${userId}/new-appointment`}>
						New Appointment
					</Link>
				</Button>
				<p className="copyright">© 2024 CarePulse</p>
			</div>
		</div>
	);
};

export default SuccessPage;
