import os
import glob
import re

html_files = glob.glob('c:/ThietKeUX_UI/EcoRide/*.html')

pattern = r'(<div class="user-avatar" id="userAvatar">)\s*(<img[^>]+>)\s*(</div>)'
replacement = r'\1\n                        \2\n                        <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem; color: #6B7280; margin-left: 6px;"></i>\n                    \3'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
