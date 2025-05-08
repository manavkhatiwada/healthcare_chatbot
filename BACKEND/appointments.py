from datetime import datetime, timedelta
import json
import os

class AppointmentManager:
    def __init__(self):
        self.appointments_file = "appointments.json"
        self.appointments = self._load_appointments()
        self.available_slots = self._generate_available_slots()
        
    def _load_appointments(self):
        """Load existing appointments from file"""
        if os.path.exists(self.appointments_file):
            with open(self.appointments_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_appointments(self):
        """Save appointments to file"""
        with open(self.appointments_file, 'w') as f:
            json.dump(self.appointments, f, indent=4)
    
    def _generate_available_slots(self):
        """Generate available time slots for the next 7 days"""
        slots = {}
        current_date = datetime.now()
        
        for i in range(7):
            date = current_date + timedelta(days=i)
            date_str = date.strftime("%Y-%m-%d")
            slots[date_str] = []
            
            # Generate slots from 9 AM to 5 PM with 30-minute intervals
            start_time = datetime.strptime("09:00", "%H:%M")
            end_time = datetime.strptime("17:00", "%H:%M")
            
            while start_time < end_time:
                slot = start_time.strftime("%H:%M")
                slots[date_str].append(slot)
                start_time += timedelta(minutes=30)
        
        return slots
    
    def get_available_slots(self, doctor_name, date):
        """Get available time slots for a specific doctor on a specific date"""
        if date not in self.available_slots:
            return []
        
        # Get all booked slots for the doctor on that date
        booked_slots = []
        for appointment in self.appointments.values():
            if (appointment['doctor'] == doctor_name and 
                appointment['date'] == date):
                booked_slots.append(appointment['time'])
        
        # Return available slots (all slots minus booked slots)
        return [slot for slot in self.available_slots[date] 
                if slot not in booked_slots]
    
    def book_appointment(self, patient_name, doctor_name, date, time):
        """Book a new appointment"""
        # Check if slot is available
        if time not in self.get_available_slots(doctor_name, date):
            return False, "Time slot not available"
        
        # Generate appointment ID
        appointment_id = f"apt_{len(self.appointments) + 1}"
        
        # Create appointment
        appointment = {
            "id": appointment_id,
            "patient_name": patient_name,
            "doctor": doctor_name,
            "date": date,
            "time": time,
            "status": "scheduled"
        }
        
        # Save appointment
        self.appointments[appointment_id] = appointment
        self._save_appointments()
        
        return True, appointment
    
    def cancel_appointment(self, appointment_id):
        """Cancel an existing appointment"""
        if appointment_id not in self.appointments:
            return False, "Appointment not found"
        
        self.appointments[appointment_id]["status"] = "cancelled"
        self._save_appointments()
        return True, "Appointment cancelled successfully"
    
    def get_patient_appointments(self, patient_name):
        """Get all appointments for a specific patient"""
        return [apt for apt in self.appointments.values() 
                if apt["patient_name"] == patient_name]
    
    def get_doctor_appointments(self, doctor_name):
        """Get all appointments for a specific doctor"""
        return [apt for apt in self.appointments.values() 
                if apt["doctor"] == doctor_name] 