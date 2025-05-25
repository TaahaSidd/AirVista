package com.AV.AirVista.Service;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
        String subject = "Welcome to AirVista, " + userName + "!";
        String text = "Dear" + userName + ",\n\n"
                + "Welcome aboard AirVista! We're excited to have you as a part of our community. \n "
                + "Best Regards,\n"
                + "AirVista Team.";
        sendEmail(recipientEmail, subject, text);
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
