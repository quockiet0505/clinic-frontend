import json
import matplotlib.pyplot as plt
import os

# Thư mục chứa các file log
logs_dir = r"D:\Information Technology\LV_CNTT\core_code\clinic-frontend\admin-web\src\assets\data\ai_logs"

# Danh sách các file tương ứng với từng model
files = {
    "Qwen": "qwen_trainer_state_v2.json",
    "SeaLLM": "seallm_trainer_state_v2.json",
    "VinaLlama": "vinallama_trainer_state_v2.json"
}

# Khởi tạo biểu đồ chung
plt.figure(figsize=(12, 6))

# Màu sắc cho từng model
colors = {"Qwen": "blue", "SeaLLM": "green", "VinaLlama": "red"}

for model_name, filename in files.items():
    path = os.path.join(logs_dir, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        history = data.get("log_history", [])
        
        train_steps = []
        train_loss = []
        
        eval_steps = []
        eval_loss = []
        
        # Duyệt qua lịch sử log
        for entry in history:
            step = entry.get("step")
            if "loss" in entry:
                train_steps.append(step)
                train_loss.append(entry["loss"])
            if "eval_loss" in entry:
                eval_steps.append(step)
                eval_loss.append(entry["eval_loss"])
                
        # Vẽ đường Training loss (nét liền)
        if train_steps:
            plt.plot(train_steps, train_loss, label=f"{model_name} Train Loss", color=colors[model_name], linestyle="-", alpha=0.6)
            
        # Vẽ đường Eval loss (nét đứt, có điểm tròn)
        if eval_steps:
            plt.plot(eval_steps, eval_loss, label=f"{model_name} Eval Loss", color=colors[model_name], linestyle="--", marker="o")

# Cấu hình các thông số hiển thị
plt.xlabel("Steps")
plt.ylabel("Loss")
plt.title("Training & Evaluation Loss")
plt.legend()
plt.grid(True)
plt.tight_layout()

# Lưu ảnh hoặc hiển thị
output_path = os.path.join(logs_dir, "loss_plot_combined.png")
plt.savefig(output_path)
print(f"Saved plot to: {output_path}")

# Nếu bạn chạy bằng Jupyter/Colab hoặc có màn hình hiển thị, có thể mở dòng này:
# plt.show()
