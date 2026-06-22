import os
import PyPDF2

pdf_dir = r"c:\Users\KAIRO VILANE NATHAN\Desktop\MMS"
out_dir = os.path.join(pdf_dir, "_pdf_text")
os.makedirs(out_dir, exist_ok=True)

for fname in sorted(os.listdir(pdf_dir)):
    if not fname.lower().endswith(".pdf"):
        continue
    pdf_path = os.path.join(pdf_dir, fname)
    txt_name = fname.replace(".pdf", ".txt")
    txt_path = os.path.join(out_dir, txt_name)
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n\n---PAGE BREAK---\n\n"
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"OK: {fname} -> {txt_name} ({len(text)} chars)")
    except Exception as e:
        print(f"FAIL: {fname} -> {e}")
