import torch
import os
from transformers import AutoTokenizer, AutoModelForCausalLM

# --- خطوة تحديد المسار الجديد ---
# استبدل "D:/" بالحرف الخاص بقرصك الواسع (مثلاً E:/ إذا كان اسمه E)
new_path = "D:/ALI_MODELS_CACHE" 
if not os.path.exists(new_path):
    os.makedirs(new_path)

# إخبار بايثون باستخدام المسار الجديد للتحميل
os.environ['HF_HOME'] = new_path
os.environ['HUGGINGFACE_HUB_CACHE'] = new_path

print(f"--- [ SYSTEM : REDIRECTING STORAGE TO {new_path} ] ---")
print("--- [ SYSTEM : INSTALLING PHI-3 CORE FOR ALI_OS ] ---")

model_id = "microsoft/Phi-3-mini-4k-instruct"

print("Downloading Phi-3 to the new drive... Please wait.")
tokenizer = AutoTokenizer.from_pretrained(model_id, cache_dir=new_path)
model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    device_map="cpu", 
    torch_dtype="auto", 
    trust_remote_code=True,
    cache_dir=new_path
)

# حفظ النموذج النهائي في مجلد مشروعك كما فعلنا سابقاً
model.save_pretrained("./ALI_PHI3_CORE")
tokenizer.save_pretrained("./ALI_PHI3_CORE")

print("--- [ SUCCESS : ALI NOW HAS A PHI-3 BRAIN IN THE NEW DRIVE ] ---")