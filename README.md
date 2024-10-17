# Moma Dashboard

## Project architecture

This project takes advantage of several exciting features of Framework, including client-side SQL, JSX components, and reactivity. 

**`src/index.md`** - This is the home page for the app. The app registers a client-side SQL table called "artworks" using DuckDB WASM. SQL-fenced code blocks filter the data for performant data-fetching and fast user interaction, and the results are stored as global variables using the `id` parameter. 

The main visualizations are rendered using `Observable plot`. The image card component is a React component, rendered using Observable Framework's JSX functionality. 

**`src/data`** - This project contains two data loaders, one for the artwork dimensions and one for the artists table. Both are written in Node.js using `d3.csv` to parse raw csv files from Github and save them as csv files with selected variables, and new computed variables such as area and aspect ratio. 

The output of the dimensions loader is used to create the DuckDB table. 

The output of the artists loader is a dataset with the top 10 artists in each category, by how many works they produced. This is used for the bar chart visualization.

**`src/components/charts`** - Contains Observable `Plot` functions to render the visualizations, separating the data visualization logic from the narrative markdown in `index.md`.

## Data visualization design

The design of the dashboard moves from high-level metrics to more granular details. It follows a well-established dashboard design principle of showing several views of the same data, keeping the narrative focused on a small subset of variables. 

A bubble chart positions the selected category against all other types of art in the museum, showing how many works there are relative to the whole collection. Plot's `link` mark is used to render diagonal lines representing common aspect ratios for artwork encoded as slope, relating the height and width to familiar labels that people think about when creating drawings or photos. 

For showing the top 10 artworks by size, a Mekko chart shows the 2 variables (height and width) in a compact and intuitive format. 

The third visualization overlays `Rect` marks to create a heatmap showing the most commmon dimensions in the entire category.

## Running in Development

This is an [Observable Framework](https://observablehq.com/framework) app. To start the local preview server, run:

```
yarn dev
```

Then visit <http://localhost:3000> to preview your app.

For more, see <https://observablehq.com/framework/getting-started>.

## Deployment

To build the project as a static website, run:  

```
yarn build

```

Site assets will be available in the `./dist` folder and can be deployed to any static-site hosting service. 

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `yarn install`            | Install or reinstall dependencies                        |
| `yarn dev`        | Start local preview server                               |
| `yarn build`      | Build your static site, generating `./dist`              |
| `yarn deploy`     | Deploy your app to Observable                            |
| `yarn clean`      | Clear the local data loader cache                        |
| `yarn observable` | Run commands like `observable help`                      |
