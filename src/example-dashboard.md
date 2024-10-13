---
theme: dashboard
title: Example dashboard
toc: false
---

# Artworks

<!-- Load and transform the data -->

```js
const artists = await FileAttachment("data/artists.csv").csv({typed: true});

const artworks = await FileAttachment("data/artworks.csv").csv({typed: true});

const dimensions = await FileAttachment("data/dimensions.csv").csv({typed: true});

console.log(dimensions)

```


<!-- Cards with big numbers -->

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Artworks in collection</h2>
    <span class="big">${dimensions.length.toLocaleString()}</span>
  </div>

  
   <div class="card">
    <h2>Average height</h2>
    <span class="big">${(d3.mean(dimensions, d => d.height)).toFixed(2)} cm</span>
  </div>

 <div class="card">
    <h2>Average width</h2>
    <span class="big">${(d3.mean(dimensions, d => d.width)).toFixed(2)} cm</span>
  </div>

   <div class="card">
    <h2>Average aspect ratio</h2>
    <span class="big">${(d3.mean(dimensions, d => d.aspectRatio)).toFixed(2)}</span>
  </div>
  
</div>

<!-- Plot of launch history -->

```js

function artSizes(dimensions, {width} = {}) {
  return Plot.plot({
    title: "Art dimensions",
    width,
    height: 300,
    y: {grid: true, label: "Height"},
    x: {grid: true, label: "Length"},
    marks: [
      Plot.rect(dimensions, {x1: 0, y1: 0, x2: 'width', y2: 'height', opacity: .1, fill: 'magenta'}),
    ]
  });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => artSizes(dimensions, {width}))}
  </div>
</div>


Data: Museum of Modern Art, [Collection](https://github.com/MuseumofModernArt/collection/)
