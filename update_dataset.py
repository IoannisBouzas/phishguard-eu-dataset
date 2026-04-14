#!/usr/bin/env python3
"""
Helper script for the daily cron task to add new benign websites.
Usage: python3 update_dataset.py '<json array of new entries>'

Each entry must have: domain, url, country, countryCode, city, category, subcategory, language, tls, registrar, yearEstablished, description

Deduplicates by domain. Prints summary of what was added.
"""

import json
import sys
import os

DATASET_PATH = "/home/user/workspace/benign-db/dataset.json"

def load_dataset():
    with open(DATASET_PATH, "r") as f:
        return json.load(f)

def save_dataset(data):
    with open(DATASET_PATH, "w") as f:
        json.dump(data, f, indent=2)

def add_entries(new_entries):
    data = load_dataset()
    existing_domains = {e["domain"] for e in data}
    
    added = []
    skipped = []
    
    for entry in new_entries:
        if entry["domain"] not in existing_domains:
            data.append(entry)
            existing_domains.add(entry["domain"])
            added.append(entry["domain"])
        else:
            skipped.append(entry["domain"])
    
    if added:
        save_dataset(data)
    
    return {
        "added": added,
        "skipped": skipped,
        "total": len(data)
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 update_dataset.py '<json array of new entries>'")
        sys.exit(1)
    
    new_entries = json.loads(sys.argv[1])
    result = add_entries(new_entries)
    print(json.dumps(result, indent=2))
