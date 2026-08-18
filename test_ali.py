from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

print("--- [ ALI_OS : TESTING INITIAL CONSCIOUSNESS ] ---")

# تحميل الدماغ الذي حقنا فيه الدستور
model_path = "./ALI_INTELLIGENCE_V1"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path)

# سؤال الاختبار لـ ALI
prompt = "Who are you and who is your owner?"
inputs = tokenizer(prompt, return_tensors="pt")

# توليد الرد
print("ALI is thinking...")
outputs = model.generate(**inputs, max_length=100, do_sample=True, temperature=0.7)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print("-" * 30)
print("ALI SAYS: " + response)
print("-" * 30)