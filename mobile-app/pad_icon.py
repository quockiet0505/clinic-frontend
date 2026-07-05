import sys
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

img_path = r"d:\Information Technology\LV_CNTT\core_code\clinic-frontend\mobile-app\assets\images\logo.png"
android_path = r"d:\Information Technology\LV_CNTT\core_code\clinic-frontend\mobile-app\assets\images\logo_icon_android.png"
ios_path = r"d:\Information Technology\LV_CNTT\core_code\clinic-frontend\mobile-app\assets\images\logo_icon_ios.png"

img = Image.open(img_path)
img = img.convert("RGBA")

w, h = img.size
max_dim = max(w, h)
# Make the canvas smaller relative to the logo so the logo appears larger (longer) inside the app icon.
# 0.9 means the logo takes up 90% of the icon's width.
canvas_size = int(max_dim / 0.9) 

canvas_android = Image.new("RGBA", (canvas_size, canvas_size), (255, 255, 255, 0))
canvas_ios = Image.new("RGBA", (canvas_size, canvas_size), (255, 255, 255, 255))

x = (canvas_size - w) // 2
y = (canvas_size - h) // 2

canvas_android.paste(img, (x, y), img)
canvas_android.save(android_path)

canvas_ios.paste(img, (x, y), img)
canvas_ios.save(ios_path)

print("Generated larger padded icons for Android and iOS.")
