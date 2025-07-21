// Fetch and analyze the new CSV data (version 2)
async function fetchAndAnalyzeNewCSVv2() {
  try {
    console.log("Fetching new CSV data (version 2)...")
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Area-Name-Address-Phone%20%282%29-ifK4mhZ0Xied8jNQ7Qn1gHbO5EqL2R.csv",
    )
    const csvText = await response.text()

    console.log("Raw CSV content (first 1000 chars):")
    console.log(csvText.slice(0, 1000))

    // Parse CSV manually with better handling
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("\nHeaders:", headers)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        // Handle CSV parsing with potential commas in addresses
        const line = lines[i]
        const values = []
        let current = ""
        let inQuotes = false

        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim().replace(/"/g, ""))
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim().replace(/"/g, ""))

        if (values.length >= 4) {
          data.push({
            area: values[0],
            name: values[1],
            address: values[2],
            phone: values[3],
          })
        }
      }
    }

    console.log(`\nParsed ${data.length} records`)
    console.log("\nFirst 15 records:")
    data.slice(0, 15).forEach((record, index) => {
      console.log(`${index + 1}:`, record)
    })

    // Analyze areas
    const areas = [...new Set(data.map((record) => record.area))].filter(Boolean).sort()
    console.log(`\nUnique areas (${areas.length}):`)
    areas.forEach((area, index) => {
      console.log(`${index + 1}. ${area}`)
    })

    // Analyze cities from addresses
    const cityPatterns = {
      Vadodara: /vadodara|baroda/i,
      Ahmedabad: /ahmedabad|amdavad/i,
      Surat: /surat/i,
      Rajkot: /rajkot/i,
      Bharuch: /bharuch/i,
      Anand: /anand/i,
      Gandhinagar: /gandhinagar/i,
    }

    const cityDistribution = {}
    data.forEach((record) => {
      const address = record.address || ""
      let cityFound = "Unknown"

      for (const [city, pattern] of Object.entries(cityPatterns)) {
        if (pattern.test(address)) {
          cityFound = city
          break
        }
      }

      if (!cityDistribution[cityFound]) {
        cityDistribution[cityFound] = 0
      }
      cityDistribution[cityFound]++
    })

    console.log("\nCity distribution:")
    Object.entries(cityDistribution).forEach(([city, count]) => {
      console.log(`${city}: ${count} mechanics`)
    })

    // Group by area
    const areaGroups = {}
    data.forEach((record) => {
      if (!areaGroups[record.area]) {
        areaGroups[record.area] = []
      }
      areaGroups[record.area].push(record)
    })

    console.log("\nMechanics per area:")
    Object.entries(areaGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([area, mechanics]) => {
        console.log(`${area}: ${mechanics.length} mechanics`)
      })

    // Analyze phone number patterns
    const phonePatterns = {
      valid: 0,
      invalid: 0,
      formats: {},
    }

    data.forEach((record) => {
      const phone = record.phone
      if (phone && phone.match(/^\+91\d{10}$/)) {
        phonePatterns.valid++
      } else {
        phonePatterns.invalid++
      }

      const format = phone ? phone.replace(/\d/g, "X") : "No phone"
      phonePatterns.formats[format] = (phonePatterns.formats[format] || 0) + 1
    })

    console.log("\nPhone number analysis:")
    console.log(`Valid: ${phonePatterns.valid}, Invalid: ${phonePatterns.invalid}`)
    console.log("Phone formats:")
    Object.entries(phonePatterns.formats).forEach(([format, count]) => {
      console.log(`  ${format}: ${count}`)
    })

    return { data, areas, cityDistribution, areaGroups }
  } catch (error) {
    console.error("Error fetching CSV:", error)
    return { data: [], areas: [], cityDistribution: {}, areaGroups: {} }
  }
}

fetchAndAnalyzeNewCSVv2()
