import PyPDF2
import sys
import os

# Get file path from command line argument or use default
if len(sys.argv) > 1:
    pdf_path = sys.argv[1]
else:
    pdf_path = r'C:\Users\AKHINOOR\Downloads\AI & PROMPT ENGINEERING- বাংলায় AI শেখা.pdf'

password = 'MOUnoor21014'

try:
    if not os.path.exists(pdf_path):
        print(f'File not found: {pdf_path}')
        sys.exit(1)
        
    pdf = PyPDF2.PdfReader(pdf_path, password=password)
    page = pdf.pages[0]
    box = page.mediabox
    
    width = float(box.width)
    height = float(box.height)
    
    print(f'Width: {width} points')
    print(f'Height: {height} points')
    print(f'Ratio (width/height): {width/height:.3f}')
    print(f'Size in inches: {width/72:.2f}" x {height/72:.2f}"')
    print(f'Total pages: {len(pdf.pages)}')
    
    # Check common paper sizes
    if abs(width - 595.28) < 5 and abs(height - 841.89) < 5:
        print('\nPage size: A4 (210mm x 297mm)')
    elif abs(width - 612) < 5 and abs(height - 792) < 5:
        print('\nPage size: Letter (8.5" x 11")')
    else:
        print(f'\nCustom page size: {width/72*25.4:.1f}mm x {height/72*25.4:.1f}mm')
        
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
