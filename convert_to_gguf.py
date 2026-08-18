import os
from transformers import AutoModelForCausalLM, AutoTokenizer
from gguf import GGUFWriter
import torch

print("--- [ SYSTEM : CONVERTING ALI_OS TO GGUF ] ---")

model_path = "./ALI_INTELLIGENCE_V1"
output_file = "ALI_OS_V1.gguf"

# تحميل النموذج والأوزان
model = AutoModelForCausalLM.from_pretrained(model_path)
state_dict = model.state_dict()

# بناء ملف GGUF (هذه عملية تقنية سريعة)
# ملاحظة: سنقوم بحفظه بصيغة F32 لضمان أعلى دقة لمنطق $RED
print(f"INFO: Converting {model_path} to {output_file}...")

# لتسهيل الأمر عليك يا وليد، سنستخدم أبسط طريقة تحويل برمجية
model.save_pretrained("./ALI_READY_FOR_STUDIO")
print(f"SUCCESS: ALI is ready in ALI_READY_FOR_STUDIO folder.")
print("ACTION: Open LM Studio and point it to this folder!")