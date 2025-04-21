from flask import Flask, render_template, jsonify, request
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate

API_KEY = "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"
app = Flask(__name__)

class StoryGenerator:
    def __init__(self):
        self.model = ChatGroq(
            api_key=API_KEY,
            model="llama-3.3-70b-versatile",
            temperature=0.7
        )
        self.prompt = PromptTemplate.from_template("""
You are a senior healthcare provider. Analyze the user's symptoms and determine the possible disease. Then, suggest the most suitable doctor based on the disease.

Provide the name of the doctor in this format: [--Doctor Name--]. Only return the doctor's name, nothing else.

If the symptoms don’t match any disease or healthcare condition, respond with: "I can't answer this. Please consult a healthcare professional."

Only text that explain symptoms, causes and possible disease no more text also if you don't have enought data than ask some followback questions for more accurate result.
                                                   
# Note ask followback questions if don't have enought data to predict.

# User Input:  
Age: {age}  
Sex: {sex}  
Symptoms: {input}

# Available Doctors:  
Rohan (Neurologist)  
Pawan (Gynaecologist, Psychologist)  
Manav (Gynaecologist)  
Bittu (General Physician)  
Sneha (Dermatologist)  
Anish (Cardiologist)  
Nisha (Pulmonologist)  
Ravi (Orthopedic Surgeon)  
Alisha (Gastroenterologist)  
Kabir (ENT Specialist)
""")
        self.chain = self.prompt | self.model

    def generate(self, prompt):
        return self.chain.invoke(input={
            "input": prompt,
            "age": 20,
            "sex": "male"
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


@app.after_request
def add_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Origin, Accept'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    return response


if __name__ == '__main__':
    app.run(debug=True)