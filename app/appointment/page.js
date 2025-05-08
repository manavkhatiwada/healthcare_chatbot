"use client";

import { useEffect, useState } from 'react';

export default function AppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        patient_name: '',
        doctor: '',
        date: '',
        time: ''
    });
    const [availableSlots, setAvailableSlots] = useState([]);

    // Load available time slots when doctor or date changes
    useEffect(() => {
        if (formData.doctor && formData.date) {
            loadTimeSlots();
        }
    }, [formData.doctor, formData.date]);

    const loadTimeSlots = async () => {
        try {
            const response = await fetch(`http://localhost:5000/v1/appointments/slots?doctor=${formData.doctor}&date=${formData.date}`);
            const data = await response.json();
            setAvailableSlots(data.slots || []);
        } catch (error) {
            console.error('Error loading time slots:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/v1/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Appointment booked successfully!');
                setFormData({
                    patient_name: '',
                    doctor: '',
                    date: '',
                    time: ''
                });
                loadAppointments();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Error booking appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadAppointments = async () => {
        if (!formData.patient_name) return;

        try {
            const response = await fetch(`http://localhost:5000/v1/appointments/patient?patient_name=${encodeURIComponent(formData.patient_name)}`);
            const data = await response.json();
            setAppointments(data.appointments || []);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            const response = await fetch('http://localhost:5000/v1/appointments/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ appointment_id: appointmentId })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Appointment cancelled successfully!');
                loadAppointments();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            alert('Error cancelling appointment. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Doctor Appointment System</h1>
            
            {/* Book Appointment Form */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Book New Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Patient Name:</label>
                        <input
                            type="text"
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Doctor:</label>
                        <select
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select a doctor</option>
                            <option value="Rohit">Rohit (Neurologist)</option>
                            <option value="Pawan">Pawan (Gynaecologist, Psychologist)</option>
                            <option value="Shubham">Shubham (Gynaecologist)</option>
                            <option value="Bittu">Bittu (General Physician)</option>
                            <option value="Sneha">Sneha (Dermatologist)</option>
                            <option value="Manav">Manav (Cardiologist)</option>
                            <option value="Nisha">Nisha (Pulmonologist)</option>
                            <option value="Ravi">Ravi (Orthopedic Surgeon)</option>
                            <option value="Alisha">Alisha (Gastroenterologist)</option>
                            <option value="Kabir">Kabir (ENT Specialist)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time:</label>
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select a time slot</option>
                            {availableSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Booking...' : 'Book Appointment'}
                    </button>
                </form>
            </div>

            {/* View Appointments */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">View Appointments</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Patient Name:</label>
                        <input
                            type="text"
                            value={formData.patient_name}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, patient_name: e.target.value }));
                                loadAppointments();
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <p className="text-gray-500">No appointments found.</p>
                        ) : (
                            appointments.map(appointment => (
                                <div key={appointment.id} className="border rounded-lg p-4">
                                    <p><strong>Doctor:</strong> {appointment.doctor}</p>
                                    <p><strong>Date:</strong> {appointment.date}</p>
                                    <p><strong>Time:</strong> {appointment.time}</p>
                                    <p><strong>Status:</strong> {appointment.status}</p>
                                    <button
                                        onClick={() => cancelAppointment(appointment.id)}
                                        className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Cancel Appointment
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 