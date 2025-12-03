import re

with open('secure-proxy-server.py', 'r', encoding='utf-8') as f:
    content = f.read()

old_text = '    app.run(host=HOST, port=PORT, debug=False)'
new_text = '''    # Try to use production WSGI server if available
    try:
        from waitress import serve
        print("🚀 Starting production WSGI server (Waitress)...")
        serve(app, host=HOST, port=PORT)
    except ImportError:
        print("⚠️  Waitress not installed. Using Flask dev server.")
        print("💡 Install for production: pip install waitress")
        app.run(host=HOST, port=PORT, debug=False)'''

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('secure-proxy-server.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✅ File updated successfully')
else:
    print('❌ Pattern not found')
