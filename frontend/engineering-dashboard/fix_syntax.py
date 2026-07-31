import sys

files = [
    'js/pages/pages_ai.js', 
    'js/pages/pages_system.js'
]

for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if '\\`' in content:
            new_content = content.replace('\\`', '`')
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed escaped backticks in {file}')
        else:
            print(f'No escaped backticks found in {file}')
            
    except Exception as e:
        print(f'Error processing {file}: {e}')
