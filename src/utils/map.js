import { loadModules } from 'esri-loader';
import NProgress from 'nprogress';
import { getConfig } from './request';

// NOTE: module, not global scope
let _Graphic;

// lazy load the ArcGIS API modules and CSS
// then create a new map view at an element
export async function loadMap(element, updateXY) {
  const config = await getConfig();
  NProgress.start();
  const [WebMap, MapView, Graphic, LayerList, Expand] = await loadModules(
    [
      'esri/WebMap',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/widgets/LayerList',
      'esri/widgets/Expand',
    ],
    {
      css: true,
    },
  );
  if (!element) {
    // component or app was likely destroyed
    return;
  }
  // hold onto the graphic class for later use
  _Graphic = Graphic;

  // create the Map
  const map = new WebMap({
    portalItem: {
      id: config.webMapId,
    },
  });

  // show the map at the element
  let view = new MapView({
    map,
    container: element,
  });
  // wait for the view to load
  return view.when(() => {
    const expand = new Expand({
      view: view,
      content: new LayerList({
        view: view,
        container: document.createElement('div'),
      }),
    });

    view.ui.add(expand, 'top-right');

    //run updateXY on map click
    view.on('click', (e) =>
      updateXY(e.mapPoint.longitude, e.mapPoint.latitude),
    );
    view.on('mouse-wheel', function (evt) {
      evt.stopPropagation();
    });

    NProgress.done();
    // return a reference to the view
    return view;
  });
}

export function addPoint(view, center) {
  if (!_Graphic) {
    throw new Error('You must load a map before creating new graphics');
  }
  if (!view || !view.ready) {
    return;
  }
  // clear any existing graphics (if any)
  view.graphics.removeAll();
  const { x, y } = center;
  const marker = {
    type: 'simple-marker',
    style: 'circle',
    size: 12,
    color: [22, 30, 46],
    outline: {
      color: [244, 244, 244],
      width: 1,
    },
  };
  const pointGraphic = new _Graphic({
    geometry: {
      type: 'point',
      x,
      y,
    },
    symbol: marker,
  });
  view.graphics.addMany([pointGraphic]);
  view.goTo({ center: [x, y], zoom: 15 }, { duration: 1000 });
}
