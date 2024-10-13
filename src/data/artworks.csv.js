import { csvFormat, csvParse } from "d3-dsv"

async function fetchArtworks(url) {
  const res = await fetch(url)

  return res.text()
}

// Title,Artist,ConstituentID,ArtistBio,Nationality,BeginDate,EndDate,Gender,Date,Medium,Dimensions,CreditLine,AccessionNumber,Classification,Department,DateAcquired,Cataloged,ObjectID,URL,ImageURL,OnView,Circumference (cm),Depth (cm),Diameter (cm),Height (cm),Length (cm),Weight (kg),Width (cm),Seat Height (cm),Duration (sec.)
// 156638 artworks
const csvData = csvParse(
  await fetchArtworks(
    "https://media.githubusercontent.com/media/MuseumofModernArt/collection/refs/heads/main/Artworks.csv"
  ),
  (d) => ({
    id: d.ConstituentID,
    title: d.Title,
    artist: d.Artist,
    nationality: d.Nationality,
    dimensions: d.Dimensions,
    height: +d["Height (cm)"],
    width: +d["Seat Height (cm)"],
    weight: +d["Weight(kg)"],
  })
)

// write to stdout
process.stdout.write(csvFormat(csvData))
