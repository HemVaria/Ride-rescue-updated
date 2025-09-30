// Fetch and analyze the new CSV data
async function fetchAndAnalyzeNewCSV() {
  try {
    console.log("Fetching new CSV data...")
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Area-Name-Address-Phone%20%281%29-9U6gO9FY771vQc3hImjL3dXEZ1CZib.csv",
    )
    const csvText = await response.text()

    console.log("Raw CSV content (first 1000 chars):")
    console.log(csvText.slice(0, 1000))

    // Parse CSV manually
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
    console.log("\nFirst 10 records:")
    data.slice(0, 10).forEach((record, index) => {
      console.log(`${index + 1}:`, record)
    })

    // Analyze areas
    const areas = [...new Set(data.map((record) => record.area))].filter(Boolean)
    console.log(`\nUnique areas (${areas.length}):`, areas)

    // Analyze cities from addresses
    const cities = [
      ...new Set(
        data.map((record) => {
          const address = record.address || ""
          const parts = address.split(",").map((p) => p.trim())
          // Look for city names in address
          for (const part of parts) {
            if (
              part.includes("Vadodara") ||
              part.includes("Ahmedabad") ||
              part.includes("Surat") ||
              part.includes("Rajkot") ||
              part.includes("Bharuch") ||
              part.includes("Anand")
            ) {
              return part.replace(/\s*-\s*\d+$/, "") // Remove pin codes
            }
          }
          return "Vadodara" // Default to Vadodara if no city found
        }),
      ).filter(Boolean),
    ]

    console.log(`\nCities found:`, cities)

    // Group by area
    const areaGroups = {}
    data.forEach((record) => {
      if (!areaGroups[record.area]) {
        areaGroups[record.area] = []
      }
      areaGroups[record.area].push(record)
    })

    console.log("\nMechanics per area:")
    Object.keys(areaGroups).forEach((area) => {
      console.log(`${area}: ${areaGroups[area].length} mechanics`)
    })

    return { data, areas, cities, areaGroups }
  } catch (error) {
    console.error("Error fetching CSV:", error)
    return { data: [], areas: [], cities: [], areaGroups: {} }
  }
}

fetchAndAnalyzeNewCSV()
