from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch

app = Flask(__name__)

# Load model and tokenizer once during startup
MODEL_NAME = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"

# Try to use GPU if available
device = 0 if torch.cuda.is_available() else -1

print("Loading model, please wait...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto"   
)

chat_pipeline = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device=device,
    max_new_tokens=300,
    temperature=0.7,
    top_p=0.9
)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    message = data.get('message', '').strip()

    if not message:
        return jsonify({'response': "Please provide a valid message."})

    # Build law-focused prompt
    prompt = f"You are an AI legal assistant. Answer clearly and factually.\nUser: {message}\nAI:"

    result = chat_pipeline(prompt)[0]["generated_text"]

    # Extract only AI response part
    ai_reply = result.split("AI:")[-1].strip()

    return jsonify({'response': ai_reply})

if __name__ == '__main__':
    app.run(port=7000)
