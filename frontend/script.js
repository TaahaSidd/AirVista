document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    const bookingsList = document.getElementById('bookingsList');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            const response = await fetch('/AirVista/v1/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('Login successful!');
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login.');
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        try {
            const response = await fetch('/AirVista/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('Registration successful!');
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration.');
        }
    });

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const from = searchForm.querySelector('input[placeholder="From"]').value;
        const to = searchForm.querySelector('input[placeholder="To"]').value;
        const date = searchForm.querySelector('input[type="date"]').value;

        try {
            const response = await fetch(`/AirVista/Flight/search?from=${from}&to=${to}&date=${date}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const flights = await response.json();
                displayFlights(flights);
            } else {
                alert('No flights found.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while searching for flights.');
        }
    });

    function displayFlights(flights) {
        searchResults.innerHTML = '';
        flights.forEach(flight => {
            const flightElement = document.createElement('div');
            flightElement.innerHTML = `
                <h3>${flight.from} to ${flight.to}</h3>
                <p>Date: ${flight.date}</p>
                <button onclick="bookFlight(${flight.id})">Book Now</button>
            `;
            searchResults.appendChild(flightElement);
        });
    }

    window.bookFlight = async (flightId) => {
        try {
            const response = await fetch('/AirVista/Booking/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ flightId }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Booking initiated!');
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during booking.');
        }
    };

    // Fetch and display user bookings
    async function fetchBookings() {
        try {
            const response = await fetch('/AirVista/Booking/user/1', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const bookings = await response.json();
                displayBookings(bookings);
            } else {
                alert('Failed to fetch bookings.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching bookings.');
        }
    }

    function displayBookings(bookings) {
        bookingsList.innerHTML = '';
        bookings.forEach(booking => {
            const bookingElement = document.createElement('div');
            bookingElement.innerHTML = `
                <h3>Booking ID: ${booking.id}</h3>
                <p>Flight: ${booking.flightId}</p>
                <p>Status: ${booking.status}</p>
            `;
            bookingsList.appendChild(bookingElement);
        });
    }

    fetchBookings();
}); 