// Import the nodemailer module to send emails
const nodemailer = require('nodemailer');

// Load environment variables from a .env file (e.g., MAILTRAP credentials)
require("dotenv").config();

// Define a list of allowed department values
const validDepartments = ["Engineering", "HR", "Sales", "Finance"];

/**
 * Helper function to extract a claim value by its URI.
 * Returns null if the claim is not found.
 */
const getClaimValue = (claims, uri) => {
    const claim = claims.find(c => c.uri === uri);
    return claim ? claim.value : null;
};

// Main handler function for the AWS Lambda
exports.handler = async (event) => {
    // Parse the incoming event body to JSON
    const payload = JSON.parse(event.body || '{}');

    // Extract user claims and user ID from the payload
    const claims = payload?.event?.request?.claims || [];
    const userId = payload?.event?.user?.id || "Unknown User";

    // Extract specific user attribute values
    const department = getClaimValue(claims, "http://wso2.org/claims/department");
    const email = getClaimValue(claims, "http://wso2.org/claims/emailaddress");
    const phone = getClaimValue(claims, "http://wso2.org/claims/mobile");

    // Validate department against the list of allowed departments
    if (department && !validDepartments.includes(department)) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                actionStatus: "FAILED",
                failureReason: "invalid_department_input",
                failureDescription: "Provided user department value is invalid."
            })
        };
    }

    // Collect all changes into an array for logging or notification
    const changes = [];
    if (department) changes.push(`Department: ${department}`);
    if (email) changes.push(`Email: ${email}`);
    if (phone) changes.push(`Phone: ${phone}`);

    const fromEmailAddress = process.env.FROM_EMAIL;
    const toEmailAddress = process.env.TO_EMAIL;

    // If there are changes, notify the security team via email
    if (changes.length > 0) {
        // Create a transporter for sending email via SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        try {
            // Send the notification email
            await transporter.sendMail({
                from: `"Security Alert" <${fromEmailAddress}>`,
                to: toEmailAddress,
                subject: "Sensitive Attribute Update Request",
                text: `User ${userId} is attempting to update:\n\n${changes.join("\n")}`
            });
        } catch (error) {
            // Log and return a failure response if email fails to send
            console.error("Failed to send security email:", error);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    actionStatus: "FAILED",
                    failureReason: "email_error",
                    failureDescription: "Failed to notify security team about sensitive data update."
                })
            };
        }
    }

    // If all checks pass and notifications (if any) are successful, return success
    return {
        statusCode: 200,
        body: JSON.stringify({ actionStatus: "SUCCESS" })
    };
};
