---
theme: dashboard
title: MoMa Collection
toc: false

sql:
  artworks: ./data/dimensions.csv
---

<!-- Plot components -->
```js
import {artSizeChart, mekko, scatterplot} from './components/charts.js'
```
<!-- Dashboard -->
# Sizing up the MoMa Collection

## choose a category to explore the dimensions of the artwork

```sql id=allData
SELECT count(*) as count from artworks
```

<!-- USER INPUT - choose a medium -->
```sql id=artTypes
SELECT type, count(*) as works from artworks group by type
```

```js
const selectedMedium = view(Inputs.select([...artTypes].filter(d => d.works >= 10 && d.type !== '(not assigned)').map(d => d.type), {value: "Drawing", label: "Museum Section"}));
```

<!-- Cards with big numbers -->
<div class="grid grid-cols-4">
  <div class="card">
    <h2>Artworks in collection</h2>
    <span class="big">${[...selectedData].length.toLocaleString()}</span>
  </div>

  <div class="card">
    <h2>Average height</h2>
    <span class="big">${(d3.mean(selectedData, d => d.height) / 2.54).toFixed(2)} in</span>
  </div>

  <div class="card">
    <h2>Average width</h2>
    <span class="big">${(d3.mean(selectedData, d => d.width) / 2.54).toFixed(2)} in</span>
  </div>

  <div class="card">
    <h2>Average aspect ratio</h2>
    <span class="big">${(d3.mean(selectedData, d => d.aspectRatio)).toFixed(2)}</span>
  </div>
</div>


```sql id=worksByType
SELECT type, avg(width) as avg_width, avg(height) as avg_height, count(*) as works from artworks 
where type != 'Document'
group by type 
```

In the first plot below, we can see that most works at MoMa are printed materials with an approximately square aspect ratio - they're just as tall as they are wide. Films are typically widescreen, while graphic design and posters tend to be more vertical.

Here's how ${selectedMedium} compares to other categories of art at MoMa. ${selectedMedium} makes up 
${(([...selectedData].length / [...allData][0].count) * 100).toFixed(2) }\% of the collection. 


<div class='grid grid-cols-1'>
  <div class="card">
    ${resize((width) => scatterplot(worksByType, {width}, selectedMedium))}
  </div>
</div>


```sql id=selectedData
SELECT title, artist, area, aspectRatio, width, height, link from artworks where type = ${selectedMedium} order by area DESC
```

Most works at MoMa are small and square, but the collection boasts a few extraordinarily large and small pieces! Jennifer Bartlett's Rhapsody, for example, runs wider than the length of two city buses. Some sculptures are no wider than a postcard. 

Now let's look specifically at this category, ${selectedMedium}. The plots below show each piece of art sized by its length and height. 

```js
const sizeInput = Inputs.radio(["smallest", "largest"], {label: "size by", value: "largest"});
const size = Generators.input(sizeInput);
```

<div class="grid grid-cols-2">
  <div class="card">
  <h2>Top 10 ${size} by area in ${selectedMedium}</h2>
  <div style="margin: 8px 0;">
  ${sizeInput}
  </div>
    ${resize((width) => mekko(size === 'smallest' ? [...selectedData].slice( [...selectedData].length -10 , [...selectedData].length ) : [...selectedData].slice(0,10), {width}, size))}
  </div>

  <div class="card">
    ${resize((width) => artSizeChart(selectedData, {width}, selectedMedium))}
  </div>
</div>


As a reward for getting this far, let's look at some actual art. Here are the biggest and smallest works in ${selectedMedium} that have an image link recorded in the data. If the work does not have a valid image link, it won't be shown.


```jsx
function ImageCard({title, image}) {
  return <div>
    <h2>{title}</h2>
    <img style={{aspectRatio: image.aspectRatio, borderRadius: '8px', objectFit: 'cover' }} height={200} src={image.link}/>
    <p style={{color: 'lightgrey', margin: '0 0 8px'}}>{image.title} by {image.artist}</p> 
  </div>
}

function ImageCards() {
  const images = [...selectedData].filter(d => d.link)
  const largest = images[0]
  const smallest = images[images.length - 1]
  return <div class='card'>
  <ImageCard title='largest work' image={largest} />

  <ImageCard title='smallest work' image={smallest} />
</div>
}

display(<ImageCards/>)
```

Data: Museum of Modern Art, [Collection](https://github.com/MuseumofModernArt/collection/)
