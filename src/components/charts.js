import * as Plot from "npm:@observablehq/plot"
import * as d3 from "npm:d3"

const COLOR = "#03DAC5"

const selectedMedium = "Drawing"

// common aspect ratios for art: ratio is y / x = height / width
const aspectRatios = [
  { label: "16:9", value: 0.5625 },
  { label: "3:2", value: 0.667 },
  { label: "4:3", value: ".75" },
  { label: "square", value: 1 },
  { label: "2:3", value: 1.5 },
]

const typesToLabel = [
  "Sculpture",
  "Graphic Design",
  "Painting",
  "Film",
  "Print",
]

export function scatterplot(data, { width } = {}, selectedMedium) {
  const maxWidth = d3.max([...data], (d) => d.avg_width) / 2.54
  const widthIn = (d) => d["avg_width"] / 2.54
  const heightIn = (d) => d["avg_height"] / 2.54
  return Plot.plot({
    title: `Size of collection and avg. dimensions for ${selectedMedium} compared to all categories`,
    subtitle: "Lines show common aspect ratios for artwork",
    width,
    height: 400,
    y: { grid: false, label: "Height in in.", type: "linear", ticks: 5 },
    x: { grid: false, label: "Width in in.", type: "linear", ticks: 5 },
    r: { legend: true, range: [2, 40] },
    marks: [
      // the diagonal lines
      Plot.link(aspectRatios, {
        x1: 0,
        y1: 0,
        x2: maxWidth,
        y2: (k) => maxWidth * k.value,
        stroke: "#FFF",
        strokeWidth: 1,
        strokeDasharray: [2, 2],
        strokeOpacity: (k) => (k.value === 1 ? 1 : 0.5),
      }),
      // labels for aspect ratios
      Plot.text(aspectRatios, {
        x: maxWidth,
        y: (k) => maxWidth * k.value,
        text: "label",
        textAnchor: "start",
        dx: 6,
      }),
      // points
      Plot.dot(
        data,
        Plot.pointer({
          x: (d) => widthIn(d),
          y: (d) => heightIn(d),
          fill: "black",
          stroke: "#FFF",
          r: "works",
          channels: { type: "type" },
          tip: true,
        })
      ),
      Plot.dot(data, {
        x: (d) => widthIn(d),
        y: (d) => heightIn(d),
        r: "works",
        fill: COLOR,
        fillOpacity: (d) => (selectedMedium === d.type ? 0.5 : 0.2),
        stroke: COLOR,
        strokeOpacity: (d) => (selectedMedium === d.type ? 1 : 0.5),
      }),

      Plot.text(
        [...data].filter((d) => typesToLabel.includes(d.type)),
        {
          x: (d) => widthIn(d),
          y: (d) => heightIn(d) + 5,
          fontSize: ".875rem",
          text: (d) => d.type,
        }
      ),
    ],
  })
}

const largeLabels = ["parking\n space", "avg. house", "bus", "NY city block"]
const largeTicks = [274, 1158, 1828, 8000]

export function artSizeChart(dimensions, { width } = {}, selectedMedium) {
  const largest = d3.max([...dimensions], (d) => d.width)
  return Plot.plot({
    title: `Dimensions of all works in ${selectedMedium}`,
    width,
    height: 400,
    y: { grid: true, label: "Height in in." },
    x: {
      grid: true,
      label: "Width",
      ticks: largeTicks,
      tickFormat: (d, i) => `${d <= largest ? largeLabels[i] : ""}`,
    },
    marks: [
      Plot.rect(dimensions, {
        x1: 0,
        y1: 0,
        x2: "width",
        y2: (d) => d["height"] / 2.54,
        opacity: 0.1,
        fill: COLOR,
      }),
    ],
  })
}

export function mekko(data, { width } = {}, size) {
  const widthLabels =
    size === "largest" ? largeLabels : ["stamp", "postcard", "paper"]

  const widthTicks = size === "largest" ? largeTicks : [2.2, 14.8, 22]
  const largest = d3.max([...data], (d) => d.width)
  return Plot.plot({
    width,
    height: 400,
    x: {
      label: "Width",
      ticks: widthTicks,
      tickFormat: (d, i) => `${d <= largest ? widthLabels[i] : ""}`,
    },
    y: { label: "Total height in in.", ticks: 5 },
    marks: [
      Plot.rectX(
        data,
        Plot.stackY({
          y: (d) => d["height"] / 2.54,
          x2: "width",
          order: "area",
          insetBottom: 0.5,
          insetTop: 0.5,
          fill: COLOR,
          fillOpacity: 0.5,
          tip: true,
          channels: { title: "title", artist: "artist" },
        })
      ),
    ],
  })
}
