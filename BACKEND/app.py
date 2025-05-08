from flask import Flask, render_template, jsonify, request
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from vector_store import HealthVectorStore
from appointments import AppointmentManager

API_KEY = "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"
app = Flask(__name__)

# Initialize appointment manager
appointment_manager = AppointmentManager()

class StoryGenerator:
    def __init__(self):
        self.model = ChatGroq(
            api_key=API_KEY,
            model="llama-3.3-70b-versatile",
            temperature=0.7
        )
        self.vector_store = HealthVectorStore()
        self.prompt = PromptTemplate.from_template("""
You are a senior healthcare provider. Analyze the user's symptoms and determine the possible disease. Then, suggest the most suitable doctor based on the disease.

Here is some relevant information from our medical database:
{similar_cases}

Provide the name of the doctor in this format: [--Doctor Name--]. Only return the doctor's name, nothing else.

If the symptoms don't match any disease or healthcare condition, respond with: "I can't answer this. Please consult a healthcare professional."

Only text that explain symptoms, causes and possible disease no more text also if you don't have enought data than ask some followback questions for more accurate result.
                                                   
# Note ask followback questions if don't have enought data to predict

# User Input:  
Age: {age}  
Sex: {sex}  
Symptoms: {input}

# Available Doctors:  
Rohit (Neurologist)  
Pawan (Gynaecologist, Psychologist)  
Shubham (Gynaecologist)  
Bittu (General Physician)  
Sneha (Dermatologist)  
Manav (Cardiologist)  
Nisha (Pulmonologist)  
Ravi (Orthopedic Surgeon)  
Alisha (Gastroenterologist)  
Kabir (ENT Specialist)
""")
        self.chain = self.prompt | self.model

    def generate(self, prompt):
        # Search for similar cases in the vector store
        similar_cases = self.vector_store.search(prompt)
        similar_cases_text = "\n".join(similar_cases)
        
        return self.chain.invoke(input={
            "input": prompt,
            "age": 20,
            "sex": "male",
            "similar_cases": similar_cases_text
        }).content

model = StoryGenerator()

@app.route("/v1/lama/generate/story", methods=["POST"])
def generate():
    prompt = request.json.get("prompt")
    response = model.generate(prompt)

    return jsonify({
        "response": response,
        "prompt": prompt,
        "count": len(response)
    }), 200

@app.route("/v1/health/add_info", methods=["POST"])
def add_health_info():
    """Add new health information to the vector store"""
    data = request.json
    text = data.get("text")
    
    if not text:
        return jsonify({"error": "Text is required"}), 400
    
    model.vector_store.add_texts([text])
    return jsonify({"message": "Health information added successfully"}), 200

@app.route("/v1/appointments/slots", methods=["GET"])
def get_available_slots():
    """Get available time slots for a doctor on a specific date"""
    doctor = request.args.get("doctor")
    date = request.args.get("date")
    
    if not doctor or not date:
        return jsonify({"error": "Doctor and date are required"}), 400
    
    slots = appointment_manager.get_available_slots(doctor, date)
    return jsonify({"slots": slots}), 200

@app.route("/v1/appointments/book", methods=["POST"])
def book_appointment():
    """Book a new appointment"""
    data = request.json
    patient_name = data.get("patient_name")
    doctor = data.get("doctor")
    date = data.get("date")
    time = data.get("time")
    
    if not all([patient_name, doctor, date, time]):
        return jsonify({"error": "All fields are required"}), 400
    
    success, result = appointment_manager.book_appointment(patient_name, doctor, date, time)
    
    if success:
        return jsonify(result), 200
    else:
        return jsonify({"error": result}), 400

@app.route("/v1/appointments/patient", methods=["GET"])
def get_patient_appointments():
    """Get all appointments for a specific patient"""
    patient_name = request.args.get("patient_name")
    
    if not patient_name:
        return jsonify({"error": "Patient name is required"}), 400
    
    appointments = appointment_manager.get_patient_appointments(patient_name)
    return jsonify({"appointments": appointments}), 200

@app.route("/v1/appointments/cancel", methods=["POST"])
def cancel_appointment():
    """Cancel an existing appointment"""
    data = request.json
    appointment_id = data.get("appointment_id")
    
    if not appointment_id:
        return jsonify({"error": "Appointment ID is required"}), 400
    
    success, result = appointment_manager.cancel_appointment(appointment_id)
    
    if success:
        return jsonify({"message": result}), 200
    else:
        return jsonify({"error": result}), 400

@app.route("/appointment")
def appointment_page():
    """Serve the appointment booking page"""
    return render_template("appointments.html")

@app.after_request
def add_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Origin, Accept'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    return response

if __name__ == '__main__':
    app.run(debug=True)