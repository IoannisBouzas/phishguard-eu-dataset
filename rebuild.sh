#!/bin/bash
# Rebuild and prepare the dashboard for redeployment
# Called by the weekly cron task

set -e
cd /home/user/workspace/benign-db

# Count entries in dataset
TOTAL=$(python3 -c "import json; print(len(json.load(open('dataset.json'))))")
echo "Dataset has $TOTAL entries"

# Remove old database so it re-seeds
rm -f data.db

# Build the production bundle
npm run build 2>&1

echo "Build complete. Ready for deployment."
echo "TOTAL_ENTRIES=$TOTAL"
