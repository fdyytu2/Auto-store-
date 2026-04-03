#!/bin/bash
git add .
git commit -m "${1:-'Update minor'}"
git push
echo "✅ BOOM! Kode berhasil terbang ke GitHub."
