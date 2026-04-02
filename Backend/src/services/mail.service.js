import "dotenv/config"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  const { data, error } = await resend.emails.send({
    from:'InfraAI <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    console.log("Email error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data);
}