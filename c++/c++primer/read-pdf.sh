#!/bin/bash

# PDF Reader Script - reads specific pages with TTS
# Usage: ./read-pdf.sh <pdf-file> <start-page> <end-page>

PDF="$1"
START="${2:-1}"
END="${3:-$START}"

if [ -z "$PDF" ]; then
    echo "Usage: $0 <pdf-file> <start-page> [end-page]"
    echo "Example: $0 'C++ Primer.pdf' 45 50"
    exit 1
fi

if [ ! -f "$PDF" ]; then
    echo "Error: PDF file not found: $PDF"
    exit 1
fi

# Extract and read the pages
echo "Reading pages $START to $END from: $(basename "$PDF")"
echo "Press Ctrl+C to stop"
echo ""

pdftotext -f "$START" -l "$END" "$PDF" - | espeak-ng -s 160 -v en-us

echo ""
echo "Finished reading."
