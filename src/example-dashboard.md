---
theme: dashboard
title: Example dashboard
toc: false

sql:
  artworks: ./data/dimensions.csv
---

# Artworks

## choose a medium to explore the dimensions

<!-- USER INPUT - choose a medium -->

```sql id=artTypes

SELECT type, count(*) as works from artworks group by type

```

```js

const selectedMedium = view(Inputs.select([...artTypes].filter(d => d.works >= 10).map(d => d.type), {value: "Drawing", label: "Medium"}));

```

<!-- Cards with big numbers -->

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Artworks in collection</h2>
    <span class="big">${[...selectedData].length.toLocaleString()}</span>
  </div>

  
   <div class="card">
    <h2>Average height</h2>
    <span class="big">${(d3.mean(selectedData, d => d.height)).toFixed(2)} cm</span>
  </div>

 <div class="card">
    <h2>Average width</h2>
    <span class="big">${(d3.mean(selectedData, d => d.width)).toFixed(2)} cm</span>
  </div>

   <div class="card">
    <h2>Average aspect ratio</h2>
    <span class="big">${(d3.mean(selectedData, d => d.aspectRatio)).toFixed(2)}</span>
  </div>
  
</div>

<!-- OVERVIEW VIZ -->

```sql id=worksByType
SELECT type, avg(width) as avg_width, avg(height) as avg_height, count(*) as works from artworks group by type

```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => scatterplot(worksByType, {width}))}
  </div>
</div>





<!-- Plot of all art dimensions -->

```js

function scatterplot(data, {width} = {}) {
    return Plot.plot({
    title: "Art dimensions",
    width,
    height: 400,
    y: {grid: true, label: "Height", type: 'log'},
    x: {grid: true, label: "Length", type: 'log'},
    marks: [
      Plot.dot(data, Plot.pointer({x: "avg_width", y: "avg_height", fill: "black",stroke: '#FFF', r: 'works', channels: {type: "type"}, tip: true})),
      Plot.dot(data, {x: "avg_width", y: "avg_height", r: "works", fill: 'magenta', fillOpacity: d => selectedMedium === d.type ? .5 : .2, stroke: 'magenta', strokeOpacity:  d => selectedMedium === d.type ? 1 : .5 }),
    ]
  });
}


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
    ${resize((width) => artSizes(selectedData, {width}))}
  </div>
</div>

```sql id=selectedData

SELECT title, artist,  area, aspectRatio, width, height, link from artworks where type = ${selectedMedium} order by area DESC

```

```jsx

const fontStyles = {fontSize: '.75rem', lineHeight: '1rem', margin: 0, padding: 0}

function TopTable() {
  if (!selectedData) return
  const top10works = [...selectedData].filter(d => d.link).slice(0,10)
  // scales so that the largest painting is 100% of the viewport
  const widthScale = d3.scaleLinear(d3.extent(top10works, d => d.width), [0, 100])
  return <div>
  <h2 style={{margin: '24px 0'}}>10 largest in {selectedMedium}</h2>
      {top10works.map(d => {
      return <> <div style={{display: 'grid', gridGap: '8px', marginBottom: '16px', alignItems: 'center', gridTemplateColumns: '200px minmax(0, 1fr)'}}>

         <div>
      <p style={fontStyles}>{d.title}</p>
      <p style={{...fontStyles, color: 'magenta'}}>{d.artist}</p>
      </div>
    
      <img src={d.link} style={{aspectRatio: d.aspectRatio, width: `${widthScale(d.width)}%`, maxWidth: '100%'}}></img>
    
      </div><hr/></>
     
      })}
  </div>
}


display(<TopTable />)


```





Data: Museum of Modern Art, [Collection](https://github.com/MuseumofModernArt/collection/)
