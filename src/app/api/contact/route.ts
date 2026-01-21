import { NextRequest, NextResponse } from "next/server";

/**
 * Contact Form API Route
 * 
 * To enable email sending, choose one of the following options:
 * 
 * OPTION 1: Using Resend (Recommended - Free tier available)
 * 1. Install: npm install resend
 * 2. Get API key from https://resend.com
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxxx
 * 4. Uncomment the Resend code below
 * 
 * OPTION 2: Using SendGrid
 * 1. Install: npm install @sendgrid/mail
 * 2. Get API key from https://sendgrid.com
 * 3. Add to .env.local: SENDGRID_API_KEY=SG.xxxxx
 * 4. Replace the Resend code with SendGrid implementation
 * 
 * OPTION 3: Using Nodemailer with SMTP
 * 1. Install: npm install nodemailer
 * 2. Configure SMTP settings in .env.local
 * 3. Replace with Nodemailer implementation
 * 
 * OPTION 4: Using EmailJS (Client-side, no backend needed)
 * - Configure in the contact-form.tsx component instead
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // ============================================
    // RESEND IMPLEMENTATION (Uncomment to use)
    // ============================================
    /*
    import { Resend } from "resend";
    
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Update with your verified domain
      to: ["f2002.a.z@gmail.com"], // Your email
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #CB4B16; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
    */

    // ============================================
    // TEMPORARY: Log to console (Remove in production)
    // ============================================
    console.log("Contact form submission:", { name, email, message });
    console.log("\n📧 To enable email sending:");
    console.log("1. Choose an email service (Resend, SendGrid, etc.)");
    console.log("2. Install the package and add API key to .env.local");
    console.log("3. Uncomment the email code in src/app/api/contact/route.ts");

    // For now, return success (you'll receive emails once configured)
    return NextResponse.json(
      { message: "Message sent successfully! I'll get back to you soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
