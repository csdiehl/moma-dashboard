import { csvFormat, csvParse } from "d3-dsv"

async function fetchArtworks(url) {
  const res = await fetch(url)

  return res.text()
}

// ConstituentID,DisplayName,ArtistBio,Nationality,Gender,BeginDate,EndDate,Wiki QID,ULAN
const csvData = csvParse(
  await fetchArtworks(
    "https://media.githubusercontent.com/media/MuseumofModernArt/collection/refs/heads/main/Artists.csv"
  ),
  (d) => ({
    id: d.ConstituentID,
    name: d.DisplayName,
    nationality: d.Nationality,
  })
)

// write to stdout
process.stdout.write(csvFormat(csvData))
