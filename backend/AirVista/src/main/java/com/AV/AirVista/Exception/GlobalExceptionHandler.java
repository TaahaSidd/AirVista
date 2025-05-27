package com.AV.AirVista.Exception;

import java.time.Instant;

import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handler for general authentication.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED; // 401
        String errorMessage = "Authentication failed";

        // For more specific messages if needed
        if (ex instanceof BadCredentialsException) {
            errorMessage = "Invalid email or password.";
        }

        ErrorResponse error = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                errorMessage,
                Instant.now().toEpochMilli());
        return new ResponseEntity<>(error, status);
    }

    // Handler for authorization failure.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN; // 403
        ErrorResponse error = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                "You do not have permission to access this resource.",
                Instant.now().toEpochMilli());
        return new ResponseEntity<>(error, status);
    }

    // Handler for any other unexpected exceptions
    @ExceptionHandler(Exception.class)
    @SuppressWarnings("CallToPrintStackTrace")
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR; // 500
        ErrorResponse error = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                "An unexpected error occurred: " + ex.getMessage(), // General error message
                Instant.now().toEpochMilli());

        ex.printStackTrace();
        return new ResponseEntity<>(error, status);
    }

    // Handler for ResourceNotFoundException (404 Not Found)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND; // 404
        ErrorResponse error = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(), // "Not Found"
                ex.getMessage(), // Use the specific message from the exception
                Instant.now().toEpochMilli());
        return new ResponseEntity<>(error, status);
    }
}
