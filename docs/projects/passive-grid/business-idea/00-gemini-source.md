# Gemini Source Extraction

**Source:** [Designing Proprietary Atmospheric Water Generation](https://share.gemini.google/qS0VN4WEAgkJ) → resolves to https://gemini.google.com/share/eed8cc7a7de2  
**Extracted:** 2026-07-14  
**Status:** Primary ideation + engineering research document

## Conversation arc

1. **System architecture** — MOF/sorbent-based AWG vs traditional refrigeration dehumidifiers
2. **Software stack** — Next.js PWA, optional Ionic Capacitor mobile, FastAPI/Supabase telemetry path
3. **Telemetry hardware** — ESP32-S3 → pivoted to **Raspberry Pi 5** + Touch Display 2
4. **Enclosures** — 3D-printed PETG with thermal-isolated BME280 sensor pod
5. **BOM & sourcing** — ~$561–638 USD bench prototype, Ontario/Canada distributors prioritized
6. **Wiring schematic** — System Block Diagram: Power Bus, Data Bus, Actuator Bus
7. **Grid-down variant** — Passive desiccant + solar still (no electronics)

## Long-term product vision (proprietary)

| Stage | Mechanism |
|-------|-----------|
| Air intake | Variable-speed DC fans + coarse pre-filter + HEPA |
| Capture core | MOF structured matrix — adsorption at ambient RH, desorption via low-grade heat |
| Condensation | Micro-channel heat exchanger in closed desorption loop |
| Purification | UV-C sterilization + remineralization cartridge (pH 7.5–8.0) |
| Control | Edge ML — Magnus-Tetens dew point, predictive humidity scheduling |

**Assumption:** MOFs are not off-the-shelf for bench prototype; chat recommends zeolite/silica desiccant for Phase 1 testing.

## Bench prototype architecture (Phase 1 — what we're building first)

### Compute & UI
- Raspberry Pi 5 (4GB) — bench prototype brain
- Raspberry Pi Touch Display 2 (7") — kiosk-mode local UI
- Target final product: Raspberry Pi CM4 on custom PCB

### Sensors (Data Bus — 3.3V logic)
| Sensor | Protocol | Pi connection |
|--------|----------|---------------|
| BME280 (ambient T/RH/P) | I2C | 3.3V Pin 1, GND Pin 9, SDA GPIO2 Pin 3, SCL GPIO3 Pin 5 |
| YF-S201 flow meter | Digital pulse | 5V power, GND, signal GPIO17 Pin 11 **via voltage divider** |
| TDS probe | Analog | Requires ADS1115 I2C ADC between probe and Pi |

### Actuators (Actuator Bus — via 4-ch Relay HAT)
| Relay | GPIO | Load |
|-------|------|------|
| Relay 1 | GPIO 4 | PTC heater 12V (desorption) |
| Relay 2 | GPIO 27 | Condensation fans 12V |
| Relay 3 | GPIO 22 | Water pump 12V |
| Relay 4 | GPIO 23 | UV-C sterilizer 12V |

### Power Bus (split-voltage)
- **12V 15A** mains PSU → splits to Relay HAT common + 12V-to-5V buck converter
- **5V buck** → Pi GPIO Pin 2/4 + touchscreen
- **Shared ground** — 12V PSU negative, buck ground, Pi ground all tied together

### Purification chain
1. Collection basin (stainless)
2. UV-C (Viqua Sterilight S5Q-P-12VDC or RMS5 12V LP)
3. Carbon polish filter (Omnipure K2540 or T33 inline)
4. Calcite remineralization (Omnipure Q5548 or iSpring FA15)
5. 1/4" quick-connect tubing + push-fit valves

### Enclosure design notes
- PETG primary material; TPU gaskets for IP rating
- BME280 in separate vented pod (thermal isolation from Pi heat)
- PCB mounting bosses in 3D-printed enclosure
- Pi + display in front "clean room"; sensor pod external

## BOM summary (from Gemini research)

| Category | Est. cost (USD) |
|----------|-----------------|
| Water capture & thermal | ~$80–120 |
| Compute & telemetry | ~$170–200 |
| Sensors & edge control | ~$50–80 |
| Purification & plumbing | ~$150–250 (UV-C dominates) |
| Enclosure & power | ~$70–90 |
| **Prototype total** | **$561–638** |

## Collaborators mentioned
- **Danny** — referenced as potential build/strategy partner (role unconfirmed)

## Open items from source (not resolved in chat)
- Custom MOF material sourcing timeline
- Whether cloud telemetry is required or fully localized
- Grid-down passive variant vs powered smart variant — two product lines or one?
