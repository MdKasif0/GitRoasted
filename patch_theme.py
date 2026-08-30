import re

# Patch globals.css
with open('src/app/globals.css', 'r') as f:
    css = f.read()

# Replace :root and .dark variables
new_vars = """  :root, .dark {
    --background: 0 0% 2%;
    --foreground: 0 0% 96%;
    --card: 0 0% 4%;
    --card-foreground: 0 0% 96%;
    --popover: 0 0% 6%;
    --popover-foreground: 0 0% 96%;
    --primary: 32 100% 50%;
    --primary-foreground: 0 0% 0%;
    --secondary: 0 0% 10%;
    --secondary-foreground: 0 0% 96%;
    --muted: 0 0% 12%;
    --muted-foreground: 215 14% 65%;
    --accent: 32 100% 60%;
    --accent-foreground: 0 0% 0%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 96%;
    --border: 0 0% 15%;
    --input: 0 0% 12%;
    --ring: 32 100% 50%;
    --radius: 0.75rem;
  }"""

css = re.sub(r'  :root \{.*?(?=\n\n|\n\})', new_vars, css, flags=re.DOTALL)
css = re.sub(r'  \.dark \{.*?(?=\n\n|\n\})', '', css, flags=re.DOTALL)
css = css.replace("  }", "}")

# Add radial background glow
css = re.sub(r'\.dark body \{[^}]*\}', '.dark body {\n    background-color: #050505;\n    background-image: radial-gradient(circle at 50% 0%, rgba(255,138,0,0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(147,51,234,0.03) 0%, transparent 40%);\n  }', css)

with open('src/app/globals.css', 'w') as f:
    f.write(css)

# Patch tailwind.config.ts
with open('tailwind.config.ts', 'r') as f:
    tw = f.read()

tw = tw.replace('extend: {', 'extend: {\n      boxShadow: {\n        "glow-orange": "0 0 20px -5px rgba(255, 138, 0, 0.4)",\n        "glow-orange-lg": "0 0 40px -10px rgba(255, 138, 0, 0.5)",\n      },')

with open('tailwind.config.ts', 'w') as f:
    f.write(tw)

print("Patched theme files.")
