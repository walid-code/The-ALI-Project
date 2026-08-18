import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# 1. إعداد الاتصال بنواة ALI_OS
print("--- [ ALI_OS : CONNECTING TO CORE ] ---")
model_path = "./ALI_INTELLIGENCE_V1"

try:
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path)
    model.eval() # وضعية القراءة فقط لتحسين الأداء
except Exception as e:
    print(f"ERROR: Could not load ALI_BRAIN. Details: {e}")
    exit()

print("--- [ ALI_OS : ONLINE 🟢 ] ---")
print("Logic: $RED | Author: Walid Fodha")
print("Settings: Clean_Response_Enabled | Short_Talk: True")
print("(Type 'exit' to close the session)")
print("-" * 50)

def clean_output(text, user_input):
    """وظيفة لتنقية رد ALI من الأكواد والرموز المزعجة"""
    # إزالة نص السؤال الأصلي إذا ظهر في الرد
    if user_input.lower() in text.lower():
        text = text.split("ALI:")[-1] if "ALI:" in text else text.replace(user_input, "")
    
    # قائمة الرموز التي نريد مسحها ليكون الرد بشرياً
    junk_symbols = ["#", ":", "[", "]", "{", "}", "_", "=", "CORE", "PROT"]
    for symbol in junk_symbols:
        text = text.replace(symbol, "")
    
    # أخذ أول سطر فقط لمنع الهذيان
    text = text.split('\n')[0].strip()
    return text

# 2. حلقة المحادثة المطورة
while True:
    user_msg = input("YOU: ")
    
    if user_msg.lower() == 'exit':
        print("System ALI_OS is going to sleep. Goodbye Walid.")
        break

    # هندسة الأمر (Prompt Engineering) لجعل النموذج يفهم أنه في حوار
    structured_prompt = f"User: {user_msg}\nALI:"
    
    inputs = tokenizer(structured_prompt, return_tensors="pt")

    with torch.no_grad():
        outputs = model.generate(
            **inputs, 
            max_new_tokens=20,      # ردود قصيرة ومركزة
            do_sample=True, 
            temperature=0.4,        # توازن بين الذكاء والواقعية
            top_p=0.85,
            repetition_penalty=2.5,  # منع تكرار الرموز والأكواد نهائياً
            pad_token_id=tokenizer.eos_token_id
        )

    raw_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # 3. معالجة وتصفية الرد
    final_reply = clean_output(raw_response, user_msg)
    
    # إذا كان الرد فارغاً لسبب ما، نعطي رداً افتراضياً من الدستور
    if not final_reply or len(final_reply) < 2:
        final_reply = "I am ALI, under Walid Fodha's command."

    print(f"ALI: {final_reply}")
    print("-" * 50)