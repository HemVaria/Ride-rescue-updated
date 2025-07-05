import fetch from "node-fetch"

// Analyze the latest CSV data
async function analyzeLatestCSV() {
  try {
    console.log("🔍 Analyzing latest CSV data...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/latestt%20Area-Name-Address-Phone%20%283%29-IouJ36FUgmrpXHbTKE2Y9mQtmZ3kxI.csv",
    )
    const csvText = await response.text()

    console.log("📊 CSV Content Preview:")
    console.log(csvText.substring(0, 500) + "...\n")

    // Parse CSV
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    console.log("📋 Headers:", headers)

    const records = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      if (values.length >= 4) {
        records.push({
          area: values[0],
          name: values[1],
          address: values[2],
          phone: values[3],
        })
      }
    }

    console.log(`\n📈 Analysis Results:`)
    console.log(`Total Records: ${records.length}`)

    // Group by area
    const areaGroups = {}
    records.forEach((record) => {
      if (!areaGroups[record.area]) {
        areaGroups[record.area] = []
      }
      areaGroups[record.area].push(record)
    })

    console.log(`\n🏢 Areas Found: ${Object.keys(areaGroups).length}`)
    Object.keys(areaGroups).forEach((area) => {
      console.log(`  • ${area}: ${areaGroups[area].length} mechanics`)
    })

    // Sample records
    console.log("\n📝 Sample Records:")
    records.slice(0, 5).forEach((record, index) => {
      console.log(`${index + 1}. ${record.name}`)
      console.log(`   Area: ${record.area}`)
      console.log(`   Address: ${record.address}`)
      console.log(`   Phone: ${record.phone}\n`)
    })

    // Generate enhanced data for fallback
    console.log("🔧 Generating enhanced fallback data...")

    const enhancedData = {
      areas: [],
      mechanics: [],
    }

    let areaId = 1
    let mechanicId = 1

    Object.keys(areaGroups).forEach((areaName) => {
      // Add area
      enhancedData.areas.push({
        id: areaId,
        area_name: areaName,
        city: "Vadodara",
        state: "Gujarat",
        latitude: 22.3072 + (Math.random() - 0.5) * 0.1,
        longitude: 73.1812 + (Math.random() - 0.5) * 0.1,
      })

      // Add mechanics for this area
      areaGroups[areaName].forEach((record) => {
        const services = [
          "Engine Repair",
          "AC Service",
          "General Service",
          "Brake Service",
          "Battery Service",
          "Towing Service",
          "Emergency Service",
        ]

        enhancedData.mechanics.push({
          id: mechanicId,
          name: record.name,
          phone: record.phone,
          address: record.address,
          area_id: areaId,
          latitude: 22.3072 + (Math.random() - 0.5) * 0.1,
          longitude: 73.1812 + (Math.random() - 0.5) * 0.1,
          rating: (4.0 + Math.random() * 1.0).toFixed(1),
          verified: Math.random() > 0.3,
          services: services.slice(0, 3 + Math.floor(Math.random() * 4)),
        })

        mechanicId++
      })

      areaId++
    })

    console.log(`✅ Generated ${enhancedData.areas.length} areas and ${enhancedData.mechanics.length} mechanics`)

    return enhancedData
  } catch (error) {
    console.error("❌ Error analyzing CSV:", error)
    throw error
  }
}

// Execute analysis
analyzeLatestCSV()
  .then((data) => {
    console.log("\n🎉 Analysis completed successfully!")
    console.log("📊 Data ready for integration")
  })
  .catch((error) => {
    console.error("💥 Analysis failed:", error)
  })
