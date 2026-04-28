#!/bin/bash
echo "Cleaning logs and build artifacts..."

find . -type f -name "*.log" -delete
find . -type d -name "obj_dir" -exec rm -rf {} +

echo "Done."