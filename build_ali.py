import torch
import os
from transformers import AutoConfig, AutoModelForCausalLM

# 1. Setting up the Core Parameters for 8GB RAM
# We are building a custom architecture for ALI_OS
ali_config = AutoConfig.from_pretrained(
    "gpt2", 
    n_embd=1024,      # Embedding dimension
    n_layer=12,       # Number of reasoning layers
    n_head=16,        # Attention heads
    vocab_size=50257  # Standard vocabulary size
)

print("--- [ SYSTEM : INITIALIZING ALI_OS CORE ] ---")

# 2. Building the Brain (Raw Model Architecture)
# This creates the structure before we inject the data
model = AutoModelForCausalLM.from_config(ali_config)

# 3. Validating the Constitution file (The data source)
constitution_path = "constitution.txt"

if os.path.exists(constitution_path):
    with open(constitution_path, "r", encoding="utf-8") as f:
        content = f.read()
    print("SUCCESS: Constitution file loaded successfully.")
    print(f"INFO: Core protocols for {constitution_path} are recognized.")
else:
    print("ERROR: constitution.txt not found in the project directory.")
    print("ACTION: Please create the file before running this script.")

# 4. Saving the Raw Base for later training/conversion
print("--- [ SYSTEM : SAVING RAW ARCHITECTURE ] ---")
output_dir = "./ALI_CORE_RAW"
model.save_pretrained(output_dir)

print("DONE: The raw core of ALI is ready in the folder: " + output_dir)
print("NEXT STEP: We will inject the logic into this core.")