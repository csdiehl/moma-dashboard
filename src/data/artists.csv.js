import { csvFormat, csvParse } from "d3-dsv"
import { rollups } from "d3-array"

async function fetchArtworks(url) {
  const res = await fetch(url)

  return res.text()
}

const csvData = csvParse(
  await fetchArtworks(
    "https://media.githubusercontent.com/media/MuseumofModernArt/collection/refs/heads/main/Artworks.csv"
  ),
  (d) => ({
    artist: d.Artist,
    type: d["Classification"],
    height: +d["Height (cm)"],
    width: +d["Width (cm)"],
  })
).filter((d) => d.width && d.height)

const summaryData = rollups(
  csvData,
  (v) => v.length,
  (d) => d.type,
  (d) => d.artist
)
  .map((d) =>
    d[1]
      .map((x) => ({ type: d[0], artist: x[0], count: x[1] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  )
  .flat(2)
// write to stdout
process.stdout.write(csvFormat(summaryData))
