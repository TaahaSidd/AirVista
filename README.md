# AirVista: Your Seamless Flight Booking Experience

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React Native](https://img.shields.io/badge/Frontend-React%20Native%20%7C%20Expo-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Backend: Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## Live Demo
Check out the live website here:[(AirVista)](https://airvista-lt.netlify.app)

---

## Project Overview

Welcome to **AirVista**! This project is a modern, full-stack flight booking application designed to provide users with a seamless experience for finding and booking flights. With a robust Spring Boot backend handling flight data and user management, and a dynamic React Native frontend for an intuitive user interface, AirVista aims to simplify travel planning.

The application allows users to search for flights based on origin, destination, and date, view detailed flight information, and provides a foundation for future features like user authentication and booking management.

---

## Features

* **Intuitive Flight Search:** Easily find flights by specifying origin (e.g., DEL), destination (e.g., BOM), and departure date.

* **Detailed Flight Listings:** View comprehensive information for each flight, including airline, flight number, price, timings, stops, and available seats.

* **Responsive UI:** A mobile-first design ensures a great experience across various devices.

* **Robust Backend:** Powered by Spring Boot for secure and efficient data handling.

* **Database Integration:** Utilizes PostgreSQL for reliable data storage of flights and airport information.

* **CORS Configuration:** Seamless communication between frontend and backend.

---

## Tech Stack

### Frontend

* **React Native:** A framework for building native mobile apps using React.

* **Expo:** A set of tools and services built around React Native to help you build, deploy, and quickly iterate on iOS, Android, and web apps from the same JavaScript codebase.

* **React Navigation:** For managing navigation and routing between different screens in the application.

### Backend

* **Spring Boot:** A powerful framework for building robust, stand-alone, production-grade Spring applications.

* **Spring Data JPA:** For easy interaction with the database using Java Persistence API.

* **PostgreSQL:** A powerful, open-source relational database system.

* **JavaMailSender:** For sending transactional emails (e.g., welcome emails with inline images).

* **Lombok:** (Optional, but commonly used) To reduce boilerplate code for getters/setters/constructors.

## Getting Started

Follow these steps to get your AirVista project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js & npm:** [Download Node.js](https://nodejs.org/) (npm is included).

* **Java Development Kit (JDK) 17 or higher:** [Download JDK](https://www.oracle.com/java/technologies/downloads/)

* **Maven or Gradle:** (Maven is assumed for backend instructions) [Download Maven](https://maven.apache.org/download.cgi)

* **PostgreSQL:** [Download PostgreSQL](https://www.postgresql.org/download/)

* **VS Code (Recommended IDE):** [Download VS Code](https://code.visualstudio.com/)

* **Expo Go App:** On your mobile device (iOS App Store or Android Play Store) for testing the React Native app on a physical device.

### Backend Setup (Spring Boot)

1.  **Clone the repository:**

    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd [your-project-folder]/backend # Navigate to your backend directory
    ```

2.  **Database Configuration:**

    * Create a PostgreSQL database (e.g., `airvista_db`).

    * Update `src/main/resources/application.properties` (or `application.yml`) with your database credentials:

        ```properties
        spring.datasource.url=jdbc:postgresql://localhost:5432/airvista_db
        spring.datasource.username=[YOUR_DB_USERNAME]
        spring.datasource.password=[YOUR_DB_PASSWORD]
        spring.jpa.hibernate.ddl-auto=update # Or create-drop for fresh start (development only)
        spring.jpa.show-sql=true
        ```

    * **CORS Configuration:** Ensure your `CorsConfig.java` allows requests from your frontend's development server (e.g., `http://localhost:3031`).

        ```java
        // In com.airvista.config.CorsConfig.java
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3031") // Adjust if your frontend port changes
                // ... other CORS settings
        ```

    * **Email Configuration (Optional, for welcome emails):**

        ```properties
        spring.mail.host=smtp.gmail.com
        spring.mail.port=587
        spring.mail.username=[YOUR_EMAIL]
        spring.mail.password=[YOUR_EMAIL_APP_PASSWORD] # Use app password for Gmail
        spring.mail.properties.mail.smtp.auth=true
        spring.mail.properties.mail.smtp.starttls.enable=true
        ```

3.  **Build and Run the Backend:**

    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

    The backend will typically run on `http://localhost:8080`.

### Frontend Setup (React Native / Expo)

1.  **Navigate to the frontend directory:**

    ```bash
    cd [your-project-folder]/frontend # Navigate to your frontend directory
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the Expo development server:**

    ```bash
    npx expo start
    ```

    This will open a new tab in your browser with the Expo Developer Tools and display a QR code in your terminal.

4.  **Run the app:**

    * **On your phone:** Scan the QR code using the Expo Go app.

    * **In** web **browser:** Press `w` in your terminal or click "Run in web browser" on the Expo Dev Tools page.

    * **On emulator/simulator:** Press `a` for Android or `i` for iOS (requires Android Studio/Xcode setup).
        The frontend will typically run on `http://localhost:3031` (or another available port).

## Usage

Once both the backend and frontend servers are running:

1.  **Access the App:** Open the React Native app via Expo Go on your phone or in your web browser.

2.  **Navigate to Search:** The app should land on the main page. Navigate to the flight search section (e.g., by clicking a "Search Flights" button or if it's the initial screen).

3.  **Perform a Search:**

    * Enter **Origin Airport Code** (e.g., `DEL`)

    * Enter **Destination Airport Code** (e.g., `BOM`)

    * Enter **Departure Date** (e.g., `2025-07-01`)

    * Click "Search Flights".

4.  **View Results:** Matching flights from your database will be displayed.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please feel free to:

1.  Fork the repository.

2.  Create a new branch (`git checkout -b feature/your-feature-name`).

3.  Make your changes.

4.  Commit your changes (`git commit -m 'feat: Add new feature'`).

5.  Push to the branch (`git push origin feature/your-feature-name`).

6.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

## Contact

For any questions or inquiries, please reach out:

* **Your Name:** Sidd

* **Email:** tahasidd33@gmail.com
