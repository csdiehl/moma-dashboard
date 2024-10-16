---
theme: dashboard
title: MoMa Collection
toc: false

sql:
  artworks: ./data/dimensions.csv
---

<!-- Plot functions -->
```js

const COLOR = 'magenta'

// common aspect ratios for art: ratio is y / x = height / width
const aspectRatios = [
{label: "16:9", value: .5625}, 
{label: "3:2", value: .667}, 
{label: "4:3", value: ".75" },
{label: "square", value: 1}, 
{label: "2:3", value: 1.5} ]

const typesToLabel = ['Sculpture', 'Graphic Design', 'Painting', 'Film', 'Print']

function scatterplot(data, {width} = {}) {
    const maxWidth = d3.max([...worksByType], d => d.avg_width) / 2.54
    const widthIn = (d) => d["avg_width"]/2.54
    const heightIn = (d) => d['avg_height']/2.54
    return Plot.plot({
    title: `Size of collection and avg. dimensions for ${selectedMedium} compared to all categories`,
    subtitle: "Lines show common aspect ratios for artwork",
    width,
    height: 400,
    y: {grid: false, label: "Height in in.", type: 'linear', ticks: 5},
    x: {grid: false, label: "Width in in.", type: 'linear', ticks: 5},
    r: {legend: true, range: [2,40]},
    marks: [
      // the diagonal lines
      Plot.link(aspectRatios, {
        x1: 0,
        y1: 0,
        x2: maxWidth,
        y2: (k) => maxWidth * k.value,
        stroke: '#FFF',
        strokeWidth: 1,
        strokeDasharray: [2,2],
        strokeOpacity: (k) => k.value === 1 ? 1 : .5,
      }),
      // labels for aspect ratios
      Plot.text(aspectRatios, {
      x: maxWidth,
      y: (k) => maxWidth * k.value,
      text: 'label',
      textAnchor: "start",
      dx: 6
    }),
      // points
      Plot.dot(data, Plot.pointer({x: d => widthIn(d), y: d => heightIn(d), fill: "black",stroke: '#FFF', r: 'works', channels: {type: "type"}, tip: true})),
      Plot.dot(data, {x: d => widthIn(d), y: d => heightIn(d), r: "works", fill: COLOR, fillOpacity: d => selectedMedium === d.type ? .5 : .2, stroke: COLOR, strokeOpacity:  d => selectedMedium === d.type ? 1 : .5 }),

    Plot.text([...data].filter(d => typesToLabel.includes(d.type)), {
      x: d => widthIn(d), 
      y: d => heightIn(d) + 5, 
      fontSize: '.875rem',
      text: d => d.type,
    })

    
    ]
  });
}

const largeLabels =  ['parking\n space', 'avg. house', 'bus', 'NY city block'] 
const largeTicks = [274, 1158, 1828, 8000]


function artSizes(dimensions, {width} = {}) {
  const largest = d3.max([...dimensions], d => d.width)
  return Plot.plot({
    title: `Dimensions of all works in ${selectedMedium}`,
    width,
    height: 400,
    y: {grid: true, label: "Height in in."},
    x: {grid: true, label: "Width", ticks: largeTicks, tickFormat: (d,i) => `${d <= largest ? largeLabels[i] : ""}` },
    marks: [
      Plot.rect(dimensions, {x1: 0, y1: 0, x2: 'width', y2: d => d['height']/2.54, opacity: .1, fill: COLOR}),
    ]
  });
}

function mekko(data, {width} = {}) {
  const widthLabels = size === 'largest' ? largeLabels : ['stamp', 'postcard', 'paper']

  const widthTicks = size === 'largest' ? largeTicks : [2.2, 14.8, 22]
  const largest = d3.max([...data], d => d.width)
  return Plot.plot({
    width,
    height: 400,
    x: {label: "Width", ticks: widthTicks, tickFormat: (d,i) => `${d <= largest ? widthLabels[i] : ""}` },
    y: {label: "Total height in in.", ticks: 5},
    marks: [
      Plot.rectX(data, Plot.stackY({
        y: d => d['height']/2.54,
        x2: 'width',
        order: 'area',
        insetBottom: .5,
        insetTop: .5,
        fill: COLOR,
        fillOpacity: .5,
        tip: true,
        channels: {title: 'title', artist: 'artist'},
      }))
    ]
  })
}

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
    ${resize((width) => scatterplot(worksByType, {width}))}
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
    ${resize((width) => mekko(size === 'smallest' ? [...selectedData].slice( [...selectedData].length -10 , [...selectedData].length ) : [...selectedData].slice(0,10), {width}))}
  </div>

  <div class="card">
    ${resize((width) => artSizes(selectedData, {width}))}
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
