import shutil
import os

next_dir = r"c:\Users\arshu\OneDrive\Desktop\CutnStitch\.next"
if os.path.exists(next_dir):
    shutil.rmtree(next_dir, ignore_errors=True)
    print(f"Deleted {next_dir}")
else:
    print(f"{next_dir} does not exist")
