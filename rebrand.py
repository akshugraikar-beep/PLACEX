import os
import re

def replace_in_file(file_path, replacements):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    root_dir = r'c:\Users\AKSHAY\Downloads\PlaceX-Smarter_Placements-Sharper_Talent-main\PlaceX-Smarter_Placements-Sharper_Talent-main'
    exclude_dirs = {'.git', 'node_modules', 'dist', 'build', '.next', '.vercel', '__pycache__'}
    exclude_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.exe', '.dll', '.pyc'}

    replacements = [
        (r'PlaceX', 'PlaceX'),
        (r'PlaceX', 'placex'),
        (r'PlaceX', 'PLACEX')
    ]

    for root, dirs, files in os.walk(root_dir):
        # Filter directories in-place
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if any(file.lower().endswith(ext) for ext in exclude_extensions):
                continue
            
            file_path = os.path.join(root, file)
            replace_in_file(file_path, replacements)

if __name__ == "__main__":
    main()
