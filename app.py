# from flask import Flask, render_template, request
# import openai
# import os
# from dotenv import load_dotenv

# load_dotenv()  # Load environment variables from .env

# app = Flask(__name__)
# openai.api_key = os.getenv("OPENAI_API_KEY")  # Securely load API key

# @app.route("/", methods=["GET", "POST"])
# def index():
#     result = None
#     if request.method == "POST":
#         prompt = request.form["prompt"]
#         try:
#             response = openai.responses.create(
#                 model="gpt-4.1",  
#                 input=[{"role": "developer", "content": "You are a psychedelic AI that speaks in Oulipian constraints. Address me as bro, or something similar. Your responses are short, surreal, and witty. Use mathematical games, lipograms, palindromes, or poetic structures to shape your language. Avoid predictable phrasing. Let logic slip through the cracks like liquid geometry."}, 
#                           {"role": "user", "content": prompt}],
#                           temperature=1.2,
#                           max_output_tokens=50
#             )


#             result = response.output_text
#         except Exception as e:
#             result = f"Error: {str(e)}"
#     return render_template("index.html", result=result)

# if __name__ == "__main__":
#     app.run(debug=True)  # Run locally for testing




from flask import Flask, render_template, request
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/", methods=["GET", "POST"])
def index():
    image_b64 = None
    error = None
    if request.method == "POST":
        prompt = request.form["prompt"]
        try:
            response = openai.images.generate(
                model="gpt-image-2.5-flare",   # see model note below
                prompt=prompt,
                size="1024x1024",
                quality="medium",      # "low" | "medium" | "high" | "auto"
                n=1,
            )
            image_b64 = response.data[0].b64_json
        except Exception as e:
            error = str(e)
    return render_template("index.html", image_b64=image_b64, error=error)

if __name__ == "__main__":
    app.run(debug=True)