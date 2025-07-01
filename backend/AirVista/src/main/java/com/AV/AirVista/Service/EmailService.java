package com.AV.AirVista.Service;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            javaMailSender.send(message);
            System.out.println("Email sent successfully to: " + to + "with subject: " + subject);
        } catch (MailException e) {
            System.err.println("Failed to send send email to: " + to + "with subject: " + subject);
        }
    }

    public void sendWelcomeEmail(String recipientEmail, String userName) {
        try {
            jakarta.mail.internet.MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(recipientEmail);
            helper.setSubject("Welcome to AirVista, " + userName + "!");
            String htmlContent = "<html><body>"
                    + "<p>Dear " + userName + ",</p>"
                    + "<p>Welcome aboard AirVista! We're excited to have you as a part of our community.</p>"
                    + "<img src='cid:welcomeImage' style='width:300px;'/>"
                    + "<p>Best Regards,<br/>AirVista Team.</p>"
                    + "</body></html>";
            helper.setText(htmlContent, true); // true = isHtml

            // Add the image as an inline resource
            org.springframework.core.io.ClassPathResource image = new org.springframework.core.io.ClassPathResource(
                    "static/welcome-image.jpg");
            helper.addInline("welcomeImage", image);

            javaMailSender.send(message);
            System.out.println("HTML Welcome email with inline image sent successfully to: " + recipientEmail);
        } catch (MessagingException | MailException e) {
            System.err.println("Failed to send HTML welcome email to: " + recipientEmail);
            e.printStackTrace();
        }
    }

    public void bookingConfirmationEmail(String recipientEmail, Long bookingId, String flightDetails) {
        String subject = "Your AirVista Booking #" + bookingId + "is Confirmed!";
        String text = """
                Dear AirVista Customer,

                Your booking #""" + bookingId + " has been successfully confirmed.\n"
                + "Flight Details: " + flightDetails + "\n\n"
                + "Thank you for choosing AirVista!\n\n"
                + "Best regards,\n"
                + "The AirVista Team";
        sendEmail(recipientEmail, subject, text);
    }
}
