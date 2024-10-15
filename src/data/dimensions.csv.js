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
    title: d.Title,
    artist: d.Artist,
    height: +d["Height (cm)"],
    width: +d["Width (cm)"],
    weight: +d["Weight(kg)"],
    aspectRatio: +d["Width (cm)"] / +d["Height (cm)"],
    area: +(d["Width (cm)"] * +d["Height (cm)"]).toFixed(3),
    type: d["Classification"],
    link: d["ImageURL"],
  })
).filter((d) => d.width && d.height)

// write to stdout
process.stdout.write(csvFormat(csvData))
