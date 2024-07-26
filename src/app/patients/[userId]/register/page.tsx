import { RegisterForm } from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";

const Register = async ({ params }: SearchParamProps) => {
	const user = await getUser(params.userId);

	Sentry.metrics.set("user_view_register", user.name);

	return (
		<main className="flex h-screen max-h-screen">
			<section className="remove-scrollbar container">
				<div className="sub-container max-w-[860px] flex-1 flex-col py-10">
					<Image
						src="/assets/icons/logo-full.svg"
						height={100}
						width={100}
						alt="patient"
						className="mb-12 h-10 w-fit"
					/>

					<RegisterForm user={user} />

					<p className="copyright py-12">
						© {new Date().getFullYear()} Carepulse
					</p>
				</div>
			</section>

			<Image
				src="/assets/images/register-img.png"
				alt="patient"
				height={1000}
				width={1000}
				className="side-img max-w-[700px]"
			/>
		</main>
	);
};

export default Register;
