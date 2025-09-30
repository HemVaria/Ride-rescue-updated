// Fetch and analyze the CSV data from the provided URL
async function fetchAndAnalyzeCSV() {
  try {
    console.log("Fetching CSV data from provided URL...")
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Area-Name-Address-Phone-1StB68xcI86aUoasJXRCLDT1SD5e37.csv",
    )
    const csvText = await response.text()

    console.log("CSV Data fetched successfully")
    console.log("First 500 characters:", csvText.slice(0, 500))

    // Parse CSV data
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())
    console.log("Headers:", headers)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.trim())
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

    console.log(`Parsed ${data.length} records`)
    console.log("Sample records:", data.slice(0, 5))

    // Analyze unique areas
    const uniqueAreas = [...new Set(data.map((record) => record.area))]
    console.log(`Found ${uniqueAreas.length} unique areas:`, uniqueAreas)

    return data
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    return []
  }
}

// Execute the analysis
fetchAndAnalyzeCSV()
