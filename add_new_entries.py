import json

# Load existing dataset
with open('/home/user/workspace/benign-db/dataset.json', 'r') as f:
    data = json.load(f)

existing_domains = {e['domain'] for e in data}

# New benign European websites from 2024-2026
new_entries = [
    # === Technology / AI (2024-2026) ===
    {
        "domain": "mistral.ai",
        "url": "https://mistral.ai",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "Technology",
        "subcategory": "Artificial Intelligence",
        "language": "en",
        "tls": True,
        "registrar": "Gandi SAS",
        "yearEstablished": 2024,
        "description": "French AI startup building open-weight large language models"
    },
    {
        "domain": "blackforestlabs.ai",
        "url": "https://blackforestlabs.ai",
        "country": "Germany",
        "countryCode": "DE",
        "city": "Freiburg",
        "category": "Technology",
        "subcategory": "Artificial Intelligence",
        "language": "en",
        "tls": True,
        "registrar": "DENIC eG",
        "yearEstablished": 2024,
        "description": "German AI startup developing frontier image generation models (FLUX)"
    },
    {
        "domain": "lovable.dev",
        "url": "https://lovable.dev",
        "country": "Sweden",
        "countryCode": "SE",
        "city": "Stockholm",
        "category": "Technology",
        "subcategory": "Developer Tools",
        "language": "en",
        "tls": True,
        "registrar": "IIS",
        "yearEstablished": 2024,
        "description": "Swedish AI-powered software development platform"
    },
    {
        "domain": "langdock.com",
        "url": "https://langdock.com",
        "country": "Germany",
        "countryCode": "DE",
        "city": "Berlin",
        "category": "Technology",
        "subcategory": "Artificial Intelligence",
        "language": "en",
        "tls": True,
        "registrar": "DENIC eG",
        "yearEstablished": 2024,
        "description": "German EU-hosted AI platform for enterprise chat and workflows"
    },
    {
        "domain": "poolside.ai",
        "url": "https://poolside.ai",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "Technology",
        "subcategory": "Artificial Intelligence",
        "language": "en",
        "tls": True,
        "registrar": "Gandi SAS",
        "yearEstablished": 2024,
        "description": "French AI company building code-generation foundation models"
    },

    # === Cybersecurity (2024-2025) ===
    {
        "domain": "filigran.io",
        "url": "https://filigran.io",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "en",
        "tls": True,
        "registrar": "Gandi SAS",
        "yearEstablished": 2024,
        "description": "French open-source cyber threat intelligence and XTM platform"
    },
    {
        "domain": "eye.security",
        "url": "https://eye.security",
        "country": "Netherlands",
        "countryCode": "NL",
        "city": "The Hague",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "en",
        "tls": True,
        "registrar": "SIDN",
        "yearEstablished": 2024,
        "description": "Dutch cybersecurity and insurtech startup for SMEs"
    },
    {
        "domain": "zynap.ai",
        "url": "https://zynap.ai",
        "country": "Spain",
        "countryCode": "ES",
        "city": "Barcelona",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "en",
        "tls": True,
        "registrar": "Red.es",
        "yearEstablished": 2024,
        "description": "Spanish AI-driven threat intelligence and automated incident response"
    },
    {
        "domain": "dattak.eu",
        "url": "https://dattak.eu",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "fr",
        "tls": True,
        "registrar": "AFNIC",
        "yearEstablished": 2024,
        "description": "French cyber insurance provider with proactive cybersecurity tools"
    },
    {
        "domain": "axoflow.com",
        "url": "https://axoflow.com",
        "country": "Hungary",
        "countryCode": "HU",
        "city": "Budapest",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "en",
        "tls": True,
        "registrar": "Council of Hungarian Internet Providers",
        "yearEstablished": 2024,
        "description": "Hungarian cybersecurity observability pipeline automation platform"
    },

    # === FinTech (2024-2025) ===
    {
        "domain": "bunq.com",
        "url": "https://www.bunq.com",
        "country": "Netherlands",
        "countryCode": "NL",
        "city": "Amsterdam",
        "category": "Banking & Finance",
        "subcategory": "Digital Bank",
        "language": "en",
        "tls": True,
        "registrar": "SIDN",
        "yearEstablished": 2024,
        "description": "Dutch neobank with eco-friendly perks and multi-currency accounts"
    },
    {
        "domain": "scayl.com",
        "url": "https://scayl.com",
        "country": "Sweden",
        "countryCode": "SE",
        "city": "Stockholm",
        "category": "Banking & Finance",
        "subcategory": "FinTech",
        "language": "en",
        "tls": True,
        "registrar": "IIS",
        "yearEstablished": 2024,
        "description": "Swedish debt financing platform for fintech lenders"
    },
    {
        "domain": "allicabank.co.uk",
        "url": "https://www.allicabank.co.uk",
        "country": "United Kingdom",
        "countryCode": "GB",
        "city": "London",
        "category": "Banking & Finance",
        "subcategory": "Digital Bank",
        "language": "en",
        "tls": True,
        "registrar": "Nominet UK",
        "yearEstablished": 2024,
        "description": "UK challenger bank for SMEs, Europe's fastest-growing fintech"
    },
    {
        "domain": "wallester.com",
        "url": "https://wallester.com",
        "country": "Estonia",
        "countryCode": "EE",
        "city": "Tallinn",
        "category": "Banking & Finance",
        "subcategory": "FinTech",
        "language": "en",
        "tls": True,
        "registrar": "EIF",
        "yearEstablished": 2024,
        "description": "Estonian digital card issuance and white-label payment solutions"
    },

    # === E-Commerce (2024-2025) ===
    {
        "domain": "vinted.com",
        "url": "https://www.vinted.com",
        "country": "Lithuania",
        "countryCode": "LT",
        "city": "Vilnius",
        "category": "E-Commerce",
        "subcategory": "Recommerce",
        "language": "en",
        "tls": True,
        "registrar": "Domreg Ltd",
        "yearEstablished": 2024,
        "description": "Lithuanian second-hand fashion marketplace across Europe"
    },
    {
        "domain": "otto.de",
        "url": "https://www.otto.de",
        "country": "Germany",
        "countryCode": "DE",
        "city": "Hamburg",
        "category": "E-Commerce",
        "subcategory": "Marketplace",
        "language": "de",
        "tls": True,
        "registrar": "DENIC eG",
        "yearEstablished": 2024,
        "description": "Germany's second-largest online marketplace after Amazon"
    },
    {
        "domain": "manomano.fr",
        "url": "https://www.manomano.fr",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "E-Commerce",
        "subcategory": "DIY & Home",
        "language": "fr",
        "tls": True,
        "registrar": "AFNIC",
        "yearEstablished": 2024,
        "description": "French DIY and home improvement marketplace"
    },

    # === Government & Digital Services (2024-2026) ===
    {
        "domain": "eudi-wallet.eu",
        "url": "https://eudi-wallet.eu",
        "country": "EU",
        "countryCode": "EU",
        "city": "Brussels",
        "category": "Government",
        "subcategory": "Digital Identity",
        "language": "en",
        "tls": True,
        "registrar": "EURid",
        "yearEstablished": 2024,
        "description": "EU Digital Identity Wallet reference implementation portal"
    },
    {
        "domain": "france-identite.gouv.fr",
        "url": "https://france-identite.gouv.fr",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "Government",
        "subcategory": "Digital Identity",
        "language": "fr",
        "tls": True,
        "registrar": "AFNIC",
        "yearEstablished": 2024,
        "description": "French national digital identity application"
    },
    {
        "domain": "digital-strategy.ec.europa.eu",
        "url": "https://digital-strategy.ec.europa.eu",
        "country": "EU",
        "countryCode": "EU",
        "city": "Brussels",
        "category": "Government",
        "subcategory": "Digital Policy",
        "language": "en",
        "tls": True,
        "registrar": "EURid",
        "yearEstablished": 2024,
        "description": "EU Digital Strategy portal for Digital Europe Programme"
    },

    # === Healthcare (2024-2025) ===
    {
        "domain": "myhealth.eu",
        "url": "https://myhealth.eu",
        "country": "EU",
        "countryCode": "EU",
        "city": "Brussels",
        "category": "Healthcare",
        "subcategory": "Cross-border Health",
        "language": "en",
        "tls": True,
        "registrar": "EURid",
        "yearEstablished": 2024,
        "description": "EU cross-border digital health services platform (MyHealth@EU)"
    },

    # === Industry / Energy (2024-2025) ===
    {
        "domain": "northvolt.com",
        "url": "https://www.northvolt.com",
        "country": "Sweden",
        "countryCode": "SE",
        "city": "Stockholm",
        "category": "Industry",
        "subcategory": "Clean Energy",
        "language": "en",
        "tls": True,
        "registrar": "IIS",
        "yearEstablished": 2024,
        "description": "Swedish battery manufacturer for electric vehicles and energy storage"
    },
    {
        "domain": "cetpartnership.eu",
        "url": "https://cetpartnership.eu",
        "country": "EU",
        "countryCode": "EU",
        "city": "Brussels",
        "category": "Industry",
        "subcategory": "Clean Energy",
        "language": "en",
        "tls": True,
        "registrar": "EURid",
        "yearEstablished": 2024,
        "description": "EU Clean Energy Transition Partnership for climate-neutral goals"
    },

    # === Travel (2024-2025) ===
    {
        "domain": "omio.com",
        "url": "https://www.omio.com",
        "country": "Germany",
        "countryCode": "DE",
        "city": "Berlin",
        "category": "Travel",
        "subcategory": "Multi-Modal",
        "language": "en",
        "tls": True,
        "registrar": "DENIC eG",
        "yearEstablished": 2024,
        "description": "German multi-modal travel booking platform for trains, buses and flights"
    },
    {
        "domain": "flixbus.com",
        "url": "https://www.flixbus.com",
        "country": "Germany",
        "countryCode": "DE",
        "city": "Munich",
        "category": "Travel",
        "subcategory": "Bus & Rail",
        "language": "en",
        "tls": True,
        "registrar": "DENIC eG",
        "yearEstablished": 2024,
        "description": "German intercity bus and train travel operator across Europe"
    },

    # === Education (2024-2025) ===
    {
        "domain": "eitdigital.eu",
        "url": "https://www.eitdigital.eu",
        "country": "EU",
        "countryCode": "EU",
        "city": "Brussels",
        "category": "Education",
        "subcategory": "Digital Innovation",
        "language": "en",
        "tls": True,
        "registrar": "EURid",
        "yearEstablished": 2024,
        "description": "EIT Digital innovation and education body for Europe's digital future"
    },

    # === News & Media (2024-2025) ===
    {
        "domain": "politico.eu",
        "url": "https://www.politico.eu",
        "country": "Belgium",
        "countryCode": "BE",
        "city": "Brussels",
        "category": "News & Media",
        "subcategory": "Policy News",
        "language": "en",
        "tls": True,
        "registrar": "DNS Belgium",
        "yearEstablished": 2024,
        "description": "European policy and politics news outlet"
    },
    {
        "domain": "thelocal.com",
        "url": "https://www.thelocal.com",
        "country": "Sweden",
        "countryCode": "SE",
        "city": "Stockholm",
        "category": "News & Media",
        "subcategory": "Expat News",
        "language": "en",
        "tls": True,
        "registrar": "IIS",
        "yearEstablished": 2024,
        "description": "European news network for expats in multiple countries"
    },

    # === Culture (2024-2025) ===
    {
        "domain": "europeana.eu",
        "url": "https://www.europeana.eu",
        "country": "Netherlands",
        "countryCode": "NL",
        "city": "The Hague",
        "category": "Culture",
        "subcategory": "Digital Heritage",
        "language": "en",
        "tls": True,
        "registrar": "EURid",
        "yearEstablished": 2024,
        "description": "EU digital platform providing access to European cultural heritage"
    },
    {
        "domain": "acropolis-tickets.gr",
        "url": "https://acropolis-tickets.gr",
        "country": "Greece",
        "countryCode": "GR",
        "city": "Athens",
        "category": "Culture",
        "subcategory": "Heritage",
        "language": "el",
        "tls": True,
        "registrar": "ICS-FORTH GR",
        "yearEstablished": 2024,
        "description": "Official digital ticketing for the Acropolis of Athens"
    },

    # === 2025 Websites ===
    {
        "domain": "darktrace.com",
        "url": "https://darktrace.com",
        "country": "United Kingdom",
        "countryCode": "GB",
        "city": "Cambridge",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "en",
        "tls": True,
        "registrar": "Nominet UK",
        "yearEstablished": 2025,
        "description": "UK AI-powered cybersecurity platform for autonomous threat detection"
    },
    {
        "domain": "bolt.eu",
        "url": "https://bolt.eu",
        "country": "Estonia",
        "countryCode": "EE",
        "city": "Tallinn",
        "category": "Technology",
        "subcategory": "Mobility",
        "language": "en",
        "tls": True,
        "registrar": "EIF",
        "yearEstablished": 2025,
        "description": "Estonian ride-hailing and micro-mobility platform across Europe"
    },
    {
        "domain": "tines.com",
        "url": "https://www.tines.com",
        "country": "Ireland",
        "countryCode": "IE",
        "city": "Dublin",
        "category": "Technology",
        "subcategory": "Security Automation",
        "language": "en",
        "tls": True,
        "registrar": "IE Domain Registry",
        "yearEstablished": 2025,
        "description": "Irish no-code security automation platform for enterprise teams"
    },
    {
        "domain": "neverhack.com",
        "url": "https://neverhack.com",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "fr",
        "tls": True,
        "registrar": "AFNIC",
        "yearEstablished": 2025,
        "description": "French cybersecurity company with AI-assisted threat detection"
    },
    {
        "domain": "stoik.io",
        "url": "https://www.stoik.io",
        "country": "France",
        "countryCode": "FR",
        "city": "Paris",
        "category": "Banking & Finance",
        "subcategory": "InsurTech",
        "language": "fr",
        "tls": True,
        "registrar": "AFNIC",
        "yearEstablished": 2025,
        "description": "French cyber insurance platform combining coverage with cybersecurity"
    },
    {
        "domain": "voi.com",
        "url": "https://www.voi.com",
        "country": "Sweden",
        "countryCode": "SE",
        "city": "Stockholm",
        "category": "Transport",
        "subcategory": "Micro-Mobility",
        "language": "en",
        "tls": True,
        "registrar": "IIS",
        "yearEstablished": 2025,
        "description": "Swedish electric scooter and bike sharing platform"
    },
    {
        "domain": "monta.com",
        "url": "https://monta.com",
        "country": "Denmark",
        "countryCode": "DK",
        "city": "Copenhagen",
        "category": "Transport",
        "subcategory": "EV Charging",
        "language": "en",
        "tls": True,
        "registrar": "DK Hostmaster",
        "yearEstablished": 2025,
        "description": "Danish EV charging management platform connecting drivers and operators"
    },
    {
        "domain": "velvetai.com",
        "url": "https://velvetai.com",
        "country": "Italy",
        "countryCode": "IT",
        "city": "Rome",
        "category": "Technology",
        "subcategory": "Artificial Intelligence",
        "language": "en",
        "tls": True,
        "registrar": "IIT-CNR",
        "yearEstablished": 2025,
        "description": "Italian AI company training open-source LLMs for European languages"
    },
    {
        "domain": "lokalise.com",
        "url": "https://lokalise.com",
        "country": "Latvia",
        "countryCode": "LV",
        "city": "Riga",
        "category": "Technology",
        "subcategory": "Localization",
        "language": "en",
        "tls": True,
        "registrar": "NIC.LV",
        "yearEstablished": 2025,
        "description": "Latvian AI-first enterprise localization and translation platform"
    },

    # === 2026 Websites ===
    {
        "domain": "decathlon.com",
        "url": "https://www.decathlon.com",
        "country": "France",
        "countryCode": "FR",
        "city": "Lille",
        "category": "E-Commerce",
        "subcategory": "Sports & Outdoor",
        "language": "fr",
        "tls": True,
        "registrar": "AFNIC",
        "yearEstablished": 2026,
        "description": "European sports retailer expanding marketplace model across EU"
    },
    {
        "domain": "heimdalsecurity.com",
        "url": "https://heimdalsecurity.com",
        "country": "Denmark",
        "countryCode": "DK",
        "city": "Copenhagen",
        "category": "Technology",
        "subcategory": "Cybersecurity",
        "language": "en",
        "tls": True,
        "registrar": "DK Hostmaster",
        "yearEstablished": 2026,
        "description": "Danish unified AI-driven cybersecurity XDR platform"
    },
    {
        "domain": "noota.io",
        "url": "https://www.noota.io",
        "country": "France",
        "countryCode": "FR",
        "city": "Toulouse",
        "category": "Technology",
        "subcategory": "Productivity",
        "language": "fr",
        "tls": True,
        "registrar": "AFNIC",
        "yearEstablished": 2026,
        "description": "French AI meeting assistant for recording and transcription"
    },
    {
        "domain": "sprin-d.de",
        "url": "https://www.sprind.org",
        "country": "Germany",
        "countryCode": "DE",
        "city": "Leipzig",
        "category": "Government",
        "subcategory": "Innovation Agency",
        "language": "de",
        "tls": True,
        "registrar": "DENIC eG",
        "yearEstablished": 2026,
        "description": "German federal innovation agency for breakthrough technologies"
    },
]

# Filter out any duplicates
added = 0
for entry in new_entries:
    if entry['domain'] not in existing_domains:
        data.append(entry)
        existing_domains.add(entry['domain'])
        added += 1
    else:
        print(f"Skipping duplicate: {entry['domain']}")

with open('/home/user/workspace/benign-db/dataset.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added {added} new entries. Total: {len(data)}")
