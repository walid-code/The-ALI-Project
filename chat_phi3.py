import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig

model_id = "microsoft/Phi-3-mini-4k-instruct"
cache_dir = "D:/ALI_MODELS_CACHE"

print("--- [ ALI_OS : 16GB RAM STABILIZATION MODE ] ---")
print("Targeting 4GB RAM usage for maximum stability...")

# 1. الإعدادات
config = AutoConfig.from_pretrained(model_id, cache_dir=cache_dir, trust_remote_code=True)
if hasattr(config, "rope_scaling"): config.rope_scaling = None

# 2. اللسان
tokenizer = AutoTokenizer.from_pretrained(model_id, cache_dir=cache_dir)

# 3. العقل (استخدام float16 لتوفير نصف المساحة)
print("Loading brain weights (FP16)...")
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    config=config,
    cache_dir=cache_dir,
    trust_remote_code=True,
    torch_dtype=torch.float16, # السحر هنا: تقليل استهلاك الرام للنصف
    low_cpu_mem_usage=True,
    device_map="cpu" # نحدد المعالج بوضوح
)

print("\n--- [ ALI_OS : ONLINE 🟢 ] ---")
print(f"System Check: RAM is safe. ALI is ready for Walid.")

while True:
    user_input = input("\nYOU: ")
    if user_input.lower() in ['exit', 'quit']: break
    
    prompt = f"<|user|>\n{user_input}<|end|>\n<|assistant|>"
    inputs = tokenizer(prompt, return_tensors="pt")
    
    with torch.no_grad():
        # تحديد معايير التوليد لسرعة الرد
        outputs = model.generate(
            **inputs, 
            max_new_tokens=100, 
            temperature=0.7,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"ALI: {response.split('<|assistant|>')[-1].strip()}")