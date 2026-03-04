"""
PDF Password Protection Tool - A3KM Studio
==========================================
Automatically add password protection to PDF files for A3KM Studio books.

Usage:
    python add_pdf_password.py <input_pdf> [output_pdf]

Examples:
    python add_pdf_password.py "mybook.pdf"
    python add_pdf_password.py "input.pdf" "protected_output.pdf"
"""

import sys
import os
from PyPDF2 import PdfReader, PdfWriter

# A3KM Studio default password
A3KM_PASSWORD = 'MOUnoor21014'

def add_password_to_pdf(input_path, output_path=None, password=A3KM_PASSWORD):
    """
    Add password protection to a PDF file.
    
    Args:
        input_path: Path to input PDF file
        output_path: Path to output PDF file (optional)
        password: Password to use (default: A3KM_PASSWORD)
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Check if input file exists
        if not os.path.exists(input_path):
            print(f"❌ Error: File not found: {input_path}")
            return False
        
        # Generate output path if not provided
        if output_path is None:
            base, ext = os.path.splitext(input_path)
            output_path = f"{base}_protected{ext}"
        
        print(f"📖 Reading: {input_path}")
        
        # Read the input PDF
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        # Get PDF info
        num_pages = len(reader.pages)
        print(f"📄 Pages: {num_pages}")
        
        # Check if already password protected
        if reader.is_encrypted:
            print("⚠️  Warning: PDF is already password-protected")
            try:
                # Try to decrypt with A3KM password
                if reader.decrypt(password):
                    print("✅ Successfully decrypted with A3KM password")
                else:
                    print("❌ Error: PDF has different password. Cannot process.")
                    return False
            except:
                print("❌ Error: Cannot decrypt PDF")
                return False
        
        # Copy all pages
        print("📋 Copying pages...")
        for page in reader.pages:
            writer.add_page(page)
        
        # Copy metadata if available
        if reader.metadata:
            writer.add_metadata(reader.metadata)
        
        # Add password protection
        print(f"🔐 Adding password protection...")
        writer.encrypt(password, algorithm="AES-256")
        
        # Write the output file
        print(f"💾 Writing: {output_path}")
        with open(output_path, 'wb') as output_file:
            writer.write(output_file)
        
        # Verify file was created
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
            print(f"✅ Success! Password-protected PDF created")
            print(f"📊 Output size: {file_size:.2f} MB")
            print(f"🔑 Password: {password}")
            return True
        else:
            print("❌ Error: Failed to create output file")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def batch_process_directory(directory, password=A3KM_PASSWORD):
    """
    Process all PDF files in a directory.
    
    Args:
        directory: Directory containing PDF files
        password: Password to use
    """
    if not os.path.isdir(directory):
        print(f"❌ Error: Directory not found: {directory}")
        return
    
    print(f"\n🔍 Scanning directory: {directory}")
    print("=" * 60)
    
    pdf_files = [f for f in os.listdir(directory) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print("No PDF files found in directory")
        return
    
    print(f"Found {len(pdf_files)} PDF file(s)\n")
    
    success_count = 0
    for i, filename in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}] Processing: {filename}")
        print("-" * 60)
        
        input_path = os.path.join(directory, filename)
        base, ext = os.path.splitext(filename)
        output_filename = f"{base}_protected{ext}"
        output_path = os.path.join(directory, output_filename)
        
        if add_password_to_pdf(input_path, output_path, password):
            success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Successfully processed: {success_count}/{len(pdf_files)} files")

def check_pdf_password(pdf_path, password=A3KM_PASSWORD):
    """
    Check if a PDF has the correct password.
    
    Args:
        pdf_path: Path to PDF file
        password: Password to check
    """
    try:
        reader = PdfReader(pdf_path)
        
        if not reader.is_encrypted:
            print(f"⚠️  {pdf_path}: Not password-protected")
            return False
        
        if reader.decrypt(password):
            print(f"✅ {pdf_path}: Correct password ({password})")
            return True
        else:
            print(f"❌ {pdf_path}: Incorrect password")
            return False
            
    except Exception as e:
        print(f"❌ Error checking {pdf_path}: {e}")
        return False

def main():
    """Main function to handle command-line usage."""
    print("=" * 60)
    print("🔐 PDF Password Protection Tool - A3KM Studio")
    print("=" * 60)
    print(f"Default Password: {A3KM_PASSWORD}\n")
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Single file:  python add_pdf_password.py <input.pdf> [output.pdf]")
        print("  Directory:    python add_pdf_password.py --batch <directory>")
        print("  Check:        python add_pdf_password.py --check <pdf_file>")
        print("\nExamples:")
        print('  python add_pdf_password.py "mybook.pdf"')
        print('  python add_pdf_password.py "input.pdf" "protected.pdf"')
        print('  python add_pdf_password.py --batch "./books"')
        print('  python add_pdf_password.py --check "mybook.pdf"')
        sys.exit(1)
    
    # Check mode
    if sys.argv[1] == '--check':
        if len(sys.argv) < 3:
            print("❌ Error: Please specify PDF file to check")
            sys.exit(1)
        check_pdf_password(sys.argv[2])
        sys.exit(0)
    
    # Batch mode
    if sys.argv[1] == '--batch':
        if len(sys.argv) < 3:
            print("❌ Error: Please specify directory for batch processing")
            sys.exit(1)
        batch_process_directory(sys.argv[2])
        sys.exit(0)
    
    # Single file mode
    input_pdf = sys.argv[1]
    output_pdf = sys.argv[2] if len(sys.argv) > 2 else None
    
    success = add_password_to_pdf(input_pdf, output_pdf)
    
    if success:
        print("\n✅ All done! Your PDF is now password-protected.")
        print("💡 Upload this PDF to your website and it will open automatically!")
        sys.exit(0)
    else:
        print("\n❌ Failed to process PDF")
        sys.exit(1)

if __name__ == '__main__':
    main()
